'use strict';
// 引入
const crypto = require('crypto');
module.exports = (app) => {
	const {
		STRING,
		INTEGER,
		DATE,
		ENUM,
		TEXT
	} = app.Sequelize;

	const User = app.model.define("user", {
		id: {
			type: INTEGER(20),
			primaryKey: true,
			autoIncrement: true,
		},
		username: {
			type: STRING(30),
			allowNull: false,
			defaultValue: "",
			comment: "用户名",
			unique: true,
		},
		nickname: {
			type: STRING(30),
			allowNull: false,
			defaultValue: "",
			comment: "昵称",
		},
		email: {
			type: STRING(160),
			allowNull: false,
			defaultValue: "",
			comment: "邮箱",
		},
		password: {
			type: STRING,
			allowNull: false,
			defaultValue: '',
			comment: "密码",
			set(val) {
				const hmac = crypto.createHash("sha256", app.config.crypto.secret);
				hmac.update(val);
				this.setDataValue('password', hmac.digest("hex"));
			}
		},
		avatar: {
			type: STRING,
			allowNull: true,
			defaultValue: "",
			comment: "头像",
		},
		phone: {
			type: STRING(11),
			allowNull: false,
			defaultValue: "",
			comment: "手机",
		},
		sex: {
			type: ENUM,
			values: ["男", "女", "保密"],
			allowNull: false,
			defaultValue: "男",
			comment: "性别",
		},
		desc: {
			type: TEXT,
			allowNull: false,
			defaultValue: "",
			comment: "个性签名",
		},
		total_size: {
			type: INTEGER,
			defaultValue: 10485760,
			comment: "网盘总大小，单位:kb",
		},
		used_size: {
			type: INTEGER,
			defaultValue: 0,
			comment: "网盘已使用大小，单位:kb",
		},
		created_time: DATE,
		updated_time: DATE,

		// // 加密
		// async createPassword(password) {
		// 	const hmac = crypto.createHash("sha256", this.app.config.crypto.secret);
		// 	hmac.update(password);
		// 	return hmac.digest("hex");
		// }

		// // 验证密码
		// async checkPassword(password, hash_password) {
		// 	// 先对需要验证的密码进行加密
		// 	password = await this.createPassword(password);
		// 	return password === hash_password;
		// }
	});
	return User;
};
