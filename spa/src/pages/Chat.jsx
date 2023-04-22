import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/auth-context";

export const Chat = () => {
  const { user, isLoading } = useContext(AuthContext);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(!isLoading);
  }, [isLoading]);

  if (!showContent) {
    return <p>loading...</p>;
  }

  return (
    <div>
      <p>chat here: {user.username} </p>
    </div>
  );
};
