import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Auth0Provider } from "@auth0/auth0-react";
import history from "./utils/history";
import { getConfig } from "./config";

const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.returnTo ? appState.returnTo : window.location.pathname
  );
};

// read domain / clientId / audience from auth_config.json (unchanged)
const config = getConfig();

const providerConfig = {
  /* 1 — keep the custom host so Apple’s passkey check is happy */
  domain:  config.domain,                       // → felipe-test.mydomainfun.pro
  clientId: config.clientId,

  /* 2 — explicitly accept tokens whose “iss” is the tenant URL */
  issuer: "https://dev-d1118tqz65fz1g5z.us.auth0.com/",

  onRedirectCallback,

  /* 3 — the usual Auth0 params */
  authorizationParams: {
    redirect_uri: window.location.origin,
    ...(config.audience ? { audience: config.audience } : null),
  },
};

const root = createRoot(document.getElementById("root"));
root.render(
  <Auth0Provider {...providerConfig}>
    <App />
  </Auth0Provider>
);

serviceWorker.unregister();
