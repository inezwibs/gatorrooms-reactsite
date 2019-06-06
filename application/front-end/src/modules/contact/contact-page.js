import React, {Component} from 'react';

import { 
  Grid,Paper,withStyles,
  Button,TextField, Typography, 
  Icon,IconButton,
  List,ListItem,Divider,
  ListItemText, ListItemSecondaryAction,ListItemAvatar,
  Avatar, 
  FormGroup,FormControl
 } from '@material-ui/core';

import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import styles from './styles/contact-page';

import { getInbox, getChat, sendMessage, deleteChat } from '../../api/message.actions';


import MessageBox from './component/message-box';

class ContactPage extends Component{

  constructor(props){
    super(props);
    this.state = {
      //all chat ids
      allUsersChats: [],
      currentChatIndex:0,
      nextMessage:'',
      userEmail:'',

      currentChat:{
        chatInfo:{
          chatingWith: '',
          listingTitle: '',
          listingId: null,
          contactsAvatar: '',
        },
        messages:[],
       },

       noChatSelected: true,
    };

    this.getChats = this.getChats.bind(this);
    this.selectChat = this.selectChat.bind(this);
    this.handleSendButton = this.handleSendButton.bind(this);       
    this.getChatMessages = this.getChatMessages.bind(this);
    this.deleteConversation = this.deleteConversation.bind(this);

  }


  componentDidMount(){  
    this.getChats();   
  } 

 //get data from API enpoint 
 getChats = () => {  
      getInbox( (chatObj)=>{              
        this.setState({ 
          allUsersChats: chatObj.inbox || [],
          userEmail: chatObj.userEmail,
         });
      });   
  }

  onChangeMessage = ({target: {value}}) =>{
    this.setState({
      nextMessage: value
    });
  }

  deleteConversation = (chatId) =>{
    deleteChat( chatId, () => {
      this.getChats(); 
    });
  }

  handleSendButton = () =>{
    //if nothing to send dont send
    if(this.state.nextMessage === ''){
      return
    }

    let messagePacket ={
     'chatId': this.state.allUsersChats[this.state.currentChatIndex].chatId,
     'message': this.state.nextMessage,
    }    
    sendMessage(messagePacket, (resp)=>{                
       this.selectChat(this.state.currentChatIndex);
       this.setState({
        nextMessage: ''
       });    
    });
  }

  //select a chat to show
  selectChat = (chatIndex) =>{
    if(this.state.allUsersChats[chatIndex] == null){return;}

    getChat(this.state.allUsersChats[chatIndex].chatId, (messagesObject)=>{
      let chat = this.state.allUsersChats[chatIndex];
      this.setState({
        currentChatIndex: chatIndex,
        noChatSelected:false,
        currentChat: {
          chatInfo:{
           chatingWith: chat.chatingWith,
           listingTitle: chat.listingTitle,          
           listingId: chat.listingId,
           contactsAvatar: chat.contactsAvatar,
          },
          messages: messagesObject.messages,
        }

      });
    })   
  } 

  getChatMessages = (chatIndex) =>{
     if(this.state.allUsersChats.length === 0){
       return [];
     }
     return this.state.allUsersChats[chatIndex].messages;
  }


  chatsList = () => {
    if(this.state.allUsersChats.length === 0) 
      return;
    let chatListItems = [];
    this.state.allUsersChats.forEach((chat, index)=>{
    
        chatListItems.push(
           <div>

             <ListItem 
               button           
                onClick={() => this.selectChat(index) }
              >
              <ListItemAvatar>
                 <Avatar
                   alt={`dm user avatar${index}`}
                   src={chat.contactsAvatar} 
                 />
              </ListItemAvatar>
                
               <ListItemText
                  primary={
                   chat.chatingWith
                  }
                  secondary={
                    `Listing - ${chat.listingTitle} `
                  }                 
               />
    
                  <ListItemSecondaryAction>
                        <IconButton 
                          aria-label="Delete"
                          onClick={() => this.deleteConversation(chat.chatId) }
                         >
                          <DeleteForeverRoundedIcon />
                        </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>

              <Divider light />
           </div>
        );
    });
  
   return chatListItems;
  }



  render() {
    const {classes} = this.props;
    const {currentChat, noChatSelected} = this.state;


    return(
     <div>      



      <Grid container>       

          <Grid item xs={12} md={4} lg={4}>
              <Typography 
                 variant="h5" 
                 gutterBottom 
                 align="center"
                 style={{padding:20}}
              >
                Direct Messages
              </Typography>

              <List className={classes.root}>
                 {this.chatsList()}
              </List>
          </Grid>
        

           <Grid item xs={12} md={8} lg={8}>

               <Paper 
                 className={classes.messagePaper}
                 elevation='1'
                >
                           
                <MessageBox                
                  defaultBox={noChatSelected}
                  refreshHandler={()=>{ this.selectChat(this.state.currentChatIndex) }}
                  messages={currentChat.messages}
                  chatInfo={currentChat.chatInfo}
                 />

                </Paper>

                <Paper>
                  <FormGroup>
                    <FormControl fullWidth className={classes.margin}>                 
                         <TextField
                             id="standard-full-width"
                             onChange={this.onChangeMessage}
                             label="Type message"        
                             variant="outlined"
                             multiline="true"
                             fullWidth 
                            value={this.state.nextMessage}
                           />                               
                    </FormControl>

                    <Button 
                     variant="contained" 
                     color="primary" 
                     className={classes.button}
                     onClick= {this.handleSendButton}
                     >
                        Send 
                    <Icon className={classes.rightIcon}>send</Icon>
                    </Button>

                  </FormGroup>
                </Paper>                   

            </Grid>
          </Grid>        
        </div>       
     );
  }

}

export default withStyles(styles, {withTheme:true}) (ContactPage); 