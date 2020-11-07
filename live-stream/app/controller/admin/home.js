'use strict';


const Controller = require('egg').Controller;
const crypto = require('crypto');
class HomeController extends Controller {
    // 后台首页
    async index() {
        const { ctx } = this;
        await ctx.render('admin/home/index.html',{
            dataUrl:"http://livehls.dishait.cn/api/server"
        });
    }


    // 登录页
    async login() {
        const { ctx } = this;
        let toast = ctx.cookies.get('toast',{ encrypt: true });
        toast = toast ? JSON.parse(toast) : null
        await ctx.render('admin/home/login.html',{
            toast
        });
    }


    // 登录逻辑
    async loginevent() {
        const { ctx, app } = this;
        // 参数验证
        ctx.validate({
            username: {
                type: 'string',
                required: true,
                desc: '用户名'
            },
            password: {
                type: 'string',
                required: true,
                desc: '密码'
            },
        });
        let { username, password } = ctx.request.body;
        // 验证该用户是否存在|验证该用户状态是否启用
        let manager = await app.model.Manager.findOne({
            where: {
                username,
            }
        });
        if (!manager) {
            ctx.throw(400, '用户不存在或已被禁用');
        }
        // 验证密码
        await this.checkPassword(password, manager.password);


        // 记录到session中
        ctx.session.auth = manager


        return ctx.apiSuccess('ok');
    }


    // 验证密码
    async checkPassword(password, hash_password) {
        // 先对需要验证的密码进行加密
        const hmac = crypto.createHash("sha256", this.app.config.crypto.secret);
        hmac.update(password);
        password = hmac.digest("hex");
        let res = password === hash_password;
        if (!res) {
            this.ctx.throw(400, '密码错误');
        }
        return true;
    }


    async logout(){
        const { ctx, service } = this;
        // 清除session
        ctx.session.auth = null
        ctx.toast('退出登录成功','success')
        ctx.redirect(`/admin/login`);
    }
}


module.exports = HomeController;
