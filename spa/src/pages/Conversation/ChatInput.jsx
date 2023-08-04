import React, { useState, useEffect, useRef } from "react";
import classes from "./Conversation.module.css";

export const ChatInput = ({ onSendMessage }) => {
  const [inputText, setInputText] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, [inputText]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSendButtonClick = () => {
    if (inputText.trim() !== "") {
      onSendMessage(inputText);
      setInputText("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendButtonClick();
    }
  };

  return (
    <div className={classes.chatInput}>
      <input
        type="text"
        value={inputText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        placeholder="Type your message..."
      />
      <button onClick={handleSendButtonClick}>Send</button>
    </div>
  );
};
