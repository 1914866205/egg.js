'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
	const {
		router,
		controller,
		io
	} = app;
	router.get('/', controller.home.index);
	//用户注册
	router.post('/api/reg', controller.api.user.reg)
	//用户登录
	router.post('/api/login', controller.api.user.login)
	//手机验证码登录
	router.post('/api/phoneLogin', controller.api.user.phoneLogin)
	//发送手机验证码
	router.post('/api/sendcode', controller.api.sms.sendCode)
	//第三方登录 微信登录试用版
	router.post('/api/otherlogin', controller.api.user.otherLogin)
	//上传图片
	router.post('/api/upload', controller.api.common.upload)

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
	//查看礼物列表
	router.get('/api/gift/list', controller.api.gift.list)

	//socket路由配置测试
	// io.of('/').route('test',io.controller.nps.test)
	io.of('/').route('joinLive', io.controller.live.joinLive)
	io.of('/').route('leaveLive', io.controller.live.leaveLive)
	io.of('/').route('comment', io.controller.live.comment)
	io.of('/').route('gift', io.controller.live.gift)

	router.get('/test', controller.admin.test.page);
	//dashbord首页
	router.get('/admin', controller.admin.home.index)
	//管理员登录路由
	router.get('/admin/login', controller.admin.home.login)
	//登出路由
	router.get('/admin/logout', controller.admin.home.logout)
	//登录登出接口
	router.post('/admin/loginevent', controller.admin.home.loginevent)
	//管理员模块列表路由
	router.get('/admin/manager', controller.admin.manager.index)
	//创建管理员页面路由
	router.get('/admin/manager/create', controller.admin.manager.create)
	//新增管理员接口
	router.post('/admin/manager', controller.admin.manager.save)
	//删除管理员
	router.get('/admin/manager/delete/:id', controller.admin.manager.delete)
	//编辑管理员路由
	router.get('/admin/manager/edit/:id', controller.admin.manager.edit)
	router.post('/admin/manager/:id', controller.admin.manager.update)
	//上传文件接口
	router.post('/admin/upload', controller.admin.common.upload)
	// 用户模块（列表）路由
	router.get('/admin/user', controller.admin.user.index)
	//新增用户路由
	router.get('/admin/user/create', controller.admin.user.create),
		//新增用户接口
		router.post('/admin/user/insert', controller.admin.user.save),
		// 编辑用户路由
		router.get('/admin/user/edit/:id', controller.admin.user.edit),
		//删除用户路由
		router.get('/admin/user/delete/:id', controller.admin.user.delete)
	//更新用户数据接口
	router.post('/admin/user/:id', controller.admin.user.update)
	// 编辑路由
	router.get('/admin/manager/edit/:id', controller.admin.manager.edit)
	// 删除路由
	router.get('/admin/manager/delete/:id', controller.admin.manager.delete)
	// 更新（编辑和删除共用）
	router.get('/admin/manager/:id', controller.admin.manager.update)
	// 礼物模块（列表）路由
	router.get('/admin/gift', controller.admin.gift.index)
	// 新增礼物路由
	router.get('/admin/gift/create', controller.admin.gift.create)
	// 新增礼物接口
	router.post('/admin/gift', controller.admin.gift.save)
	// 编辑礼物路由
	router.get('/admin/gift/edit/:id', controller.admin.gift.edit)
	// 删除礼物路由
	router.get('/admin/gift/delete/:id', controller.admin.gift.delete)
	// 更新礼物数据接口
	router.post('/admin/gift/:id', controller.admin.gift.update)
	// 直播间模块（列表）路由
	router.get('/admin/live', controller.admin.live.index)
	// 查看指定直播间路由
	router.get('/admin/live/look/:id', controller.admin.live.look)
	// 查看直播间礼物路由
	router.get('/admin/live/gift/:id', controller.admin.live.gift)
	// 查看直播间弹幕路由
	router.get('/admin/live/comment/:id', controller.admin.live.comment)
	// 查看已结束的直播间
	router.get('/admin/live/close/:id', controller.admin.live.closelive)
	// 删除直播间
	router.get('/admin/live/delete/:id', controller.admin.live.delete)
};
