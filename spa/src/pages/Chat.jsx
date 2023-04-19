import { useContext } from "react";
import { AuthContext } from "../context/auth-context";

export const Chat = () => {
  const { user, isLoading } = useContext(AuthContext);

  if(isLoading){
    return <p>loading...</p>;
  }

  return (
    <div>
      <p>chat here: {user.username} </p>
    </div>
  );
};
