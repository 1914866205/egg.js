'use strict'

const Service = require('egg').Service
class ShareService extends Service {
	async isExist(sharedurl, options = {}) {
		//先查找
		let s = await this.app.model.Share.findOne({
			where: {
				sharedurl,
				iscancel: 0,
			},
			...options,
		})
		if (!s) {
			return this.ctx.throw(404, '该分享已失效')
		}
		return s
	}
}

module.exports = ShareService
