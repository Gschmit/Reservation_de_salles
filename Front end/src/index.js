import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {Form} from './Global/Reservation_form';
import {HomepageScreen, criteriaTablet} from './Tablet_display/Homepage';
import {BookingRoomTool} from './User_interface/user_interface';
import allMessages from './Displayed_messages';
import image from "./photo.PNG";
import reportWebVitals from './reportWebVitals';

// paths :
// cd Documents\01_Outil de gestion\1_Réservation_de_salle\room_reservation\Front end
// cd Documents\01_Outil de gestion\1_Réservation_de_salle\room_reservation\Back end\database

// url reachable :
// axios.get("http://127.0.0.1:8000/booking_meeting_room/")
// axios.get("http://127.0.0.1:8000/booking_meeting_room/room/<int:room_id>/")
// axios.post("http://127.0.0.1:8000/booking_meeting_room/room/<int:room_id>/", {year: <int>, month:<int>, day: <int>, hour: <int>, minute: <int>})
// axios.get("http://127.0.0.1:8000/booking_meeting_room/user/<int:user_id>/")
// axios.get("http://127.0.0.1:8000/booking_meeting_room/meeting/<int:meeting_id>")
// axios.get("http://127.0.0.1:8000/booking_meeting_room/meeting_list")
// axios.get("http://127.0.0.1:8000/booking_meeting_room/room_meetings/<int:room_id>")
// axios.get("http://127.0.0.1:8000/booking_meeting_room/user_next_meeting/<int:user_id>`)

// a url variable is defined in the file Reservation_form

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

const homepage = ReactDOM.createRoot(document.getElementById('tablet homepage'));
const tabletForm = ReactDOM.createRoot(document.getElementById("tablet reservation page"));
const userHomepage = ReactDOM.createRoot(document.getElementById("reservation page in website"));
const userCalendar = ReactDOM.createRoot(document.getElementById("user calendar"));
const userInterfaceFalse = ReactDOM.createRoot(document.getElementById("user interface false"));
const userInterfaceTrue = ReactDOM.createRoot(document.getElementById("user interface true"));
const roomCalendar = ReactDOM.createRoot(document.getElementById("room calendar"));
const pages = 7;
const pictureURL = image;
const roomId = 2      // to get somewhere for many tablets
const userId = 2      // to get somewhere for final app
//const criteriaTablet = ["date", "start time", "end time", "duration", "name of who is reserving",
//  "meeting title", "present person"];
const criteriaUser = ["date", "start time", "end time", "duration", "room id", "video conference",
  "meeting title", "present person"];
let display = pages - 1;
areaToDisplay(display, 0); // display = areaToDisplay(display, 0); // for switching pages

function areaToDisplay(intDisplay, shift){
  let next = (intDisplay + shift) % pages
  if (next === 0){
    homepage.render();
    tabletForm.render(
      <Form criteria= {criteriaTablet} room={2} root={tabletForm}
        previousPage={{
          root: homepage, 
          toRender: <HomepageScreen roomId={roomId} root={homepage} formRoot={tabletForm}/>
        }}
      />
    );
    userHomepage.render();
  } else if (next === 1) {
    homepage.render();
    tabletForm.render();
    userHomepage.render(
      <BookingRoomTool userDisplay= "homepage" userName="User name" user={userId} />
    );
    userInterfaceFalse.render();
  } else if (next === 2) {
    userHomepage.render();
    userInterfaceFalse.render(
      <BookingRoomTool criteria= {criteriaUser} userDisplay= "form" user={userId}
        name={allMessages.userInterface["en"]} userName="User name"
      />
    );
    userInterfaceTrue.render();
  } else if (next === 3) {
    userInterfaceFalse.render();
    userInterfaceTrue.render(
      <BookingRoomTool picture={pictureURL} criteria= {criteriaUser} user={userId}
        userDisplay= "form" name={allMessages.userInterface["en"]} username="User name" activeTab={0}
      />
    );
    userCalendar.render();
  } else if (next === 4) {
    userInterfaceTrue.render();
    userCalendar.render(<BookingRoomTool userDisplay= "user calendar" userName="User name" user={userId}/>
    );
    roomCalendar.render();
  } else if (next === 5) {
    userCalendar.render();
    roomCalendar.render(
      <BookingRoomTool picture={pictureURL} userDisplay= "room calendar" user={userId}
        userName="User name" activeTab={0}
      />
    );
    homepage.render();
  } else {
    roomCalendar.render();
    homepage.render(<HomepageScreen roomId={roomId} root={homepage} formRoot={tabletForm}/>);
    tabletForm.render();
  }
  if (!(shift === 0)){
    console.log("previous:", intDisplay, "current:", next)
  }
  return(next)
}

/*const button1 = ReactDOM.createRoot(document.getElementById("button zone"));
button1.render(
  React.createElement(
    'button',
    { onClick: () => { display = areaToDisplay(display,  pages - 1); }},
    allMessages.switchDisplay["en"] + " previous"
  )
);
const button2 = ReactDOM.createRoot(document.getElementById("button zone 2"));
button2.render(
  React.createElement(
    'button',
    { onClick: () => { display = areaToDisplay(display, 1); }},
    allMessages.switchDisplay["en"] + " next"
  )
); //*/
