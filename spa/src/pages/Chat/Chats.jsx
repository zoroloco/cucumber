import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/auth-context";
import { Form } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import config from "../../config";
import { Chat } from "./Chat";
import styles from "../../global.module.css";

export const Chats = (props) => {
  const [userChats, setUserChats] = useState([]);
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
        setUserChats(responseJson);
      } else {
        console.error("Error communicating with server.");
      }
    }

    if(showContent){
      loadChats();
    }    
  }, [accessToken, showContent]);

  return (
    <div>
      {showContent ? (
        <div
          className={
            styles.colorOverlay +
            " " +
            "d-flex justify-content-center align-items-center"
          }
        >
          <Form className="rounded p-4 p-sm-3">
            {userChats.length > 0 ? (
              <ListGroup className={styles.listGroup}>
                {userChats.map((chat) => {
                  return (
                    <ListGroup.Item
                      className={styles.listGroupItem}
                      key={chat.id}
                    >
                      <Chat chat={chat} />
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            ) : (
              <p className={styles.centerText}>
                Me so sorry, but you are not having any conversations at the
                moment.
              </p>
            )}
          </Form>
        </div>
      ) : (
        <div>Please wait...</div>
      )}
    </div>
  );
};
