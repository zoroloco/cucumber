import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext({});

export const AuthContextProvider = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [tokenExpiration, setTokenExpiration] = useState(null);

  //recover the values from local storage because any route change will
  //recreate this provider component and you lose all state such as user.
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const token = localStorage.getItem("access-token");

    if (token) {
      const decoded = jwt_decode(token);
      setTokenExpiration(decoded.exp);
    }

    setLoggedIn(!!token);
    setIsLoading(false);
    setAccessToken(token);
  }, []);

  const logoutHandler = () => {
    console.info("Logging out.");
    localStorage.removeItem("access-token");
    localStorage.removeItem("user");

    setLoggedIn(false);
    setUser(null);
    setAccessToken(null);
  };

  const loginHandler = (accessToken) => {
    setLoggedIn(true);
    localStorage.setItem("access-token", accessToken);
    try {
      //decode token to check for exp
      const decoded = jwt_decode(accessToken);

      const loggedInUser = {
        username: decoded.username,
        id: decoded.sub,
        userRoles: decoded.userRoles,
      };

      localStorage.setItem("user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      setAccessToken(accessToken);
      setTokenExpiration(decoded.exp);
      console.info(
        JSON.stringify(loggedInUser) +
          " is now logged in. Token expiration:" +
          decoded.exp
      );
    } catch (error) {
      console.error("Error encountered while decoding access token:" + error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken: accessToken,
        isLoading: isLoading,
        loggedIn: loggedIn,
        tokenExpiration: tokenExpiration,
        user: user,
        onLogIn: loginHandler,
        onLogOut: logoutHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
