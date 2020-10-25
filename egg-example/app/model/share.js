'use strict'
const crypto = require('crypto');
module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT } = app.Sequelize;

    const Share = app.model.define('share', {
        id: {
            type: INTEGER(20),
            primaryKey: true,
            autoIncrement: true
        },
        sharedurl: {
            type: STRING,
            allowNull: true,
            defaultValue: '',
            comment: '分享链接'
        },
        file_id: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '文件id',
            references: {
                model: 'file',
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'restrict', // 更新时操作
        },
        iscancel: {
            type: INTEGER(1),
            allowNull: false,
            defaultValue: 0,
            comment: '是否取消分享'
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
        created_time: DATE,
        updated_time: DATE,
    });

    Share.associate = function (models) {
        // 关联文件
        Share.belongsTo(app.model.File);
    }

    return Share;
};