var bcrypt = require('bcrypt');

'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    avatarUrl:{
      type:DataTypes.STRING,
      defaultValue: 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png'
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    sessionToken: DataTypes.STRING,
  }, {
    createdAt: false,
    updatedAt: false
  });

  User.beforeCreate((user, options) => {    
    return bcrypt.hash(user.password, 10)
        .then(hash => {
            user.password = hash;
        })
        .catch(err => { 
            throw new Error(); 
        });
  });

  User.prototype.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  }

  User.associate = function(models) {
    User.hasMany(models.ListingPost, {
    	onDelete: 'CASCADE'
    });
    User.hasMany(models.Message);    
  };
  return User;
};