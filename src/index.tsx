import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ToastBar, Toaster } from "react-hot-toast";
import "./index.css"


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <div style={{backgroundColor:"#01051b"}}>
    <div className="wrapper">
      <div className="glow-effect" />
      <App />
      <Toaster
        containerStyle={{
          position: "fixed",
          top: "83%",
        }}
      >
        {(t) => (
          <ToastBar
            toast={t}
            style={{
              transition: "0.1s",
              ...t.style,
              animation: t.visible
                ? "custom-enter 0.5s ease"
                : "custom-exit 0.5s ease",
            }}
          />
        )}
      </Toaster>
    </div>
    </div>
  </React.StrictMode>
);


reportWebVitals();
