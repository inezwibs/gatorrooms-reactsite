import React, {Component} from 'react';

import { 
  Paper,withStyles,
  Typography, 
  List,ListItem,
  ListItemText,ListItemAvatar,
  Avatar, 
  IconButton,
  Card,CardActionArea,CardContent,CardMedia,
 } from '@material-ui/core';

import styles from '../styles/message-box';
import {formatUtcMessageTime} from '../../../utils/messages'
import ListingDetail from '../../_global/component/listing-detail';

class MessageBox extends Component{

  constructor(props){
    super(props);
    this.state={
      detailId: -1,
    }
    this.displayListingPreview = this.displayListingPreview.bind(this);
    this.displayMessages = this.displayMessages.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.formatUtcTime = this.formatUtcTime.bind(this);
    this.displayTitle = this.displayTitle.bind(this);
    this.showListingDetail = this.showListingDetail.bind(this);
  }

  latestMessage = React.createRef()

  componentDidMount(){  
    this.scrollToBottom();   
  } 

  componentDidUpdate() {
    this.scrollToBottom();
  }

  formatUtcTime = (utcTimeStamp)=>{
    return formatUtcMessageTime(utcTimeStamp)
  }

  scrollToBottom = () =>{
    this.latestMessage.current.scrollIntoView({ behavior: "smooth" });
  }

  showListingDetail = (id) =>{
    this.setState({
      detailId: id,
    })
  }

  displayListingPreview = (classes, chatInfo, defaultBox) =>{
    if(defaultBox) return
      return(
       <div>
       <Card className={classes.card}>
           <CardActionArea
             onClick={()=> {this.showListingDetail(chatInfo.listingId)}}
           >
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                { `Listing - ${chatInfo.listingTitle}`}
              </Typography>
       
            </CardContent>
            <CardMedia
              component="img"
              alt="listing img"
              className={classes.media}
              height="140"
              image="https://storage.googleapis.com/library-gs.ihouseprd.com/images/default-placeholder-lg.png"
              title="Contemplative Reptile"
            />
          </CardActionArea>
        </Card>
       
        <Typography className={classes.blankSpace}>                
        </Typography>
       </div>
     );
  }

  displayTitle = (classes, chatInfo, defaultBox) =>{

    if(defaultBox){
      return(
       <Typography component="h2" variant="display2" gutterBottom>
          No chat selected 
        </Typography>
      )
     }

    return(

           <ListItem 
            button 
            selected = {true}
           > 
           <ListItemAvatar 
            className={classes.contactAvatar}
            >
              <Avatar 
                alt="contact user's avatar"               
                src={chatInfo.contactsAvatar} 
              />
           </ListItemAvatar>
            
           <ListItemText            
             primary={chatInfo.chatingWith}
             secondary={ 
              `Listing title - ${chatInfo.listingTitle}`
             }                 
           />     

            <IconButton 
              aria-label="Delete"
              onClick={this.props.refreshHandler}                          
             >
                Refresh
            </IconButton>      
      </ListItem>
    );
  }

  displayMessages =() =>{

  	if(this.props.messages.length === 0){
      return;
    }

    let messages=[]
    this.props.messages.forEach((message)=>{
       messages.push(
        <React.Fragment>
          <ListItem alignItems="flex-start">
           <ListItemAvatar>
             <Avatar alt="your avatar" src={message.senderAvatar} />
           </ListItemAvatar>
           <ListItemText
             primary={ `${message.senderEmail} sent - ${this.formatUtcTime(message.sentTime) }` }
             secondary={
               <React.Fragment>
                 <Typography component="span"  color="textPrimary">
                 {message.message}
                 </Typography>               
               </React.Fragment>
             }
           />
          </ListItem>
        </React.Fragment>
      );
    });

    return messages;
  }

      
  render() {    
  	const {classes, chatInfo, defaultBox} = this.props;
    const {detailId} = this.state;
   return(
  	 <React.Fragment>

      {this.displayListingPreview(classes, chatInfo, defaultBox)}

      {this.displayTitle(classes, chatInfo, defaultBox)}
 
	    <Paper>    
	      <List className={classes.chatBox}>                                 
          {this.displayMessages()}
          <div ref={this.latestMessage} />
        </List>
  	  </Paper>

       <ListingDetail
          open={detailId !== -1}
          listingId={detailId}
          onClose={() => this.setState({ detailId: -1 })}
        />
    
  	</React.Fragment>
  );
 }
}

export default withStyles(styles)(MessageBox);