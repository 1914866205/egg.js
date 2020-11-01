'use strict'
const crypto = require('crypto')
module.exports = {
  // 成功提示
  apiSuccess(data = '', msg = 'ok', code = 200) {
    this.body = { msg, data }
    this.status = code
  },
  // 失败提示
  apiFail(data = '', msg = 'fail', code = 400) {
    this.body = { msg, data }
    this.status = code
  },
  // 生成token
  getToken(value) {
    return this.app.jwt.sign(value, this.app.config.jwt.secret)
  },
  // 验证token
  checkToken(token) {
    return this.app.jwt.verify(token, this.app.config.jwt.secret)
  },
  // 验证密码
  async checkPassword(password, hash_password) {
    // 先对需要验证的密码进行加密
    const hmac = crypto.createHash('sha256', this.app.config.crypto.secret)
    hmac.update(password)
    password = hmac.digest('hex')
    let res = password === hash_password
    if (!res) {
      this.throw(400, '密码错误')
    }
    return true
  },
  // 生成随机字符串
  randomString(length) {
    const chars =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var result = ''
    for (var i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)]
    return result
  },
}
