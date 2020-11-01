'use strict'
module.exports = (app) => {
	const {
		STRING,
		INTEGER,
		DATE,
		ENUM,
		TEXT
	} = app.Sequelize
	const File = app.model.define('file', {
		id: {
			type: INTEGER(20),
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: STRING(100),
			allowNull: false,
			defaultValue: '',
			comment: '文件名',
		},
		ext: {
			type: STRING(50),
			allowNull: true,
			defaultValue: '',
			comment: '文件扩展名',
		},
		md: {
			type: STRING,
			allowNull: true,
			defaultValue: '',
			comment: '文件MD5',
		},
		file_id: {
			type: INTEGER,
			allowNull: false,
			defaultValue: 0,
			comment: '父级id',
		},
		user_id: {
			type: INTEGER,
			allowNull: false,
			defaultValue: 0,
			comment: '用户id',
			references: {
				model: 'user',
				key: 'id',
			},
			onDelete: 'cascade',
			onUpdate: 'restrict', // 更新时操作
		},
		size: {
			type: INTEGER,
			allowNull: false,
			defaultValue: 0,
			comment: '文件大小',
		},
		url: {
			type: STRING,
			allowNull: true,
			defaultValue: '',
			comment: '文件url',
		},
		isdir: {
			type: INTEGER,
			allowNull: false,
			defaultValue: 0,
			comment: '是否为文件夹',
		},
		created_time: DATE,
		updated_time: DATE,
	})
	// 监听批量删除
	File.afterBulkDestroy(async (data, option) => {
		console.log('删除后', data.where.id)
		if (data.where.id) {
			app.model.File.destroy({
				where: {
					file_id: data.where.id,
					user_id: data.where.user_id,
				},
			})
		}
	})
	return File
}
