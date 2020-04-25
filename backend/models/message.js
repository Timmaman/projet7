'use strict';
module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
        userId: DataTypes.INTEGER,
        title: DataTypes.STRING,
        content: DataTypes.STRING,
        imageUrl: DataTypes.STRING,
        likes: DataTypes.INTEGER
    }, {});
    Message.associate = function(models) {
        // associations can be defined here
        models.Message.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
        models.Message.hasMany(models.Like);
        models.Message.hasMany(models.Comment)
    };
    return Message;
};