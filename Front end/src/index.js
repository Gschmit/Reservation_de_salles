import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {Form} from './Global/Reservation_form';
import {HomepageScreen} from './Tablet_display/Homepage';
import {BookingRoomTool} from './User_interface/user_interface';
import allMessages from './Displayed_messages';
import {MyCalendar} from './Global/calendar';
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

const homepage = ReactDOM.createRoot(document.getElementById('homepage'));
const tabletForm = ReactDOM.createRoot(document.getElementById("reservation page"));
const userHomepage = ReactDOM.createRoot(document.getElementById("reservation page in website"));
const userCalendar = ReactDOM.createRoot(document.getElementById("user calendar"));
// const tabAsset = ReactDOM.createRoot(document.getElementById("tab asset"));      // Ne sera plus jamais utiliser normalement
// const tabRoom = ReactDOM.createRoot(document.getElementById("tab room list"));   // Ne sera plus jamais utiliser normalement
const userInterfaceFalse = ReactDOM.createRoot(document.getElementById("user interface false"));
const userInterfaceTrue = ReactDOM.createRoot(document.getElementById("user interface true"));
const roomCalendar = ReactDOM.createRoot(document.getElementById("room calendar"));
const testCal = ReactDOM.createRoot(document.getElementById("root"))
const pages = 7
const pictureURL = image
// const pictureTest = <img>data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAN8AAACgCAYAAACMjbk4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAM+SURBVHhe7d3BicRAEATB9d8++aNjYG3YuUoioED/JpmnPi8pz/N8v/jvxBcjvh3iixHfDvHFiG+H+GLEt0N8MeLb8TnHMrPfz8sXc47KBvHFiG+H+GLEt0N8MeLbIb4Y8e0QX4z4dogvRnw7xBcjvh3iixHfDvHFiG+H+GLEt0N8MeLbIb4Y8e0QX4z4dogvRnw7xBcjvh3iixHfDvHFiG+H+GLEt0N8MeLbIb4Y8e0QX4z4dogvRnw7xBcjvh3iixHfDvHFiG+H+GLEt0N8MeLb4UcpZpfm5Ys5R2WD+GLEt0N8MeLbIb4Y8e0QX4z4dogvRnw7xBcjvh3iixHfDvHFiG+H+GLEt0N8MeLbIb4Y8e0QX4z4dogvRnw7xBcjvh3iixHfDvHFiG+H+GLEt0N8MeLbIb4Y8e0QX4z4dogvRnw7xBcjvh3iixHfDvHFiG+H+GLEt0N8MeLbIb4Y8e3woxSzS/PyxZyjskF8MeLbIb4Y8e0QX4z4dogvRnw7xBcjvh3iixHfDvHFiG+H+GLEt0N8MeLbIb4Y8e0QX4z4dogvRnw7xBcjvh3iixHfDvHFiG+H+GLEt0N8MeLbIb4Y8e0QX4z4dogvRnw7xBcjvh3iixHfDvHFiG+H+GLEt0N8MeLbIb4Y8e0QX4z4dvhRitmleflizlHZIL4Y8e0QX4z4dogvRnw7xBcjvh3iixHfDvHFiG+H+GLEt0N8MeLbIb4Y8e0QX4z4dogvRnw7xBcjvh3iixHfDvHFiG+H+GLEt0N8MeLbIb4Y8e0QX4z4dogvRnw7xBcjvh3iixHfDvHFiG+H+GLEt0N8MeLbIb4Y8e0QX4z4dogvRnw7/CjF7NK8fDHnqGwQX4z4dogvRnw7xBcjvh3iixHfDvHFiG+H+GLEt0N8MeLbIb4Y8e0QX4z4dogvRnw7xBcjvh3iixHfDvHFiG+H+GLEt0N8MeLbIb4Y8e0QX4z4dogvRnw7xBcjvh3iixHfDvHFiG+H+GLEt0N8MeLbIb4Y8e0QX4z4dogvRnw7xBcjvh1+lGJ2aV6+mHNUNogvRnw7xBcjvh3iixHfDvHFiG+H+GLEt0N8MeLbIb4Y8a143z/QAIMFASQrBQAAAABJRU5ErkJggg==</img>
// pictureURL = pictureTest
const criteriaTablet = ["date", "start time", "end time", "duration", "name of who is reserving",
  "meeting title", "present person"]
const criteriaUser = ["date", "start time", "end time", "duration", "room name", "video conference",
  "meeting title", "present person"]
const assets = ["une liste", "d'assets"]
const roomList = ["une liste", "de salles"]
homepage.render(<HomepageScreen name="Room name (n places)" roomId={2}/>);
// testCal.render(<MyCalendar eventsList= {[]}/>);
let display = pages - 1
//let display = 0

function areaToDisplay(next, shift){
  let intDisplay = (next + shift) % pages
  if (intDisplay === 0){
    homepage.render();
    tabletForm.render(<Form criteria= {criteriaTablet} name={allMessages.roomName["en"]} roomName="Room name"/>);
    userHomepage.render();
  } else if (intDisplay === 1) {
    tabletForm.render();
    userHomepage.render(
      <BookingRoomTool roomList={roomList} userDisplay= "homepage" user="User name" 
        nextMeeting="plus de rendez-vous de prévu"
      />
    );
    userInterfaceFalse.render();
  } else if (intDisplay === 2) {
    userHomepage.render();
    userInterfaceFalse.render(
      <BookingRoomTool assets={assets} roomList={roomList} criteria= {criteriaUser} userDisplay= "form"
        name={allMessages.userInterface["en"]} user="User name"
      />
    );
    userInterfaceTrue.render();
  } else if (intDisplay === 3) {
    userInterfaceFalse.render();
    userInterfaceTrue.render(
      <BookingRoomTool assets={assets} roomList={roomList} picture={pictureURL} criteria= {criteriaUser} 
        userDisplay= "form" name={allMessages.userInterface["en"]} user="User name" activeTab={0}
      />
    );
    userCalendar.render();
  } else if (intDisplay === 4) {
    userInterfaceTrue.render();
    userCalendar.render(<BookingRoomTool roomList={roomList} userDisplay= "user calendar" user="User name"/>
    );
    roomCalendar.render();
  } else if (intDisplay === 5) {
    userCalendar.render();
    roomCalendar.render(
      <BookingRoomTool assets={assets} roomList={roomList} picture={pictureURL} userDisplay= "room calendar" 
        user="User name" activeTab={0}
      />
    );
    homepage.render();
  } else {
    roomCalendar.render();
    homepage.render(<HomepageScreen name="Room name (n places)" roomId={2}/>);
    tabletForm.render();
  }
  if (intDisplay === pages){
    testCal.render(<MyCalendar eventsList= {[]}/>)
  } else {
    testCal.render();
  }
  return(intDisplay)
}

const button1 = ReactDOM.createRoot(document.getElementById("button zone"));
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
);
