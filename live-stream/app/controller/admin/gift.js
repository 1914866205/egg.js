' use strict'

const Controller = require('egg').Controller
const fields = [
    { label: '礼物名称', type: 'text', name: 'name', placeholder: '礼物名称' },
    {
        label: '礼物图标',
        type: 'file',
        name: 'image',
    },
    {
        label: '金币',
        type: 'number',
        name: 'coin',
        default: 0,
    },
]
class GiftController extends Controller {
    async index() {
        const { ctx, app } = this
        let data = await ctx.page('Gift')
        await ctx.renderTemplate({
            title: '礼物管理',
            tempType: 'table',
            table: {
                //按钮
                buttons: {
                    add: '/admin/gift/create',
                },
                //表头
                columns: [
                    {
                        title: '礼物图标',
                        fixed: 'left',
                        render(item) {
                            const image =
                                item.dataValues.image.indexOf('/') === 0
                                    ? item.dataValues.image
                                    : 'https://nttbucket.oss-cn-beijing.aliyuncs.com/gift/' +
                                      item.dataValues.image
                            return `
        <h2 class="table-avatar">
        <a class="avatar avatar-sm mr-2"><img class="avatar-img rounded-circle bg-light" src="${image}"> </a>
        </h2> `
                        },
                    },
                    {
                        title: '礼物名称',
                        key: 'name',
                        width: 180,
                        fixed: 'center',
                    },
                    {
                        title: '金币',
                        key: 'coin',
                        width: 180,
                        fixed: 'center',
                    },
                    {
                        title: '操作',
                        width: 200,
                        fixed: 'center',
                        action: {
                            edit: function (id) {
                                return `/admin/gift/edit/${id}`
                            },
                            delete: function (id) {
                                return `/admin/gift/delete/${id}`
                            },
                        },
                    },
                ],
                data,
            },
        })
    }

    async create() {
        const { ctx, app } = this
        await ctx.renderTemplate({
            title: '创建礼物',
            tempType: 'form',
            form: {
                //提交地址
                action: '/admin/gift',
                fields,
            },
            //新增成功跳转路径
            successUrl: '/admin/gift',
        })
    }

    async save() {
        const { ctx, app } = this
        //参数验证
        ctx.validate({
            name: {
                type: 'string',
                required: true,
                desc: '礼物名称',
            },
            image: {
                type: 'string',
            },
            coin: {
                type: 'int',
            },
        })
        let { name, image, coin } = ctx.request.body

        //创建礼物
        let gift = await app.model.Gift.create({
            name,
            image,
            coin,
        })
        if (!gift) {
            ctx.throw(400, '创建礼物失败')
        }
        ctx.apiSuccess(gift)
    }

    async edit() {
        const { ctx, app } = this
        const id = ctx.params.id
        let data = await app.model.Gift.findOne({
            where: {
                id,
            },
        })
        if (!data) {
            return await ctx.pageFail('该记录不存在')
        }
        data.image = 'https://nttbucket.oss-cn-beijing.aliyuncs.com/gift/' + data.image
        data = JSON.parse(JSON.stringify(data))
        await ctx.renderTemplate({
            id: ctx.params.id,
            title: '修改礼物',
            tempType: 'form',
            form: {
                //提交地址
                action: '/admin/gift/' + ctx.params.id,
                fields,
                data,
            },
            //新增成功跳转路径
            successUrl: '/admin/gift',
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
        //当前管理员是否存在
        let gift = await app.model.Gift.findOne({
            where: { id },
        })
        if (!gift) {
            return ctx.apiFail('该记录不存在')
        }
        gift.name = name
        gift.image = image
        console.log(image)
        gift.coin = coin
        console.log(gift)
        ctx.apiSuccess(await gift.save())
    }

    async delete() {
        const { ctx, app } = this
        const id = ctx.params.id
        await app.model.Gift.destroy({
            where: { id },
        })
        ctx.toast('删除成功', 'success')

        ctx.redirect(`/admin/gift`)
    }
}
module.exports = GiftController
