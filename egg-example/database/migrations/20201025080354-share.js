'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE, ENUM, TEXT } = Sequelize;
    return queryInterface.createTable('share', {
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
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('share');
  }
};