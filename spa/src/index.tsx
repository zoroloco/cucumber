import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import config from "./config";

const root = ReactDOM.createRoot(document.getElementById("root"));
const domain = config.domain + "";
const clientId = config.clientId + "";

root.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "http://localhost:3001",
      scopes: ["read:users","openid","profile","email"]
    }}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Auth0Provider>
);
