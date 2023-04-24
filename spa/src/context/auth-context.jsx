import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext({});

export const AuthContextProvider = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  //recover the values from local storage because any route change will
  //recreate this provider component and you lose all state such as user.
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const token = localStorage.getItem("access-token");

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
    //TODO: hydrate user from DB.
    try {
      //decode token to check for exp
      const decoded = jwt_decode(accessToken);
      const loggedInUser = { username: decoded.username };
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      setAccessToken(accessToken);
      console.info(loggedInUser.username + " is now logged in.");
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
        user: user,
        onLogIn: loginHandler,
        onLogOut: logoutHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
