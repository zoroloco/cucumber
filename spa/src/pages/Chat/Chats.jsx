import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/auth-context";
import { Tabs, Tab } from "react-bootstrap";
import styles from "../../global.module.css";
import { Friends } from "./Friends";
import { Conversations } from "./Conversations";

export const Chats = () => {
  const { accessToken, user, isLoading } = useContext(AuthContext);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(!isLoading);
  }, [isLoading]);

  return (
    <div>
      {showContent ? (
        <Tabs
          defaultActiveKey="users"
          id="menu"
          className={styles.customTabs}
        >
          <Tab eventKey="users" title="[Users]">
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
