import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../context/auth-context";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import classes from "./Conversation.module.css";
import config from "../../config";

export const Conversation = () => {
  const { accessToken, user, isLoading } = useContext(AuthContext);
  const [showContent, setShowContent] = useState(false);
  const [messages, setMessages] = useState([]);
  const messageContainerRef = useRef(null);

  const chatId = 2;

  useEffect(() => {
    setShowContent(!isLoading);
  }, [isLoading]);

  useEffect(() => {
    // Scroll to the bottom of the message container whenever messages change
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(
        `${config.resourceServer}/api/find-chat-messages-by-chat-id/${chatId}`,
        {
          method: "GET",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const responseJson = await response.json();
      if (response.status === 200) {
        setMessages(
          responseJson.map((chatMessage) => {
            return {
              ...chatMessage,
              isSentByUser: chatMessage.createdBy === user.id,
            };
          })
        );
      } else {
        console.error("Error communicating with server.");
      }
    };

    if(showContent){
      fetchMessages();
    }    
  }, [accessToken, showContent, user]);

  const handleSendMessage = (text) => {
    const newMessage = { id: Date.now(), text, isSentByUser: true };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <div>
      {showContent ? (
        <div className={classes.chatContainer}>
          <div className={classes.chatMessages} ref={messageContainerRef}>
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message.content}
                isSentByUser={message.isSentByUser}
              />
            ))}
          </div>
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      ) : (
        <div>Please wait...</div>
      )}
    </div>
  );
};
