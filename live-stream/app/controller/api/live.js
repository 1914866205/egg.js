'use strict'

const Controller = require('egg').Controller
const await = require('await-stream-ready/lib/await')
// 引入md5模块
const md5 = require('md5')
class LiveController extends Controller {
	// 创建直播间
	async save() {
		let {
			ctx,
			app
		} = this
		let user_id = ctx.authUser.id

		// 参数验证
		ctx.validate({
			title: {
				required: true,
				type: 'string',
				desc: '直播间标题',
			},
			cover: {
				required: true,
				type: 'string',
				desc: '直播间封面',
			},
		})

		let {
			title,
			cover
		} = ctx.request.body

		// 生成唯一id
		let key = ctx.randomString(20)

		let res = await app.model.Live.create({
			title,
			cover,
			key,
			user_id,
		})

		// 生成签名
		let sign = this.sign(key)

		ctx.apiSuccess({
			data: res,
			sign,
		})
	}


	// 生成签名
	sign(key) {
		let {
			ctx,
			app
		} = this
		const secret = app.config.mediaServer.auth.secret
		let expire = parseInt((Date.now() + 100000000) / 1000)
		let hashValue = md5(`/live/${key}-${expire}-${secret}`)
		return `${expire}-${hashValue}`
	}
}

module.exports = LiveController
	