'use strict'

const await = require('await-stream-ready/lib/await')

const Controller = require('egg').Controller

class LiveController extends Controller {
    async index() {
        const { ctx, app } = this
        let tabs = [
            {
                name: '全部',
                url: '/admin/live',
                active: false,
            },
            {
                name: '直播中',
                url: '?status=1',
                status: 1,
                active: false,
            },
            {
                name: '未开播',
                url: '?status=0',
                status: 0,
                active: false,
            },
            {
                name: '直播结束',
                url: '?status=3',
                status: 3,
                active: false,
            },
        ]
        let where =
            !ctx.query.status && ctx.query.status != 0
                ? {}
                : { status: ctx.query.status }
        let data = await ctx.page('Live', where, {
            include: [
                {
                    model: app.model.User,
                    attributes: ['id', 'username'],
                },
            ],
        })
        tabs = tabs.map((item) => {
            if (
                (!ctx.query.status &&
                    ctx.query.status != 0 &&
                    item.url === '/admin/live') ||
                item.status == ctx.query.status
            ) {
                item.active = true
            }
            return item
        })
        data = JSON.parse(JSON.stringify(data))
        await ctx.renderTemplate({
            title: '直播间管理',
            tempType: 'table',
            table: {
                tabs,
                // 表头
                columns: [
                    {
                        title: '直播间',
                        fixed: 'left',
                        render(item) {
                            return `<h2 class="table-avatar">
                        <a class="avatar mr-2"><img class="rounded" src="${item.cover}"></a>
                        <a>${item.title}<span>创建人:ceshi</span></a>
                        </h2>`
                        },
                    },
                    {
                        title: '观看人数',
                        key: 'look_count',
                        width: 180,
                        fixed: 'center',
                    },
                    {
                        title: '金币数',
                        key: 'coin',
                        width: 180,
                        fixed: 'center',
                    },
                    {
                        title: '创建时间',
                        key: 'created_time',
                        width: 180,
                        fixed: 'center',
                    },
                    {
                        title: '操作',
                        width: 200,
                        fixed: 'center',
                        render(item) {
                            let close = ''
                            if (item.status !== 3) {
                                close = `<a @click="modal('/admin/live/close/${item.id}','是否要关闭该直播间?')" class ="btn btn-sm bg-warning text-white">关闭直播</a>`
                            }
                            return `
                <div class ="actions btn-group btn-group-sm">
                <a @click="openInfo('/admin/live/look/${item.id}','观看记录')" class="btn btn-sm bg-primary text-white">观看记录</a>
                <a @click="openInfo('/admin/live/gift/${item.id}','礼物记录')" class="btn btn-sm bg-purple text-white">礼物记录</a>
                <a @click="openInfo('/admin/live/comment/${item.id}','弹幕记录')" class="btn btn-sm bg-success text-white">弹幕记录</a>
                ${close}
                <a @click="del('/admin/live/delete/${item.id}')" class="btn btn-sm bg-danger text-white">删除</a>
                </div>`
                        },
                    },
                ],
                data,
            },
        })
    }
    async update() {
        const { ctx, app } = this
        ctx.validate({
            id: {
                type: 'int',
                required: true,
            },
            name: {
                type: 'string',
                required: true,
            },
            image: {
                type: 'string',
            },
            coin: {
                type: 'int',
            },
        })
        const id = ctx.params.id
        const { name, image, coin } = ctx.request.body
        //   当前管理员是否存在
        const live = await app.model.Live.findOne({
            where: {
                id,
            },
        })
        if (!live) {
            return ctx.apiFail('该记录不存在')
        }
        live.name = name
        live.image = image
        live.coin = coin
        ctx.apiSuccess(await live.save())
    }
    async closelive() {
        const { ctx, app } = this
        const id = ctx.params.id
        const live = await app.model.Live.findOne({
            where: {
                id,
            },
        })
        if (!live) {
            ctx.toast('该直播间不存在', 'danger')
        } else if (live.status === 3) {
            ctx.toast('该直播间已结束', 'danger')
        } else {
            live.status = 3
            await live.save()
            ctx.toast('关闭成功', 'success')
        }
        ctx.redirect('/admin/live')
    }
    async delete() {
        const { ctx, app } = this
        const id = ctx.params.id
        await app.model.Live.destroy({
            where: {
                id,
            },
        })
        ctx.toast('删除成功', 'success')
        ctx.redirect(`/admin/live`)
    }
    //   观看记录
    async look() {
        const { ctx, app } = this
        const id = ctx.params.id
        const res = await app.model.LiveUser.findAll({
            where: {
                live_id: id,
            },
            include: [
                {
                    model: app.model.User,
                    attributes: ['id', 'username', 'avatar'],
                },
            ],
        })
        ctx.apiSuccess({
            ths: [
                {
                    title: '用户名',
                    key: 'username',
                },
                {
                    title: '观看时间',
                    key: 'created_time',
                },
            ],
            data: res.map((item) => {
                return {
                    id: item.id,
                    username: item.user.username,
                    avatar: item.user.avatar,
                    created_time: app.formatTime(item.created_time),
                }
            }),
        })
    }
    // 礼物记录
    async gift() {
        const { ctx, app } = this
        const id = ctx.params.id

        let res = await app.model.LiveGift.findAll({
            where: {
                live_id: id,
            },
            include: [
                {
                    model: app.model.User,
                    attributes: ['id', 'username', 'avatar'],
                },
                {
                    model: app.model.Gift,
                },
            ],
        })

        ctx.apiSuccess({
            ths: [
                {
                    title: '礼物名称',
                    key: 'gift_name',
                },
                {
                    title: '礼物图标',
                    key: 'gift_image',
                },
                {
                    title: '礼物金币',
                    key: 'gift_coin',
                },
                {
                    title: '赠送者',
                    key: 'username',
                },
                {
                    title: '赠送时间',
                    key: 'created_time',
                },
            ],
            data: res.map((item) => {
                return {
                    created_time: app.formatTime(item.created_time),
                    gift_name: item.gift.name,
                    gift_coin: item.gift.coin,
                    gift_image: item.gift.image,
                    usernameL: item.user.username,
                    avatar: item.user.avatar,
                }
            }),
        })
    }

    // 弹幕记录
    async comment() {
        const { ctx, app } = this
        const id = ctx.params.id

        const res = await app.model.Comment.findAll({
            where: {
                live_id: id,
            },
            include: [
                {
                    model: app.model.User,
                    attributes: ['id', 'username', 'avatar'],
                },
            ],
        })

        ctx.apiSuccess({
            ths: [
                {
                    title: '内容',
                    key: 'content',
                },
                {
                    title: '发送人',
                    key: 'username',
                },
                {
                    title: '发送时间',
                    key: 'created_time',
                },
            ],
            data: res.map((item) => {
                return {
                    content: item.content,
                    created_time: app.formatTime(item.created_time),
                    username: item.user.username,
                    avatar: item.user.avatar,
                }
            }),
        })
    }
}
module.exports = LiveController
