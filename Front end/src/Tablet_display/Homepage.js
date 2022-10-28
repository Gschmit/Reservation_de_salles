/* Homepage on room's tablet */

import React from 'react';
import MyCalendar from '../Global/calendar';
import axios from 'axios';

class HomepageScreen extends React.Component{
    state = {
      room : {capacity:0, name:""}
    }

    componentDidMount(){
      axios.get(`http://127.0.0.1:8000/booking_meeting_room/room/${this.props.roomId}/`)
      .then(res => {
        this.setState({room : JSON.parse(res.data.room)})
      });
    }

    render(){
      let name = `${this.state.room.name} (${this.state.room.capacity} places)`
      return(
        <div>
            <h1> Homepage </h1> <br/>
            <HomepageRoomNameDisplay roomName={name} /> <br/>
            <HomepageRoomCalendar roomId={this.props.roomId} />
        </div>
      )
    };
  };
  
  class HomepageRoomNameDisplay extends React.Component{
    render(){ // éventuellement un formatage en gras ou autre de l'écriture
      return(this.props.roomName)
    };
  };
  
  class HomepageRoomCalendar extends React.Component{
    state = {
      meetings: [] // formatage nécessaire ?
    };

    componentDidMount(){
      // adresse à modifier, mais on n'a besoin que de l'id de la salle
      /* axios.get(`http://127.0.0.1:8000/booking_meeting_room/{partie à voir}/${this.props.roomId}/`)
      .then(res => {
        this.setState({meetings : JSON.parse(res.data.à_voir)}) // JSON.parse peut être à enlever
      }); */
    };

    render(){
      // aller chercher dans la liste des réunions les réunions de la salle actuelle (componentDidMount)

      return( // height et width à régler en fonction des dimensions de l'écran d'affichage
          <MyCalendar eventslist={this.state.meetings} height={300} width={600}/>
      )
    };
  };

export {HomepageScreen};
