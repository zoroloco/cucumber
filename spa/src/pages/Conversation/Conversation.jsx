import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/auth-context";
import { ChatApp } from "./ChatApp";

export const Conversation = () => {
  const { accessToken, isLoading } = useContext(AuthContext);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(!isLoading);
  }, [isLoading]);

  return (
    <div>
      {showContent ? (
        <ChatApp/>
      ) : (
        <div>Please wait...</div>
      )}
    </div>
  );
};
