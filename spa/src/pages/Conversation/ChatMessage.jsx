import React from "react";
import classes from "./Conversation.module.css";

export const ChatMessage = ({ message, isSentByUser }) => {
  return (
    <div
      className={`${classes["chat-message"]} ${
        isSentByUser ? classes["sent-by-user"] : classes["received"]
      }`}
    >
      {message}
    </div>
  );
};
