import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    Button, TextField, Dialog,
    DialogActions, DialogContent,
    DialogContentText, DialogTitle,
} from '@material-ui/core';

import {sendNewMessage} from '../../../api/message.actions.js';
/**
 * A dialog which is show when the user pressed
 * "Contact Landloard buttton"
 */
class LandLoardContactDialog extends React.Component {

  constructor(props){
      super(props);
      this.state={
        submitSuccess: false,
        newMessage: '',  
      }
      this.changeMessage = this.changeMessage(this)
      this.send = this.send.bind(this)
  }

  send = () => {   
    sendNewMessage({      
      message:this.state.newMessage,
      listingId:this.props.listingId
     },(response)=>{
      alert('Message has been sent!')
      this.setState({
        submitSuccess: true,
        newMessage: ''
      });
    })
  }

  changeMessage = () => ({target: {value}}) => {   
   this.setState({
     newMessage: value
   });
  };


  render() {

    const { open, onClose } = this.props;
    const {submitSuccess} = this.state;

    if(submitSuccess){
      return <Redirect to={'/profile/messages'} />
    }

    return (
      <div>
        <Dialog
          open={open}
          onClose={onClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Contact Landloard</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please a enter a message to send to landloard. The message history is 
              going to appear in your profile inbox.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="message"
              label="Enter Message"
              onChange={this.changeMessage}
              type="text"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.send} color="primary">
              Send Message
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

LandLoardContactDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
}

export default LandLoardContactDialog;