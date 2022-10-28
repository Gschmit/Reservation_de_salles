/* Homepage on room's tablet */

import React from 'react';
import {MyCalendar} from '../Global/calendar';
import axios from 'axios';
import {url} from '../Global/Reservation_form';

class HomepageScreen extends React.Component{
    state = {
      room : {capacity:0, name:""}
    }

    componentDidMount(){
      axios.get(url + `room/${this.props.roomId}/`)
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
      meetings: []
    };

    componentDidMount(){
      axios.get(url + `room_meetings/${this.props.roomId}`)
      .then(res => {
        let meetingList = []
        for (const meet in res.data){
          meetingList.push(JSON.parse(res.data[meet]))
        };
        this.setState({meetings : meetingList});
      });
    };

    render(){
      // aller chercher dans la liste des réunions les réunions de la salle actuelle (componentDidMount)
      return( // height et width à régler en fonction des dimensions de l'écran d'affichage
          <MyCalendar eventsList={this.state.meetings} height={300} width={600}/>
      )
    };
  };

export {HomepageScreen};
