'use strict'
const Controller = require('egg').Controller
class ShareController extends Controller {
	//创建分享
	async create() {
		const {
			ctx,
			app,
			service
		} = this
		//凡是牵扯到authUser，都需要配置拦截
		let user_id = ctx.authUser.id
		ctx.validate({
			file_id: {
				type: 'int',
				required: true,
				dexc: '文件ID',
			}
		})
		let {
			file_id
		} = ctx.request.body
		let f = await app.model.File.findOne({
			where: {
				id: file_id,
				user_id,
			}
		})
		if (!f) {
			return ctx.throw(404, '文件不存在')
		}
		let sharedurl = ctx.genID(15)
		let s = await app.model.Share.create({
			sharedurl,
			file_id,
			iscancel: 0,
			user_id,
		})
		let url = 'http:/127.0.0.1:7001/sharepage/' + sharedurl
		ctx.apiSuccess('分享链接:' + url)
	}

	//我的分享列表
	async list() {
		const {
			ctx,
			app
		} = this
		const user_id = ctx.authUser.id

		let list = await app.model.Share.findAndCountAll({
			where: {
				user_id,
			},
			include: [{
				model: app.model.File,
			}]
		})
		ctx.apiSuccess(list)
	}

	//查看分享
	async read() {
		const {
			ctx,
			app,
			service
		} = this;
		let sharedurl = ctx.params.sharedurl
		if (!sharedurl) {
			return ctx.apiFail('非法参数');
		}
		let file_id = ctx.query.file_id
		//分享是否存在
		let s = await service.share.isExist(sharedurl)

		let where = {
			user_id: s.user_id,
		}
		if (!file_id) {
			where.id = s.file_id
		} else {
			where.file_id = file_id
		}

		let rows = await app.model.File.findAll({
			where,
			order: [
				['isdir', 'desc']
			]
		})
		ctx.apiSuccess(rows)
	}
}

module.exports = ShareController
