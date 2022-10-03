import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {Form, HomepageScreen} from './Tablet_display/Reservation_form';
// import App from './App';
import reportWebVitals from './reportWebVitals';

/* const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); */

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

const homepage = ReactDOM.createRoot(document.getElementById('homepage'));
homepage.render(<HomepageScreen/>);

const tabletForm = ReactDOM.createRoot(document.getElementById("reservation page"));
tabletForm.render(<Form/>);

console.log("index.js")
