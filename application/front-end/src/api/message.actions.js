import axios from "axios";
import api_config from './config/api.config';


export const getInbox = (handleResponse) => {
  let sessionToken = JSON.parse(sessionStorage.getItem('session')).token

   axios({
      method: 'get',
      url: `http://${api_config.environment}/messages/inbox`,
      headers:{
      	'Session': sessionToken
      },
   }).then((res) => {
   	 //http response returns array of json chat objects
   	 handleResponse(res.data);
   });
};

export const getChat = (id,handleResponse) => {
  let sessionToken = JSON.parse(sessionStorage.getItem('session')).token
   axios({
      method: 'get',
      url: `http://${api_config.environment}/messages/one/${id}`,
      headers:{
        'Session': sessionToken
      },
   }).then((res) => {  
   //http response returns array of json messages  
     handleResponse(res.data);
   });
};

export const deleteChat = (id, handleResponse)=>{
  let sessionToken = JSON.parse(sessionStorage.getItem('session')).token
   axios({
     method: 'delete',
     url: `http://${api_config.environment}/messages/trash/${id}`,
     headers:{
         'Session': sessionToken,
     },
   }).then(() => {
     handleResponse();
   });
};

export const validateContact = (listingId, handleResponse) =>{
  let sessionToken = JSON.parse(sessionStorage.getItem('session')).token

   axios({
      method: 'get',
      url: `http://${api_config.environment}/messages/notContacted/${listingId}`,
      headers:{
       'Session': sessionToken,
      },
   
   }).then((res) => {  
       handleResponse(res.data.valid);
   });
};


export const sendMessage = (messagePacket, handleResponse) => {
  let sessionToken = JSON.parse(sessionStorage.getItem('session')).token

   axios({
      method: 'post',
      url: `http://${api_config.environment}/messages/send`,
      data:{
         'messagePacket': messagePacket,
      },
      headers:{
         'Session': sessionToken,
      },
   
   }).then((res) => {       
       handleResponse();
   });
};

export const sendNewMessage = (messagePacket, handleResponse) => {

  let sessionToken = JSON.parse(sessionStorage.getItem('session')).token
   axios({
      method: 'post',
      url: `http://${api_config.environment}/messages/new`,
      data:{
         'messagePacket': messagePacket,
      },
      headers:{
         'Session': sessionToken,
      },
   }).then((res) => {       
       handleResponse();
   });
};
