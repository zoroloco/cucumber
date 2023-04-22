import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth-context";

export const Home = () => {
  const { user, isLoading } = useContext(AuthContext);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(!isLoading);
  }, [isLoading]);

  return (
    <div>
      {showContent ? (
        <div>Welcome back {user.username}</div>
      ) : (
        <div>isLoading...</div>
      )}
    </div>
  );
};
