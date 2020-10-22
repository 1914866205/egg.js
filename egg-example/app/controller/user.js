'use strict';

const Controller = require('egg').Controller;
class UserController extends Controller {
    // 注册
    async reg() {
        const { ctx, app } = this;
        // 参数验证，用户名至少5个字符，最长20个字符，密码和确认密码必须一致
        ctx.validate({
            username: {
                required: true,
                type: "string",
                desc: "用户名",
                range: {
                    min: 5,
                    max: 20
                },
            },
            password: {
                required: true,
                type: "string",
                desc: "密码"
            },
            repassword: {
                required: true,
                type: "string",
                desc: "确认密码"
            }
        });

        let { username, password, repassword } = ctx.request.body;

        if (password !== repassword) {
            return ctx.throw(400, '密码和确认密码不相同');
        }

        // 用户名是否存在
        if (await app.model.User.findOne({
            where: {
                username
            }
        })) {
            ctx.throw(400, '用户名已存在');
        }

        // 创建用户
        let user = await app.model.User.create({
            username,
            password
        });

        if (!user) {
            ctx.throw(400, '注册失败');
        }

        user = JSON.parse(JSON.stringify(user));
        delete user.password;

        ctx.apiSuccess(user);
    }
}

module.exports = UserController;