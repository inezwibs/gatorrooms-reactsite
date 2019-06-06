'use strict';
module.exports = (sequelize, DataTypes) => {

  const Message = sequelize.define('Message', {
    userEmail: DataTypes.STRING,
    message: DataTypes.STRING
  }, {
    createdAt: 'dateSent',
    updatedAt: false
  });

  Message.associate = (models) => {
    Message.belongsTo(models.User);    
    Message.belongsTo(models.Chat);
  };
  
 return Message;
};