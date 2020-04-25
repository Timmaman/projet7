'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        username: DataTypes.STRING,
        departement: DataTypes.STRING,
        fonction: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        isAdmin: DataTypes.BOOLEAN
    }, {});
    User.associate = function(models) {
        // associations can be defined here
        models.User.hasMany(models.Message);
        models.User.hasMany(models.Like);
        models.User.hasMany(models.Comment)
    };
    return User;
};