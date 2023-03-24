import { createContext } from "react";

const AuthContext = createContext({
  accessToken: "",
  user: {},
  onLogIn: () => {}
});

export default AuthContext;
