import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { AuthContext } from "../context/auth-context";

/**
 * Even though the ctx already stores the decoded userRoles, we must
 * extract them again here from the token due to a race condition. 
 */
const PrivateRoutes = () => {
  const ctx = useContext(AuthContext);

  const accessToken = localStorage.getItem("access-token");
  if (!accessToken) {
    return <Navigate to="/login" />;
  } else {
    try {
      //decode token to check for exp      
      const decoded = jwt_decode(accessToken);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        //If token has expired, remove from local storage and redirect to login
        //localStorage.removeItem("access-token");
        ctx.onLogOut();
        return <Navigate to="/login" />;
      } else {

        // Define the required roles for each route
        const requiredRoles = {
          "/chats": "ROLE_CHAT",
          "/home": "ROLE_VERIFIED",
          "/user-admin": "ROLE_USER_ADMIN"
        };

        const userRoles = decoded.userRoles;

        // Check if the user has the required role for the current route
        const currentRoute = window.location.pathname;
        const requiredRole = requiredRoles[currentRoute];
        const hasRequiredRole = userRoles.includes(requiredRole);

        if(!hasRequiredRole && currentRoute !== '/home'){
          console.error('Not Authorized.');
          return <Navigate to="/"/>;
        }else{
          console.info('User authorized to view:'+currentRoute);
        }
      }
    } catch (error) {
      console.error('Error encountered:'+error);
      ctx.onLogOut();
      return <Navigate to="/login" />;
    }
  }

  return <Outlet />;
};

export default PrivateRoutes;
