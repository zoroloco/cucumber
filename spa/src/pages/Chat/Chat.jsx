import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/auth-context";
import { Tabs, Tab } from "react-bootstrap";
import styles from "../../global.module.css";
import { Friends } from "./Friends";
import { Conversations } from "./Conversations";

export const Chat = () => {
  const { accessToken, user, isLoading } = useContext(AuthContext);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(!isLoading);
  }, [isLoading]);

  return (
    <div>
      {showContent ? (
        <Tabs
          defaultActiveKey="friends"
          id="menu"
          className={styles.customTabs}
        >
          <Tab eventKey="friends" title="[Friends]">
            <Friends user={user} accessToken={accessToken} />
          </Tab>
          <Tab eventKey="chat" title="[Chats]">
            <Conversations user={user} accessToken={accessToken} />
          </Tab>
        </Tabs>
      ) : (
        <div>Please wait...</div>
      )}
    </div>
  );
};
