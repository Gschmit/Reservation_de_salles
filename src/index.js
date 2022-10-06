import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {Form} from './Tablet_display/Reservation_form';
import {HomepageScreen} from './Tablet_display/Homepage';
import {TabRoomSelected} from './Internet_interface/room_asset_tab';
import {TabRoomList} from './Internet_interface/room_list_tab';
import allMessages from './Displayed_messages';
// import App from './App';
import reportWebVitals from './reportWebVitals';

// // // // // // // // // // // // // // // // // // // // // //
// // // // //                                     // // // // //
// // // // //  Define somewhere the language !    // // // // //
// // // // //                                     // // // // //
// // // // // // // // // // // // // // // // // // // // // //

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
const userForm = ReactDOM.createRoot(document.getElementById("reservation page in website"))
const tabAsset = ReactDOM.createRoot(document.getElementById("tab asset"))
const tabRoom = ReactDOM.createRoot(document.getElementById("tab room list"))
const pages = 4
const criteriaTablet = ["date", "start time", "end time", "duration", "name of who is reserving",
  "meeting title", "present person"]
const criteriaUser = ["date", "start time", "end time", "duration", "room name",
"meeting title", "present person"]
const assets = ["une liste", "d'assets"]
const roomList = ["une liste", "de salles"]
// tabletForm.render(<Form criteria= {criteriaTablet} name="Room name" roomName="Room name"/>);
// tabAsset.render(<TabRoomSelected assets={assets} picture="../photo.jpg"/>)
tabRoom.render(<TabRoomList roomList={roomList}/>)
let display = 0

function areaToDisplay(intDisplay){
  if (intDisplay === 0){
    homepage.render(<HomepageScreen name="Room name (n places)"/>);
    tabletForm.render();
    userForm.render();
  } else if (intDisplay === 1) {
    homepage.render();
    tabletForm.render();
    userForm.render(<Form criteria= {criteriaUser} name={allMessages.userInterface["en"]} user="User name"/>);
  }
  else {
    homepage.render();
    tabletForm.render(<Form criteria= {criteriaTablet} name={allMessages.roomName["en"]} roomName="Room name"/>);
    userForm.render();
  }
  return(intDisplay = (intDisplay + 1) % pages)
}

const button = ReactDOM.createRoot(document.getElementById("button zone"));
button.render(
  React.createElement(
    'button',
    { onClick: () => { display = areaToDisplay(display); }},
    allMessages.switchDisplay["en"]
  )
);
