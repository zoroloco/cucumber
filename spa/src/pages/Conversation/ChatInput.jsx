import React, { useState } from 'react';
import classes from "./Conversation.module.css";

export const ChatInput = ({ onSendMessage }) => {
  const [inputText, setInputText] = useState('');

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSendButtonClick = () => {
    if (inputText.trim() !== '') {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div className={classes.chatInput}>
      <input
        type="text"
        value={inputText}
        onChange={handleInputChange}
        placeholder="Type your message..."
      />
      <button onClick={handleSendButtonClick}>Send</button>
    </div>
  );
};
