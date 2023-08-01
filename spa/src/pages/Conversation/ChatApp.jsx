import React, { useState } from 'react';
import {ChatMessage} from './ChatMessage';
import {ChatInput} from './ChatInput';
import classes from "./Conversation.module.css";

const initialMessages = [
  { id: 1, text: 'Hello!', isSentByUser: false },
  { id: 2, text: 'Hi there!', isSentByUser: true },
];

export const ChatApp = () => {
  const [messages, setMessages] = useState(initialMessages);

  const handleSendMessage = (text) => {
    const newMessage = { id: Date.now(), text, isSentByUser: true };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <div className={classes.chatContainer}>
      <div className={classes.chatMessages}>
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
            isSentByUser={message.isSentByUser}
          />
        ))}
      </div>
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};
