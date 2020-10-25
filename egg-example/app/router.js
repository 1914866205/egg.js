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
	//退出登录
	router.post('/logout', controller.user.logout);
	//下载
	router.post('/upload', controller.file.upload);
	//剩余容量
	router.get('/getsize', controller.user.getSize);
	//文件列表
	router.get('/file', controller.file.list);
	//创建文件夹
	router.post('/file/createdir', controller.file.createdir);
	//文件/文件夹 重命名
	router.post('/file/rename', controller.file.rename);
	//文件批量删除
	router.post('/file/delete', controller.file.delete);
};
