const express = require('express');
var models = require('../models');
const router = express.Router();
const app = express();

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

function clearUserChats(chats, excludeEmail){
  let allChats=[]
  chats.forEach((chat)=>{
    console.log(chat.ListingPost.title)
     let chatObj = {
       "chatId": chat.id,
       "listingTitle": chat.ListingPost.title,
       "listingId":chat.ListingPost.id,
       "chatingWith": '',
       "contactsAvatar": '',       
      }

      if(chat.lesseeChatUser.email === excludeEmail){
        chatObj['chatingWith']=chat.landLordChatUser.email;
        chatObj['contactsAvatar']=chat.landLordChatUser.avatarUrl;
      }

      else{
        chatObj['chatingWith']= chat.lesseeChatUser.email;
        chatObj['contactsAvatar']= chat.lesseeChatUser.avatarUrl;
      }

    allChats.push( chatObj )
  })
 return allChats;
}

function getChatsMessages(chat){
  let chatMessages=[]
     chat.Messages.forEach((message)=>{
        chatMessages.push({         
          'message': message.message,
          'sentTime': message.dateSent,
          'senderEmail': message.userEmail,      
          'senderAvatar': message.User.avatarUrl,
        });
     })

  return chatMessages
}



router.get('/inbox',(req,res)=>{
  const token = req.headers.session;  
  
   models.User.findOne({
      where:{
        sessionToken: token, 
      }
     }).then((user)=>{

      if(!user){
       res.status(401).json('error')
       return
      }

      models.Chat.findAll({
        where:{
         [Op.or]: [{lesseeChatFk: user.id}, {landLordChatFk: user.id}]
        },
        include:[
          {model: models.Message},
          {model: models.ListingPost},  
          { 
            model: models.User,
            as: "landLordChatUser",
          },
          { 
            model: models.User,
            as: "lesseeChatUser",
          },
        ]
      }).then((chats)=>{

        let chatsData={
         'userEmail':user.email,
         'inbox': clearUserChats(chats, user.email)
        }    
        res.status(200).json(chatsData)          
      })
    })
});

router.get('/notContacted/:listingId',(req,res)=>{

  const token = req.headers.session;
  models.User.findOne({
    where:{sessionToken: token}
  }).then((user)=>{
    if(!user){
     res.status(401).json('error')
     return
    }

    models.Chat.findOne({
      where:{
       [Op.and]: [{ListingPostId: req.params.listingId}, {lesseeChatFk: user.id}]
      }
    }).then((chat)=>{

      if(!chat){
        res.status(200).json({"valid":true})
        return
      }

      res.status(200).json({"valid":false})
    });
  })
});


router.get('/one/:chatId' , async (req,res)=>{
  const token = req.headers.session; 

  models.User.findOne({
    where:{sessionToken: token}
  }).then((user)=>{

      if(!user){
       res.status(401).json('error')
       return
      }

      models.Chat.findOne({
         where:{id: req.params.chatId},
         include:[{
          model: models.Message,
          include:[models.User]          
         }],
         order:[[
         {model: models.Message},
         'dateSent','ASC'
         ]]
      }).then((chat)=>{
        let chatMessages={     
          'messages': getChatsMessages(chat)
        }    
       res.status(200).json(chatMessages);
      });
  })
})

router.delete('/trash/:chatId' , async (req,res)=>{
  models.Chat.findOne({
    where:{id: req.params.chatId}
  }).then((chat)=>{
    chat.destroy();
  }).then(()=>{
    res.status(200).send();
  })
})

router.post('/send', (req,res) =>{
    models.User.findOne({
      where:{
        sessionToken: req.headers.session,
      }
    }).then((user)=>{

      if(!user){              
       res.status(401).json('error')       
      }   

      models.Message.create({
        userEmail:user.email,
        message:req.body.messagePacket.message,
        ChatId: req.body.messagePacket.chatId,
        UserId: user.id,
      });  
      res.status(200).send()
    })
}); 

router.post('/new', (req,res) =>{
 const token = req.headers.session;

  models.User.findOne({
     where:{sessionToken: token},          
  }).then( (user)=>{


    if(!user){
      res.status(401).json('error')
    return       
    } 

    models.ListingPost.findOne({
      
      where:{ id: req.body.messagePacket.listingId },
      include:[{ model: models.User }]

    }).then((listing)=>{

      if(!listing){
        res.status(204).json('error')
        return       
      }   

      models.Chat.create({                                    
         ListingPostId:listing.id,            
         landLordChatFk: listing.UserId,
         lesseeChatFk: user.id,
      }).then((chat)=>{
         models.Message.create({
           UserId: user.id,              
           ChatId: chat.id,
           userEmail: user.email,
           message: req.body.messagePacket.message,
         });
       //return chat id so that front end can redirect to conversation in contact page
        res.status(200).json({"chatId":chat.id})
      })
 
    }); 
  });
}); 

module.exports = router;

