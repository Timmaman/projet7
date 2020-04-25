'use strict';
module.exports = (sequelize, DataTypes) => {
    const Like = sequelize.define('Like', {
        messageId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER
    }, {});
    Like.associate = function(models) {
        // associations can be defined here
        models.Like.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
        models.Like.belongsTo(models.Message, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Like;
};