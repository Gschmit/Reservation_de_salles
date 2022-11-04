/* Homepage on room's tablet */

import React from 'react';
import {MyCalendar} from '../Global/calendar';
import axios from 'axios';
import {Form, url} from '../Global/Reservation_form';

const criteriaTablet = ["date", "start time", "end time", "duration", "name of who is reserving",
  "meeting title", "present person"];

// garder le code, cette fonction est pour modifier un meeting ! (et va donc ailleurs)
/*function tabletOnSelectEvent(event, nextRoot, currentRoot, roomId){
  let start = new Date(event.start)
  let end = new Date(event.end)
  let duration = parseInt((end.getTime() - start.getTime()) / 1000 / 60 / 30)
  console.log("event: ", event)
  // récupérer le user qqpart (quand la fonction sera au bon endroit) ainsi que le nombre de personnes présentes
  nextRoot.render(
    <Form criteria= {criteriaTablet} room={roomId} root={nextRoot} date={start} duration={duration} 
      titleMeeting={event.title} previousPage={{
        root: currentRoot, 
        toRender: <HomepageScreen roomId={roomId} root={currentRoot} nextPageRoot={nextRoot}/>
      }}
    />
  )
  currentRoot.render(<></>)
}; //*/  // On mettra ça dans le MyCalendar
/*onSelectEvent={(event) => tabletOnSelectEvent(
            event, this.props.formRoot, this.props.root, this.props.roomId
          )}//*/

function tabletOnSelectSlot(slot, nextRoot, currentRoot, roomId){
  let start = new Date(slot.start)
  let end = new Date(slot.end)
  console.log("slot: ", slot)
  if (`${start.getDate()}/${start.getMonth()}/${start.getFullYear()}` === `${end.getDate()}/${end.getMonth()}/${end.getFullYear()}`){
    let duration = parseInt((end.getTime() - start.getTime()) / 1000 / 60 / 30)
    nextRoot.render(
      <Form criteria= {criteriaTablet} room={roomId} root={nextRoot} date={start} duration={duration} 
        previousPage={{
          root: currentRoot, 
          toRender: <HomepageScreen roomId={roomId} root={currentRoot} nextPageRoot={nextRoot}/>
        }}
      />
    )
    currentRoot.render(<></>) //*/
  };
};

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
            <HomepageRoomCalendar roomId={this.props.roomId} root={this.props.root} 
              formRoot={this.props.nextPageRoot}
            />
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
          <MyCalendar eventsList={this.state.meetings} height={300} width={600} 
            onSelectSlot={(slot) => tabletOnSelectSlot(
              slot, this.props.formRoot, this.props.root, this.props.roomId
            )}
          />
      )
    };
  };

export {HomepageScreen, criteriaTablet};
