'use strict';
module.exports = (sequelize, DataTypes) => {
    const Comments = sequelize.define('Comment', {
        content: DataTypes.STRING,
        userId: DataTypes.INTEGER,
        messageId: DataTypes.INTEGER
    }, {});
    Comments.associate = function(models) {
        // associations can be defined here

        models.Comment.belongsTo(models.Message, {
            foreignKey: {
                allowNull: false
            }
        });
        models.Comment.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });

    };
    return Comments;
};