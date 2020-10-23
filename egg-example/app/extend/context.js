'use strict';
module.exports = {
  // 成功提示
  apiSuccess(data = '', msg = 'ok', code = 200) {
    this.body = { msg, data };
    this.status = code;
  },
  // 失败提示
  apiFail(data = '', msg = 'fail', code = 400) {
    this.body = { msg, data };
    this.status = code;
  },
  // 生成token
  getToken(value) {
    return this.app.jwt.sign(value, this.app.config.jwt.secret);
  },
  // 生成唯一ID
  genID(length) {
    return Number(
      Math.random().toString().substr(3, length) + Date.now()
    ).toString(36);
  },
  // 是否是移动端访问
  ismobile() {
    const userAgent = this.request.header['user-agent'].toLowerCase();
    const pat_phone = /ipad|iphone os|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/;
    return pat_phone.test(userAgent);
  },
};