import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {Form} from './Tablet_display/Reservation_form';
import {HomepageScreen} from './Tablet_display/Homepage';
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
const tabletForm = ReactDOM.createRoot(document.getElementById("reservation page"));
const pages = 2
tabletForm.render(<Form/>);
let display = 0

function areaToDisplay(intDisplay){
  if (intDisplay == 0){
    homepage.render(<HomepageScreen name="Room name"/>);
    tabletForm.render();
  } else {
    homepage.render();
    tabletForm.render(<Form/>);
  }
  return(intDisplay = (intDisplay + 1) % pages)
}

const button = ReactDOM.createRoot(document.getElementById("button zone"));
button.render(
  React.createElement(
    'button',
    { onClick: () => {
      display = areaToDisplay(display);
      console.log(display);
    }},
    "switch display"
  )
);


console.log("index.js")
