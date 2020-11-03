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
	//手机验证码登录
	router.post('/api/phoneLogin',controller.api.user.phoneLogin)
	//发送手机验证码
	router.post('/api/sendcode',controller.api.sms.sendCode)
	//第三方登录 微信登录试用版
	router.post('/api/otherlogin',controller.api.user.otherLogin)
	
	//获取用户信息
	router.post('/api/info', controller.api.user.info)
	//用户退出登录
	router.post('/api/logout', controller.api.user.logout)
	//创建直播间
	router.post('/api/live/create', controller.api.live.save)
	//修改直播间状态         				     
	router.post('/api/live/changestatus', controller.api.live.changeStatus)
	//分页获取直播间列表
	router.post('/api/live/list/:page', controller.api.live.list)
	//查看指定直播页
	router.get('/api/live/read/:id', controller.api.live.read)
		
};
