import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
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
    </div>
    </div>
  </React.StrictMode>
);


reportWebVitals();
