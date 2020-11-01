'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
	const {
		router,
		controller
	} = app;
	router.get('/', controller.home.index);
	//用户注册
	router.post('/api/reg', controller.api.user.reg)
	//用户登录
	router.post('/api/login', controller.api.user.login)
	//创建直播间
	router.post('/api/live/create',controller.api.live.save)
};
