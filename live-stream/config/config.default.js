/* eslint valid-jsdoc: "off" */
'use strict'

const NodeMediaServer = require('node-media-server')

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
	/**
	 * built-in config
	 * @type {Egg.EggAppConfig}
	 **/
	const config = (exports = {})

	// use for cookie sign key, should change to your own and keep security
	config.keys = appInfo.name + '_1604158088886_8645'

	// add your middleware config here
	//定义路由拦截(先定义一个创建直播间的拦截)
	config.middleware = ['errorHandler', 'auth', 'adminAuth', 'adminSidebar']

	config.auth = {
		match: ['/api/logout',
			'/api/live/create',
			'/api/live/changestatus',
			'/api/gift/wxpay',
			'/api/user/info',
		],
	}
	config.adminAuth = {
		ignore: ['/api', '/admin/login', '/admin/loginevent'],
	}
	config.adminSidebar = {
		ignore: ['/api', '/admin/login', '/admin/loginevent', '/public'],
	}
	// add your user config here
	const userConfig = {
		// myAppName: 'egg',
	}

	//配置跨越
	config.security = {
		// 关闭 csrf
		csrf: {
			headerName: 'x-csrf-token',
			ignore: (ctx) => {
				return ctx.request.url.startsWith('/api')
			},
		},
		// 跨域白名单
		// domainWhiteList: ['http://localhost:3000'],
	}
	// 允许跨域的方法
	config.cors = {
		origin: '*',
		allowMethods: 'GET, PUT, POST, DELETE, PATCH',
	}

	config.sequelize = {
		dialect: 'mysql',
		host: '127.0.0.1',
		username: 'root',
		password: 'root',
		port: 3306,
		database: 'live_stream',
		// 中国时区
		timezone: '+08:00',
		define: {
			// 取消数据表名复数
			freezeTableName: true,
			// 自动写入时间戳 created_at updated_at
			timestamps: true,
			// 字段生成软删除时间戳 deleted_at
			// paranoid: true,
			createdAt: 'created_time',
			updatedAt: 'updated_time',
			// deletedAt: 'deleted_time',
			// 所有驼峰命名格式化
			underscored: true,
		},
	}

	config.valparams = {
		locale: 'zh-cn',
		throwError: true,
	}

	config.crypto = {
		secret: 'qhdgw@45ncashdaksh2!#@3nxjdas*_672',
	}

	config.jwt = {
		secret: 'qhdgw@45ncashdaksh2!#@3nxjdas*_672',
	}

	// redis存储
	config.redis = {
		client: {
			port: 6379, // Redis port
			host: '127.0.0.1', // Redis host
			password: '',
			db: 2,
		},
	}

	// 流媒体配置
	config.mediaServer = {
		rtmp: {
			port: 23480,
			chunk_size: 60000,
			gop_cache: true,
			ping: 30,
			ping_timeout: 60,
		},
		http: {
			port: 23481,
			allow_origin: '*',
		},
		auth: {
			play: true,
			publish: true,
			secret: 'nodemedia2017privatekey',
		},
	}

	config.io = {
		init: {
			wsEngine: 'ws',
		},
		namespace: {
			'/': {
				connectionMiddleware: [],
				packetMiddleware: [],
			},
		},
		redis: {
			host: '127.0.0.1',
			port: 6379,
			db: 0,
		}
	}
	config.view = {
		mapping: {
			'.html': 'nunjucks',
		},
	};
	//session配置
	/**
	 * 服务器可以设置或读取Cookies中包含信息，借此维护用户跟服务器会话中的状态。
Cookie（复数形态：Cookies），是指某些网站为了辨别用户身份、进行session跟踪而储存在用户本地终端上的数据（通常经过加密）。
Cookie是由服务端生成的，发送给客户端（通常是浏览器）的。
	 * Session代表服务器与浏览器的一次会话过程，这个过程是连续的，也可以时断时续的。Session是一种服务器端的机制，Session 对象用来存储特定用户会话所需的信息。
       Session由服务端生成，保存在服务器的内存、缓存、硬盘或数据库中。
	 */
	config.session = {
		renew: true,
		key: 'EGG_SESS',
		maxAge: 24 * 3600 * 1000 * 30, // 1 天
		httpOnly: true,
		encrypt: true,
	}

	//文件上传配置
	config.multipart = {
		fileSize: '50mb',
		mode: 'stream',
		fileExtensions: [
			'.xls',
			'.txt',
			'.jpg',
			'.JPG',
			'.png',
			'.PNG',
			'.gif',
			'.GIF',
			'.jpeg',
			'.JPEG',
		], //上传的文件格式
	}


	var nms = new NodeMediaServer(config.mediaServer)
	nms.run()

	return {
		...config,
		...userConfig,
	}
}
