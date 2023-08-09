import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/auth-context";
import { Container, ListGroup } from "react-bootstrap";
import config from "../../config";
import { Chat } from "./Chat";

export const Chats = (props) => {
  const [chats, setChats] = useState([]);
  const { accessToken, isLoading } = useContext(AuthContext);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(!isLoading);
  }, [isLoading]);

  useEffect(() => {
    async function loadChats() {
      const response = await fetch(
        `${config.resourceServer}/api/find-chats-for-user/`,
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
        setChats(responseJson);
      } else {
        console.error("Error communicating with server.");
      }
    }

    if (showContent) {
      loadChats();
    }
  }, [accessToken, showContent]);

  return (
    <div>
      {showContent ? (
        <div className="color-overlay d-flex justify-content-center align-items-center">
          <Container>
            {chats.length > 0 ? (
              <ListGroup>
                {chats.map((chat) => (
                  <ListGroup.Item key={chat.id}>
                    <Chat chat={chat} />                    
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p className="center-text">
                Me so sorry, but you are not having any conversations at the
                moment.
              </p>
            )}
          </Container>
        </div>
      ) : (
        <div>Please wait...</div>
      )}
    </div>
  );
};
