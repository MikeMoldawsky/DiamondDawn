import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import MainLayout from "containers/MainLayout";
import { Provider } from "react-redux";
import { makeStore } from "store/makeStore";
import { inject } from "@vercel/analytics";

let store = makeStore();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <MainLayout />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
// Make sure to call this only once in your app
inject();
