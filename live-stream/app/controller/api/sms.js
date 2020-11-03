'use strict'

const Controller = require('egg').Controller

class SmsController extends Controller {
  async sendCode() {
    const { ctx, service } = this
    const { phone } = ctx.request.body
    //调用service发送短信的方法，传入手机号
    console.log(phone);
    let res = await service.sms.sendCode(phone)
    console.log(res)
    console.log(res.sta)
    if (res.sta === 1) {
      ctx.apiSuccess('ok')
    }
  }
}

module.exports = SmsController
