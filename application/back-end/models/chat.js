'use strict';
module.exports = (sequelize, DataTypes) => {

const Chat = sequelize.define('Chat', {	
	
}, {
    createdAt: 'dateSent',
    updatedAt: false
  });

  Chat.associate = (models) => {          

    Chat.hasMany(models.Message, {
      onDelete: 'CASCADE'
    });

    Chat.belongsTo(models.ListingPost);    
    
    Chat.belongsTo(models.User, {
    	as: 'lesseeChatUser',
    	foreignKey:'lesseeChatFk',
    });

    Chat.belongsTo(models.User, {
    	as:'landLordChatUser',
    	foreignKey:'landLordChatFk',
    });
  };

 return Chat;
};