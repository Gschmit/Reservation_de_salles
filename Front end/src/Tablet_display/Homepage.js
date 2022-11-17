/* Homepage on room's tablet */

import React from 'react';
import {MyCalendar} from '../Global/calendar';
import axios from 'axios';
import {TabletForm, url} from '../Global/Reservation_form';

const criteriaTablet = ["date", "start time", "end time", "duration", "name of who is reserving",
  "meeting title", "present person"];
const height = 550
const width = window.innerWidth * 90/100

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
        toRender: <HomepageScreen roomId={roomId} root={currentRoot} formRoot={nextRoot}/>
      }}
    />
  )
  currentRoot.render(<></>)
}; //*/  // On mettra ça dans le MyCalendar
/*onSelectEvent={(event) => tabletOnSelectEvent(
            event, this.props.formRoot, this.props.root, this.props.roomId
          )}//*/

function tabletOnSelectSlot(slot, nextRoot, currentRoot, roomId, popupRoot){
  let start = new Date(slot.start)
  let end = new Date(slot.end)
  if (`${start.getDate()}/${start.getMonth()}/${start.getFullYear()}` === `${end.getDate()}/${end.getMonth()}/${end.getFullYear()}`){
    let duration = parseInt((end.getTime() - start.getTime()) / 1000 / 60 / 30)
    nextRoot.render(
      <TabletForm criteria= {criteriaTablet} room={roomId} root={nextRoot} date={start} duration={duration} 
        previousPage={{
          root: currentRoot, 
          toRender: <HomepageScreen roomId={roomId} root={currentRoot} formRoot={nextRoot} popupRoot={popupRoot}/>
        }}
      />
    )
    currentRoot.render(<></>)
  };
};

function startOfTheMeeting(nextMeeting, popupRoot){
  if (nextMeeting){
    let now = new Date()
    console.log(nextMeeting.start_timestamps, new Date(nextMeeting.start_timestamps)) // on a un décalage d'une heure !
    let start = new Date(
      nextMeeting.start_timestamps.year, nextMeeting.start_timestamps.month - 1,
      nextMeeting.start_timestamps.day, nextMeeting.start_timestamps.hour,
      nextMeeting.start_timestamps.minute
    );
    console.log("startOfTheMeeting, start",start)
    console.log(start, now, start < now)
    if (start < now){
      console.log("start < now est ok")
      popupRoot.render(<h1> Are you there ? </h1>)
    }
  };
};//*/

function isNow(meeting){
  if (meeting != null){
    let startTimestamps = meeting.start_timestamps
    let now = new Date()
    let start = new Date(startTimestamps)
    let end = new Date(start.getTime() + meeting.duration * 30 * 60 * 1000)
    return(start < now && now < end)
  } else {
    return(false)
  }
}

class HomepageScreen extends React.Component{
  state = {
    room : {capacity:0, name:""}
  };

  componentDidMount(){
    axios.get(url + `room/${this.props.roomId}/`)
    .then(res => {
      this.setState({room : JSON.parse(res.data.room)})
    });
  };

  render(){
    let name = `${this.state.room.name} (${this.state.room.capacity} places)`
    return( //<h1> Homepage </h1> <br/>
      <div>
          <HomepageRoomNameDisplay roomName={name} /> <br/>
          <HomepageRoomCalendar roomId={this.props.roomId} root={this.props.root} 
            formRoot={this.props.formRoot} popupRoot={this.props.popupRoot}
          />
      </div>
    )
  };
};
  
class HomepageRoomNameDisplay extends React.Component{
  render(){ // éventuellement un formatage en gras ou autre de l'écriture, et/ou passer en titre
    return(<p className="center">{this.props.roomName}</p>)
  };
};

class HomepageRoomCalendar extends React.Component{
  state = {
    meetings: [],
    meetingCurrently: false,
    currentMeetingId: NaN,
  };

  async componentDidMount(){
    let currently = false
    let currentMeetingId = NaN
    let nextMeeting = await axios.get(url + `room_meetings/${this.props.roomId}`)
    .then(res => {
      let meetingList = []
      for (const meet in res.data){
        let meeting = JSON.parse(res.data[meet])
        meetingList.push(meeting)
        if (isNow(meeting)){
          currently = true
          currentMeetingId = meeting.id
        }
      };
      this.setState({meetings : meetingList.slice(0, -1)});
      this.setState({meetingCurrently : currently});
      this.setState({currentMeetingId: currentMeetingId})
      return(meetingList[meetingList.length - 1])
    });
    this.startMeeting = setInterval(startOfTheMeeting, 1000 * 60, nextMeeting) // toutes les 60 secondes (toutes 
    // les minutes/30 secondes serait bien ?)
    this.endMeeting = setInterval(() => {
      let boolean, id = this.meetingToEnd(this.state.meetings)
      this.setState({meetingCurrently : boolean, currentMeetingId : id})
    }, 1000 * 60)
  };

  componentWillUnmount(){
    clearInterval(this.startMeeting)
    clearInterval(this.endMeeting)
  };

  meetingToEnd(meetingList){
    let currently = false
    let currentMeetingId = NaN
    meetingList.map( meet => {
      if (isNow(meet)){
        currently = true
        currentMeetingId = meet.id
      }
    });
    return(currently, currentMeetingId)
  };

  render(){
    let endTheMeeting
    if (this.state.meetingCurrently){
      endTheMeeting = <button onClick={() => console.log("mettre fin à la réunion")}> Réunion terminée </button>
    } else {
      endTheMeeting = <></>
    }
    return( // height et width à régler en fonction des dimensions de l'écran d'affichage
      <div>
        <MyCalendar eventsList={this.state.meetings} height={height} width={width} 
          onSelectSlot={(slot) => tabletOnSelectSlot(
            slot, this.props.formRoot, this.props.root, this.props.roomId, this.props.popupRoot
          )}
        />
        {endTheMeeting}
      </div>
    )
  };
};

/*class StartMeeting extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      isShowing: false
    };
    
    this.toggle = this.toggle.bind(this);
  };

  toggle(){
    this.setState({isShowing : !this.state.isShowing});
  };

  render(){
    this.state.isShowing,
    this.toggle
  };
};//*/

export {HomepageScreen, criteriaTablet};
