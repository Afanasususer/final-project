import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider } from "antd";
import store from "./redux/store";
import { Provider } from "react-redux";
import { Helmet, HelmetProvider } from 'react-helmet-async';
// about page
import '@fortawesome/fontawesome-free/css/all.min.css';

// 

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#2E3840",
          colorBorder: "#2E3840",
        },
      }}
    >
      
      <HelmetProvider>
      <App />
      </HelmetProvider>

    </ConfigProvider>
  </Provider>
);

reportWebVitals();




//  before do anything .. .. .. 