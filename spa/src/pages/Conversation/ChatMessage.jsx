import React from 'react';
import classes from "./Conversation.module.css";

export const ChatMessage = ({ message, isSentByUser }) => {

  //console.info('Message:'+message+' isSentByUser:'+isSentByUser);

  return (
    <div className={`${classes.chatMessage} ${isSentByUser ? classes.sentByUser : classes.received}`}>
      {message}
    </div>
  );
};
