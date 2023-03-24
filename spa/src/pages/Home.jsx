import { useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import AuthContext from "../context/auth-context";

const Home = () => {
  const { isAuthenticated,error } = useAuth0();
  const ctx = useContext(AuthContext);

  if(error){
    console.error('here is your error:'+error);
  }

  return (
    <div>
      {!isAuthenticated && <div>not authorized!</div>}
      
      {isAuthenticated && (
        <div>
          <p>Welcome back! {ctx.user.name}</p>
        </div>
      )}

      
    </div>
  );
};
export default Home;
