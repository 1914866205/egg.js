'use strict';

const Controller = require('egg').Controller;
const crypto = require('crypto');
class UserController extends Controller {
  // 注册
  async reg() {
    const { ctx, app } = this;
    // 参数验证，用户名至少5个字符，最长20个字符，密码和确认密码必须一致
    ctx.validate({
      username: {
        required: true,
        type: 'string',
        desc: '用户名',
        range: {
          min: 5,
          max: 20,
        },
      },
      password: {
        required: true,
        type: 'string',
        desc: '密码',
      },
      repassword: {
        required: true,
        type: 'string',
        desc: '确认密码',
      },
    });

    const { username, password, repassword } = ctx.request.body;

    if (password !== repassword) {
      return ctx.throw(400, '密码和确认密码不相同');
    }

    // 用户名是否存在
    if (
      await app.model.User.findOne({
        where: {
          username,
        },
      })
    ) {
      ctx.throw(400, '用户名已存在');
    }

    // 创建用户
    let user = await app.model.User.create({
      username,
      password,
    });

    if (!user) {
      ctx.throw(400, '注册失败');
    }

    user = JSON.parse(JSON.stringify(user));
    delete user.password;

    ctx.apiSuccess(user);
  }

  // 登录
  async login() {
    const { ctx, app } = this;
    // 参数验证
    ctx.validate({
      username: {
        required: true,
        type: 'string',
        desc: '用户名',
      },
      password: {
        required: true,
        type: 'string',
        desc: '密码',
      },
    });
    // 获取到数据
    const { username, password } = ctx.request.body;
    // 验证用户是否存在
    let user = await app.model.User.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      return ctx.apiFail('当前用户不存在');
    }
    // 验证密码
    this.checkPassword(password, user.password);

    user = JSON.parse(JSON.stringify(user));

    // 生成token
    user.token = ctx.getToken(user);
    delete user.password;

    // 加入缓存中
    if (!(await this.service.cache.set('user_' + user.id, user.token))) {
      ctx.throw(400, '登录失败');
    }

    ctx.apiSuccess(user);
  }

  // 验证密码
  checkPassword(password, hash_password) {
    const hmac = crypto.createHash('sha256', this.app.config.crypto.secret);
    hmac.update(password);
    if (hmac.digest('hex') !== hash_password) {
      this.ctx.throw(400, '密码错误');
    }
    return true;
  }
  
  //退出登录
  async logout(){
	  const {ctx,service}=this;
	  const currentUserId=ctx.authUser.id;
	  if(!await service.cache.remove('user_'+currentUserId)){
		  ctx.throw(400,'退出登录失败');
	  }
	  ctx.apiSuccess('退出登录成功');
  }
  //剩余容量
  async getSize(){
	  const {ctx,service}=this
	  return ctx.apiSuccess({
		  total_size:ctx.authUser.total_size,
		  user_size:ctx.authUser.user_size,
	  })
  }
}

module.exports = UserController;