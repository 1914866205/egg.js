'use strict'

const Controller = require('egg').Controller

class TestController extends Controller {
  // 测试页面
  async page() {
    const { ctx, app } = this
    await ctx.render('1.html')
  }
}
module.exports = TestController