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
          "home": "ROLE_NOOB",
          "user-admin": "ROLE_USER_ADMIN",
          "user-profile": "ROLE_NOOB"
        };

        const userRoles = decoded.userRoles;

        // Check if the user has the required role for the current route
        const currentRoute = window.location.pathname;

        // chop off any parameters at end of path (/foo/:bar). We just want to evaluate foo.
        if (currentRoute && currentRoute.trim().length > 0) {
          let endPointPath = currentRoute.substring(1, currentRoute.length);

          //chop off everything after second slash if exists
          if (-1 !== endPointPath.indexOf("/", 1)) {
            endPointPath = endPointPath.substring(
              0,
              endPointPath.indexOf("/", 1)
            );
          }

          if (endPointPath) {
            //console.log("PrivateRoutes currentRoute parsed to:" + endPointPath);
            const requiredRole = requiredRoles[endPointPath];
            const hasRequiredRole = userRoles.includes(requiredRole);

            if (!hasRequiredRole && endPointPath !== "home") {
              console.error("Not Authorized.");
              return <Navigate to="/" />;
            } else {
              //console.info("User authorized to view:" + endPointPath);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error encountered:" + error);
      ctx.onLogOut();
      return <Navigate to="/login" />;
    }
  }

  return <Outlet />;
};

export default PrivateRoutes;
