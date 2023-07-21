import { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import styles from "../../global.module.css";
import ListGroup from "react-bootstrap/ListGroup";
import config from "../../config";
import classes from "./Friend.module.css";

export const Conversations = (props) => {
  const [userChats, setUserChats] = useState([]);

  useEffect(() => {
    async function loadConversations() {
      const userId = props.user.id;

      const response = await fetch(
        `${config.resourceServer}/api/find-chats-by-user-id/${userId}`,
        {
          method: "GET",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
            Authorization: `Bearer ${props.accessToken}`,
          },
        }
      );

      const responseJson = await response.json();
      if (response.status === 200) {
        console.info('got 200 for chats:'+JSON.stringify(responseJson));
        setUserChats(responseJson);
      } else {
        console.error("Error communicating with server.");
      }
    }

    loadConversations();
  }, [props.accessToken, props.user.id]);

  return (
    <div
      className={
        styles.colorOverlay +
        " " +
        "d-flex justify-content-center align-items-center"
      }
    >
      <Form className="rounded p-4 p-sm-3">
        {userChats.length > 0 ? (
          <ListGroup className={classes.listGroup}>
            {userChats.map((chat) => {
              console.info('got chat:'+JSON.stringify(chat));
              return (
                <ListGroup.Item className={classes.listGroupItem} key={chat.id}>
                  {chat.name}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        ) : (
          <p className={styles.centerText}>
            Me so sorry, but you are not having any conversations at the moment.
          </p>
        )}
      </Form>
    </div>
  );
};
