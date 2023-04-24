import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/auth-context";
import { Tabs, Tab } from "react-bootstrap";
import styles from "../../global.module.css";
import { Friends } from "./Friends";

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
          <Tab eventKey="chat" title="[Chat]">
            Active chat goes here
          </Tab>
        </Tabs>
      ) : (
        <div>isLoading...</div>
      )}
    </div>
  );
};
