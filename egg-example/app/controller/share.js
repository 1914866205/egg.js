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
		let url = 'http://127.0.0.1:7001/sharepage/' + sharedurl
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

	// 保存到自己网盘
	async saveToSelf() {
		const {
			ctx,
			app,
			service
		} = this;
		let current_user_id = ctx.authUser.id
		ctx.validate({
			dir_id: {
				type: "int",
				required: true,
				desc: "目录ID"
			},
			sharedurl: {
				type: "string",
				required: true,
				desc: "分享标识",
			},
		})
		let {
			dir_id,
			sharedurl
		} = ctx.request.body

		//分享是否存在
		let s = await service.share.isExist(sharedurl, {
			include: [{
				model: app.model.File
			}]
		})

		if (s.user_id === current_user_id) {
			return ctx.apiSuccess('本人分享，无需保存')
		}

		//文件是否存在
		if (dir_id > 0) {
			await service.file.isDirExist(dir_id)
		}
		// 查询该分享目录下的所有数据
		let getAllFile = async (obj, dirId) => {
			let data = {
				name: obj.name,
				ext: obj.ext,
				md: obj.md,
				file_id: dirId,
				user_id: current_user_id,
				size: obj.size,
				isdir: obj.isdir,
				url: obj.url,
			}
			//判断当前用户剩余时间
			if ((ctx.authUser.total_size - ctx.authUser.used_size) < data.size) {
				return ctx.throw(400, '你的可用内存不足')
			}
			//直接创建
			let o = await app.model.File.create(data)
			//更新User表的使用内存
			ctx.authUser.used_size = ctx.authUser.used_size + parseInt(data.size)
			await ctx.authUser.save()

			//目录
			if (obj.isdir) {
				//继续查询下面其他的数据
				let rows = await app.model.File.findAll({
					where: {
						user_id: obj.user_id,
						file_id: obj.id,
					}
				});
				rows.forEach((item) => {
					getAllFile(item, o.id)
				})
				return
			}
		}
		await getAllFile(s.file, dir_id)
		ctx.apiSuccess('ok')
	}

}
module.exports = ShareController
