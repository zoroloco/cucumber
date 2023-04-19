import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { AuthContext } from "../context/auth-context";

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
        console.info(
          decoded.username +
            " token still valid for:" +
            (decoded.exp - currentTime) +
            "second(s)."
        );
      }
    } catch (error) {
      //If token cannot be decoded, remove from local storage and redirect to login
      //localStorage.removeItem("access-token");
      ctx.onLogOut();
      return <Navigate to="/login" />;
    }
  }

  return <Outlet />;
};

export default PrivateRoutes;
