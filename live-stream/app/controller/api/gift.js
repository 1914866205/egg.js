'use strict'

const Controller = require('egg').Controller
const await = require('await-stream-ready/lib/await')
class GiftController extends Controller {

	//礼物列表
	async list() {
		const {
			ctx,
			app
		} = this
		ctx.apiSuccess(await app.model.Gift.findAll())
	}
}

module.exports = GiftController
