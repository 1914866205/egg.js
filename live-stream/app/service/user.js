'use strict';

const Service = require('egg').Service;

class UserService extends Service {
    // 是否存在
    async exist(user_id) {
        const { app } = this;
        return await app.model.User.findOne({
            where: {
                id: user_id
            }
        });
    }


    // 指定用户关注人数
    async getFollowCount(user_id) {
        return await this.app.model.Follow.count({
            where: {
                user_id
            }
        });
    }

    // 指定用户的作品量
    async getVideoCount(user_id) {
        return await this.app.model.Video.count({
            where: {
                user_id
            }
        });
    }

    // 指定用户的粉丝数
    async getFensCount(user_id) {
        return await this.app.model.Follow.count({
            where: {
                follow_id: user_id
            }
        });
    }


    // 用户相关信息
    async getUserInfo(user_id) {
        return await this.app.model.User.findOne({
            where: {
                id: user_id
            },
            attributes: {
                exclude: ['password']
            }
        });
    }


    // 当前用户是否关注某用户
    async isFollow(user_id, follow_id) {
        return !!(await this.app.model.Follow.findOne({
            where: {
                user_id,
                follow_id
            }
        }));
    }
}

module.exports = UserService;