module.exports = app => {
    const { STRING, INTEGER, DATE, ENUM, TEXT } = app.Sequelize;

    const Follow = app.model.define('follow', {
        id: {
            type: INTEGER(20),
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: INTEGER,
            allowNull: true,
            comment: '用户id'
        },
        follow_id: {
            type: INTEGER,
            allowNull: true,
            defaultValue: 0,
            comment: '关注id'
        },
        created_time: DATE,
        updated_time: DATE
    });

    // 关联关系
    Follow.associate = function (models) {
        // 关联粉丝
        Follow.belongsTo(app.model.User, {
            as: 'user_follow',
            foreignKey: 'follow_id'
        });
        // 关联粉丝
        Follow.belongsTo(app.model.User, {
            as: 'user_fen',
            foreignKey: 'user_id'
        });
    }

    return Follow;
};