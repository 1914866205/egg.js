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
	router.get("/list", controller.home.list);
	// 用户注册
	router.post("/reg", controller.user.reg);
	//用户登录
	router.post("/login", controller.user.login);
};
