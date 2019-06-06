const moment = require('moment');

const formatUtcMessageTime= (utcStamp)=>{
 return moment(utcStamp).format('MMMM Do YYYY, h:mm:ss a');
}



module.exports = {
    formatUtcMessageTime
}
