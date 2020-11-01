'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		//定义基本类型
		const {
			INTEGER,
			STRING,
			DATE,
			ENUM,
			TEXT
		} = Sequelize;
		//创建 file表
		return queryInterface.createTable('file', {
			id: {
				type: INTEGER(20),
				//主键
				primaryKey: true,
				//自增
				autoIncrement: true
			},
			name: {
				//数据类型
				type: STRING(100),
				//是否为空
				allowNull: false,
				//默认值
				defaultValue: '',
				//说明
				comment: '文件名'
			},
			ext: {
				type: STRING(50),
				allowNull: true,
				defaultValue: '',
				comment: '文件扩展名'
			},
			md: {
				type: STRING,
				allowNull: true,
				defaultValue: '',
				comment: '文件MD5'
			},
			file_id: {
				type: INTEGER,
				allowNull: false,
				defaultValue: 0,
				comment: '父级id'
			},
			user_id: {
				type: INTEGER,
				allowNull: false,
				defaultValue: 0,
				comment: '用户id',
				references: {
					model: 'user',
					key: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'restrict', // 更新时操作
			},
			size: {
				type: INTEGER,
				allowNull: false,
				defaultValue: 0,
				comment: '文件大小'
			},
			url: {
				type: STRING,
				allowNull: true,
				defaultValue: '',
				comment: '文件url'
			},
			isdir: {
				type: INTEGER,
				allowNull: false,
				defaultValue: 0,
				comment: '是否为文件夹',
			},
			created_time: DATE,
			updated_time: DATE,
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('file');
	}
};
