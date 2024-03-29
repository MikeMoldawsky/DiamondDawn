import React from "react";
import ReactDOM from "react-dom/client";
import App from "containers/App";
import { Provider } from "react-redux";
import { makeStore } from "store/makeStore";
import { inject } from "@vercel/analytics";
import reportWebVitals from "./reportWebVitals";
import { sendToVercelAnalytics } from "./vitals";

let store = makeStore();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(sendToVercelAnalytics);
// Make sure to call this only once in your app
inject();
