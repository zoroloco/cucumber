import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../context/auth-context";
import { useParams } from "react-router-dom";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import classes from "./Conversation.module.css";
import config from "../../config";

export const Conversation = () => {
  const { accessToken, user, isLoading } = useContext(AuthContext);
  const [showContent, setShowContent] = useState(false);
  const [messages, setMessages] = useState([]);
  const messageContainerRef = useRef(null);
  let { chatid } = useParams();

  console.info("Loaded conversation for chatid:" + chatid);

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
        `${config.resourceServer}/api/find-chat-messages-by-chat-id/${chatid}`,
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
            //use == to not be strict equality like === since we are comparing number to string.
            return {
              ...chatMessage,
              isSentByUser: chatMessage.createdBy == user.id
            };
          })
        );
      } else {
        console.error("Error communicating with server.");
      }
    };

    if (showContent) {
      fetchMessages();
    }
  }, [accessToken, showContent, user, chatid]);

  const handleSendMessage = async (text) => {
    //persist async
    const response = await fetch(
      `${config.resourceServer}/api/create-chat-message`,
      {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          content: text,
          chatId: parseInt(chatid, 10),
        }),
      }
    );

    const responseJson = await response.json();
    if (response.status === 201) {
      //setMessages((prevMessages) => [...prevMessages, responseJson]);
      setMessages((prevMessages) => {
        return [...prevMessages, responseJson].map((chatMessage) => {         
          return {
            ...chatMessage,
            isSentByUser: chatMessage.createdBy == user.id,
          };
        });
      });
    } else {
      console.error("Error communicating with server.");
    }
  };

  return (
    <div>
      {showContent ? (
        <div className={classes.chatContainer}>
          <div className={classes.chatMessages} ref={messageContainerRef}>
            {messages.map((message) => (
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
