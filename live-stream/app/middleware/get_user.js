'use strict'
module.exports = (option, app) => {
  return async (ctx, next) => {
    //1. 获取 header 头token
    let token = ctx.header.token || ctx.query.token
    if (token) {
      let user = {}
      try {
        user = ctx.checkToken(token)
      } catch (error) {}


      //3. 判断当前用户是否登录
      if (user && user.id) {
        let t = await ctx.service.cache.get('user_' + user.id)
        if (t && t === token) {
          user = await app.model.User.findByPk(user.id)
          ctx.authUser = user
        }
      }
    }
    await next()
  }
}