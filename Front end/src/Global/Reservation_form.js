/* Reservation on room's tablet */

import allMessages from '../Displayed_messages'; 
import React from 'react';
import axios from 'axios';
import './global.css';
import 'reactjs-popup/dist/index.css';

const url = "http://127.0.0.1:8000/booking_meeting_room/"

function setToTwoNumber(number){
  if (number < 10){
    return(`0${number}`)
  }else{
    return(number)
  }
}

class TabletForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "date" in this.props ? this.props.date : new Date(), /* Give the date and the start time of the meeting */
      duration: "duration" in this.props ? this.props.duration : 2, /* in half hour */
      nameOfWhoSReserving: "user" in this.props ? this.props.user : "",
      titleMeeting: "titleMeeting" in this.props ? this.props.titleMeeting : "",
      numberOfPresentPerson: "numberOfPresentPerson" in this.props ? this.props.numberOfPresentPerson : "",
    };    // pour le user, trouver un moyen de stocker l'id et/ou l'objet plutôt que le nom
    // ça va être compliqué ... 

    this.handleDateValueChange = this.handleDateValueChange.bind(this);
    this.handleDurationValueChange = this.handleDurationValueChange.bind(this);
    this.handleNameReservingTextChange = this.handleNameReservingTextChange.bind(this);
    this.handleTitleMeetingTextChange = this.handleTitleMeetingTextChange.bind(this);
    this.handlePresentPersonValueChange = this.handlePresentPersonValueChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleDateValueChange(newDate, typeChanged){
    let oldDate = new Date(this.state.date)
    if (typeChanged === "date"){
      oldDate.setFullYear(newDate.slice(0,4), newDate.slice(5,7) - 1, newDate.slice(8,10))

    } else {
      oldDate.setHours(newDate.slice(0,2))
      oldDate.setMinutes(newDate.slice(3,5))
    }
    this.setState({
      date: oldDate
    });
  };

  handleDurationValueChange(newDuration, typeChanged){
    if (typeChanged === "duration"){
      this.setState({
        duration: 2 * newDuration
      });
    } else {
      let endDate = new Date(this.state.date)
      endDate.setHours(newDuration.slice(0,2))
      endDate.setMinutes(newDuration.slice(3,5))
      this.setState({
        duration: parseInt((endDate.getTime() - this.state.date.getTime()) / 1000 / 60 / 30)
      });
    }
  };

  handleNameReservingTextChange(newPerson){
    this.setState({
      nameOfWhoSReserving: newPerson
    });
  };

  handleTitleMeetingTextChange(newTitleMeeting){
    this.setState({
      titleMeeting: newTitleMeeting
    });
  };

  handlePresentPersonValueChange(newPresentPersonNumber){
    this.setState({
      numberOfPresentPerson: newPresentPersonNumber
    });
  };

  async handleSubmit(event) {
    event.preventDefault();
    let present
    if (!this.state.numberOfPresentPerson === ""){
      present = this.state.numberOfPresentPerson
    }
    alert("before axios")
    let response = await axios.put(
      url + "meeting",
      {
        room: this.props.room.id, user: this.state.nameOfWhoSReserving, date: this.state.date, 
        duration: this.state.duration, title: this.state.titleMeeting, 
        physically_present_person: present
      }
    )
    .then(res => {
      return res.data
    })
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        alert(error.response.data);
        alert(error.response.status);
        alert(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        alert(`response : ${error.request.response}`);
        alert(`onreadystatechange : ${error.request.onreadystatechange}`);
        alert(`readyState : ${error.request.readyState}`);
        console.log(error.request)
        // the result of error.request when python server is off :
        /* 
        XMLHttpRequest {onreadystatechange: null, readyState: 4, timeout: 0, withCredentials: false, upload: XMLHttpRequestUpload, …}
onabort
: 
ƒ handleAbort()
onerror
: 
ƒ handleError()
onload
: 
null
onloadend
: 
ƒ onloadend()
onloadstart
: 
null
onprogress
: 
null
onreadystatechange
: 
null
ontimeout
: 
ƒ handleTimeout()
readyState
: 
4
response
: 
""
responseText
: 
""
responseType
: 
""
responseURL
: 
""
responseXML
: 
null
status
: 
0
statusText
: 
""
timeout
: 
0
upload
: 
XMLHttpRequestUpload
onabort
: 
null
onerror
: 
null
onload
: 
null
onloadend
: 
null
onloadstart
: 
null
onprogress
: 
null
ontimeout
: 
null
[[Prototype]]
: 
XMLHttpRequestUpload
withCredentials
: 
false
[[Prototype]]
: 
XMLHttpRequest */
      } else {
        // Something happened in setting up the request that triggered an Error
        alert('Error', error.message);
      }
      console.log(error.config);
    });
    alert("after axios")
    if (!response.rejected){
      this.props.previousPage.root.render(this.props.previousPage.toRender)
      this.props.root.render(<></>)
      console.log("Warning :", response.warning)
    } else if (response.error === "No user fill in") {
      // this if is never executed (in the room view) (because of the form validation?)
      console.log("Error :", response.error)
      console.log("Warning :", response.warning)
      alert(`${response.error}, ${response.warning}`)
      event.preventDefault() // this statement seems to have no effect then
    } else if (response.error === "Two meetings overlap") {
      console.log("Error :", response.error)
      console.log("Warning :", response.warning)
      let start = new Date(response.warning[0])
      let day = `${setToTwoNumber(start.getDate())}/${setToTwoNumber(start.getMonth() + 1)}/${start.getFullYear()}`
      start = `${setToTwoNumber(start.getHours())}:${setToTwoNumber(start.getMinutes())}`
      let end = new Date(response.warning[1])
      end = `${setToTwoNumber(end.getHours())}:${setToTwoNumber(end.getMinutes())}`
      alert(`Il y a déjà une réunion prévue de ${start} à ${end} le ${day}`)
    } else {
      console.log("Error :", response.error)
      console.log("Warning :", response.warning)
      event.preventDefault();
    }
    console.log(response.rejected);
  };

  /*componentDidMount(){
    // Il faudrait limiter la durée de la réunion ainsi que les horaires disponibles.
    axios.get(url + `{partie à voir}/${roomId à récupérer qqpart}/`)
    .then(res => {
      // set here the max value of duration depending on the start time value.
      //                                                !!!!!!!!!!!!!!!!!!!!
      // and set first and last start time possible. => !!! TO REALLY DO !!!
      //                                                !!!!!!!!!!!!!!!!!!!!
    }); 
  }; //*/

  render(){
    return(
      <div>
        <form onSubmit={this.handleSubmit} className='testForm'>
        <Informations date= {this.state.date}
          onChangeDate= {this.handleDateValueChange}
          duration= {this.state.duration}
          onChangeDuration= {this.handleDurationValueChange}
          nameOfWhoSReserving= {this.state.nameOfWhoSReserving}
          onChangeName= {this.handleNameReservingTextChange}
          titleMeeting= {this.state.titleMeeting}
          onChangeTitle= {this.handleTitleMeetingTextChange}
          numberOfPresentPerson= {this.state.numberOfPresentPerson}
          onChangePresent= {this.handlePresentPersonValueChange}
          criteria= {this.props.criteria} // could disapear ? => or may be replaced by formKind = "room"
          formKind= "room"
          /> <br/>
          <ButtonArea
          buttons= {this.props.buttons}
          previousPage= {this.props.previousPage}
          root= {this.props.root}
          />
        </form>
        <br/>
        <p className='mandatory center'> * champs obligatoire </p>
      </div>
    ); // à quoi sert la props buttons ?? (elle remonte jsuqu'au composant "BookingRoomTool", mais n'est pas 
    // renseigné dans le fichier "index") (pas utiliser dans le composant "ButtonArea")
  };
};

class UserForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      date: "date" in this.props ? this.props.date : new Date(), /* Give the date and the start time of the meeting */
      duration: "duration" in this.props ? this.props.duration : 2, /* in half hour */
      nameOfWhoSReserving: "user" in this.props ? this.props.user : "",
      titleMeeting: "titleMeeting" in this.props ? this.props.titleMeeting : "",
      videoConference: "videoConference" in this.props ? this.props.videoConference : false,
      numberOfPresentPerson: "numberOfPresentPerson" in this.props ? this.props.numberOfPresentPerson : "",
      room: "room" in this.props ? this.props.room : NaN,
      roomList: [],
    };    // pour la room et le user, trouver un moyen de stocker l'id et/ou l'objet plutôt que le nom
    // pour le user, ça va être compliqué ...

    this.handleDateValueChange = this.handleDateValueChange.bind(this);
    this.handleDurationValueChange = this.handleDurationValueChange.bind(this);
    this.handleNameReservingTextChange = this.handleNameReservingTextChange.bind(this);
    this.handleTitleMeetingTextChange = this.handleTitleMeetingTextChange.bind(this);
    this.handleVideoConferenceChange = this.handleVideoConferenceChange.bind(this);
    this.handlePresentPersonValueChange = this.handlePresentPersonValueChange.bind(this);
    this.handleRoomNameChange = this.handleRoomNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleDateValueChange(newDate, typeChanged){
    let oldDate = new Date(this.state.date)
    if (typeChanged === "date"){
      oldDate.setFullYear(newDate.slice(0,4), newDate.slice(5,7) - 1, newDate.slice(8,10))

    } else {
      oldDate.setHours(newDate.slice(0,2))
      oldDate.setMinutes(newDate.slice(3,5))
    }
    this.setState({
      date: oldDate
    });
  };

  handleDurationValueChange(newDuration, typeChanged){
    if (typeChanged === "duration"){
      this.setState({
        duration: 2 * newDuration
      });
    } else {
      let endDate = new Date(this.state.date)
      endDate.setHours(newDuration.slice(0,2))
      endDate.setMinutes(newDuration.slice(3,5))
      this.setState({
        duration: parseInt((endDate.getTime() - this.state.date.getTime()) / 1000 / 60 / 30)
      });
    }
  };

  handleNameReservingTextChange(newPerson){
    this.setState({
      nameOfWhoSReserving: newPerson
    });
  };

  handleTitleMeetingTextChange(newTitleMeeting){
    this.setState({
      titleMeeting: newTitleMeeting
    });
  };

  handleVideoConferenceChange(newVideoConference){
    this.setState({
      videoConference: newVideoConference
    });
  };

  handlePresentPersonValueChange(newPresentPersonNumber){
    this.setState({
      numberOfPresentPerson: newPresentPersonNumber
    });
  };

  handleRoomNameChange(newRoom){
    this.setState({
      room: newRoom
    });
  };

  async handleSubmit(event) {
    event.preventDefault();
      let present
      if (!this.state.numberOfPresentPerson === ""){
        present = this.state.numberOfPresentPerson
      }
      console.log("ici", present)
      let response = await axios.put( // this cause an error 500 ...
        url + "meeting",
        {
          room: this.state.room, user: this.state.nameOfWhoSReserving, date: this.state.date, 
          duration: this.state.duration, title: this.state.titleMeeting, 
          physically_present_person: present
        }
      )
      .then(res => {
        return res.data
      })
    if (!response.rejected){
      this.props.previousPage.root.render(this.props.previousPage.toRender)
      this.props.root.render(<></>)
      console.log("Warning :", response.warning)
    } else if (response.error === "No user fill in") {
      console.log("Error :", response.error,)
      console.log("Warning :", response.warning)
      alert(`${response.error}, ${response.warning}`)
      event.preventDefault() // this statement seems to have no effect then
    } else if (response.error === "Two meetings overlap") {
      console.log("Error :", response.error)
      console.log("Warning :", response.warning)
      let start = new Date(response.warning[0])
      let day = `${setToTwoNumber(start.getDate())}/${setToTwoNumber(start.getMonth() + 1)}/${start.getFullYear()}`
      start = `${setToTwoNumber(start.getHours())}:${setToTwoNumber(start.getMinutes())}`
      let end = new Date(response.warning[1])
      end = `${setToTwoNumber(end.getHours())}:${setToTwoNumber(end.getMinutes())}`
      alert(`Il y a déjà une réunion prévue de ${start} à ${end} le ${day}`)
    } else {
      console.log("Error :", response.error)
      console.log("Warning :", response.warning)
      event.preventDefault();
    }
    console.log(response.rejected);
  };

  componentDidMount(){
    if (isNaN(this.state.room)){ // On test ici seulement si l'id de la salle est renseigné
      // on voudrait savoir si on a affaire un affichage sur salle ou un affichage pour user
      axios.get(url + "room_list")
      .then(res => {
        let rooms = []
        for (const room in res.data) {
          rooms.push(JSON.parse(res.data[room]))
        };
        this.setState({roomList : rooms})
      });
      // Pour un utilisateur, on a besoin de la liste de toutes les réunions  (plus éventuellement un filtre 
      // sur celle de celui-ci) !!! Mettre à jour ce besoin, à faire si possible sur python !!!
      // Pour une salle, il faut limiter la durée de la réunion ainsi que les horaires disponibles.
      /* axios.get(url + `{partie à voir}/${roomId à récupérer qqpart}/`)
      .then(res => {
        // set here the max value of duration depending on the start time value.
        // and set first and last start time possible.
      }); */
    } else {
      axios.get(url + `room/${this.state.room}/`)
      .then(res => {
        this.setState({name : JSON.parse(res.data["room"]).name})
      })
      /* axios.get(url + "meeting_list")
      .then(res => {
        let meet = {}
        for (const meeting in res.data) {
          meet[meeting] = JSON.parse(res.data[meeting])
        };
        console.log("meet :", meet)
        this.setState({meetings : meet})
      });*/
    };
  };

  render(){
    return(
      <div>
        <form onSubmit={this.handleSubmit} >
          <Informations date= {this.state.date}
          onChangeDate= {this.handleDateValueChange}
          duration= {this.state.duration}
          onChangeDuration= {this.handleDurationValueChange}
          nameOfWhoSReserving= {this.state.nameOfWhoSReserving}
          roomName= {this.state.room}
          onChangeName= {this.handleRoomNameChange}
          videoConference= {this.state.videoConference}
          onChangeVideoConference= {this.handleVideoConferenceChange}
          titleMeeting= {this.state.titleMeeting}
          onChangeTitle= {this.handleTitleMeetingTextChange}
          numberOfPresentPerson= {this.state.numberOfPresentPerson}
          onChangePresent= {this.handlePresentPersonValueChange}
          criteria= {this.props.criteria} // could disapear ? => or may be changed in criteria = "user"
          roomList= {this.state.roomList}
          /> <br/>
          <ButtonArea
          buttons= {this.props.buttons}
          previousPage= {this.props.previousPage}
          root= {this.props.root}
          />
        </form>
        <br/>
        <p className='mandatory center'> * champs obligatoire </p>
      </div>
    ); // à quoi sert la props buttons ?? (elle remonte jsuqu'au composant "BookingRoomTool", mais n'est pas 
    // renseigné dans le fichier "index") (pas utiliser dans le composant "ButtonArea")
  };
};

class ButtonArea extends React.Component{
  render(){
    return(<div className='space'>
      <ActionButton name= "Valider" type= "submit" />
      <ActionButton name= "Annuler" type= "button"
        callback= {() => {
          this.props.previousPage.root.render(this.props.previousPage.toRender)
          this.props.root.render(<></>)
        }}
      />
    </div>);
  }
};

class ActionButton extends React.Component {
  render(){
    return(
        <button className='formButton' type= {this.props.type} onClick= {this.props.callback}> {this.props.name} </button>
    );
  };
};

class Informations extends React.Component {
  render(){
    let end = new Date(this.props.date.getTime() + this.props.duration * 30 * 60 * 1000)
    let dateData, startTimeData, endTimeData, durationData, roomNameData, reservingNameData, 
      videoConferenceData, titleMeetingData, presentPersonNumberData
    dateData = <CriteriaDate
      name= {`${allMessages.date['fr']}`}
      data= {`${this.props.date.getFullYear()}-${setToTwoNumber(this.props.date.getMonth() + 1)}-${setToTwoNumber(this.props.date.getDate())}`}
      type= "date"
      onChange= {this.props.onChangeDate}
      change="date"
      required={true}
      />
    startTimeData = <CriteriaTime
      name= "début"
      data= {`${setToTwoNumber(this.props.date.getHours())}:${setToTwoNumber(this.props.date.getMinutes())}`}
      type= "time"
      onChange= {this.props.onChangeDate}
      change="time"
      required={true}
      step={300} // 5 minutes
      />
    endTimeData = <CriteriaTime
      name= "fin"
      data= {`${setToTwoNumber(end.getHours())}:${setToTwoNumber(end.getMinutes())}`}
      type= "time"
      onChange= {this.props.onChangeDuration}
      change="duration"
      required={true}
      step={1800} // 30 minutes
      />
    durationData = <CriteriaDuration
      name= "durée (en heures)"
      data= {this.props.duration / 2}
      type= "duration"
      onChange= {this.props.onChangeDuration}
      change="duration"
      required={true}
      />
    titleMeetingData = <CriteriaText
      name= "intitulé de la réunion"
      data= {this.props.titleMeeting}
      type= "text"
      onChange= {this.props.onChangeTitle}
      change="normal"
      required={false}
      />
    presentPersonNumberData = <CriteriaNumber
      name= "nombre de personnes physiquement présentes"
      data= {this.props.numberOfPresentPerson}
      type= "number"
      onChange= {this.props.onChangePresent}
      required={false}
      />
    if (this.props.formKind === "room"){
      reservingNameData = <CriteriaText name= "Personne qui réserve" // better name ?
        data= {this.props.nameOfWhoSReserving}
        type= "text"
        onChange= {this.props.onChangeName}
        required={true}
        />
    } else { // if (this.props.formKind === "user") // maybe something else, if we need several 'formKind' for users
      reservingNameData = <></>
    } // we want to change the tests under this
    if (this.props.criteria.includes("room id")){
      console.log("497, ai je le droit de m'afficher :", this.props.formKind !== "room")
      roomNameData = <CriteriaSelect name= "salle"
        onChange= {this.props.onChangeName}
        list= {this.props.roomList}
        required={true}
        />
    } else {
      console.log("506, ai je le droit de m'afficher :", this.props.formKind === "room")
      roomNameData = <></>
    }
    if (this.props.criteria.includes("video conference")){
      console.log("510, ai je le droit de m'afficher :", this.props.formKind !== "room")
      videoConferenceData = <CriteriaRadio name= "do you need video conference ?"
        data= {this.props.videoConference}
        type= "radio"
        onChange= {this.props.onChangeVideoConference}
        required={true}
        />
    } else {
      console.log("518, ai je le droit de m'afficher :", this.props.formKind === "room")
      videoConferenceData = <></>
    }
    /*make a sort :
      - things always displayed : (done)
        * present person
        * meeting title	
        * end time 
        * start time 
        * date
        * duration
      - things displayed only for room : (done)
        * name of who is reserving
      - things displayed only for user (maybe several 'formKind' for users) (TO DO)
    */
    return(
      <div className='center'>
        {dateData}
        <br/>
        {startTimeData} {endTimeData}
        <br/>
        {durationData}
        <br/>
        {roomNameData} {reservingNameData}
        <br/>
        {videoConferenceData}
        {titleMeetingData}
        <br/>
        {presentPersonNumberData}
      </div>);
  };
};

class CriteriaDate extends React.Component{
  constructor(props) {
    super(props);
    this.handleDataChange = this.handleDataChange.bind(this);
  }

  handleDataChange(e) {
    if (this.props.change === "normal"){
      this.props.onChange(e.target.value);
    } else {
      this.props.onChange(e.target.value, this.props.type)
    }
  }

  render(){
    let mandatory = this.props.required?<span className="mandatory">*</span> : <></>
    return( // min and max works well
      <span>
        <span>{this.props.name}{mandatory} : </span>
        <input
        className='test'
        type= "date"
        value= {this.props.data}
        onChange= {this.handleDataChange}
        style= {{width: "109px"}}   // if needed a percentage : 15% is fine // size may be better than style ?
        required={this.props.required}
        />
      </span>
    )
  }
}

class CriteriaTime extends React.Component{
  constructor(props) {
    super(props);
    this.handleDataChange = this.handleDataChange.bind(this);
  }

  handleDataChange(e) {
    if (this.props.change === "normal"){
      this.props.onChange(e.target.value);
    } else {
      this.props.onChange(e.target.value, this.props.type)
    }
  }

  render(){
    let mandatory = this.props.required?<span className="mandatory">*</span> : <></>
    return( // min and max doesn't work, neither step
      <span>
        <span>{this.props.name}{mandatory} : </span>
        <input
        className='test'
        type= "time"
        value= {this.props.data}
        onChange= {this.handleDataChange}
        step= {this.props.step}
        style= {{width: "70px"}}  // if needed a percentage : 10% is fine // size may be better than style ?
        required={this.props.required}
        /> 
      </span>
    )
  }
}

class CriteriaDuration extends React.Component{
  constructor(props) {
    super(props);
    this.handleDataChange = this.handleDataChange.bind(this);
  }

  handleDataChange(e) {
    if (this.props.change === "normal"){
      this.props.onChange(e.target.value);
    } else {  // this test is weird, change and type values are always 'duration'
      this.props.onChange(e.target.value, this.props.type)
    }
  }

  render(){
    let mandatory = this.props.required?<span className="mandatory">*</span> : <></>
    return( // min and max works well
      <span>
        <span>{this.props.name}{mandatory} : </span>
        <input
        className='test'
        type= "number"
        value= {this.props.data}
        onChange= {this.handleDataChange}
        step= {1/2}
        min= {1/2}
        required={this.props.required}
        />
      </span>
    )
  }
}

class CriteriaSelect extends React.Component{
  constructor(props) {
    super(props);
    this.handleDataChange = this.handleDataChange.bind(this);
  }

  handleDataChange(e) {
    this.props.onChange(e.target.value);
  }

  render(){
    let mandatory = this.props.required?<span className="mandatory">*</span> : <></>
    return(
      <span>
        <span>{this.props.name}{mandatory} : </span>
        <select className='test' required={this.props.required} onChange={this.handleDataChange}>
          <option key={-1} value={"empty"}>-- Select one --</option>
          {this.props.list.map(
            (arrayItem, index) => <option key={index} value={arrayItem.id}>{arrayItem.name}</option>
          )}
        </select>
      </span>
    )
  }
}

class CriteriaText extends React.Component{
  constructor(props) {
    super(props);
    this.handleDataChange = this.handleDataChange.bind(this);
  }

  handleDataChange(e) {
    this.props.onChange(e.target.value);
  }

  render(){
    let mandatory = this.props.required?<span className="mandatory">*</span> : <></>
    return(
      <span>
        <span>{this.props.name}{mandatory} : </span>
        <input
        className='test'
        type= "text"
        value= {this.props.data}
        onChange= {this.handleDataChange}
        required={this.props.required}
        />
      </span>
    )
  }
}

class CriteriaRadio extends React.Component{
  constructor(props) {
    super(props);
    this.handleDataChange = this.handleDataChange.bind(this);
  }

  handleDataChange(e) {
    this.props.onChange(e.target.value === "true");
  }

  render(){
    let mandatory = this.props.required?<span className="mandatory">*</span> : <></>
    return(
      <div>
        <span>{this.props.name}{mandatory} : </span>
        <input
        type= "radio"
        checked= {this.props.data}
        value= {true}
        onChange= {this.handleDataChange}
        required={this.props.required}
        />Yes
        <input
        type= "radio"
        checked= {!this.props.data}
        value= {false}
        onChange= {this.handleDataChange}
        required={this.props.required}
        />No
      </div>
    )
  }
}

class CriteriaNumber extends React.Component{
  constructor(props) {
    super(props);
    this.handleDataChange = this.handleDataChange.bind(this);
  }

  handleDataChange(e) {
      this.props.onChange(e.target.value);
  }

  render(){
    let mandatory = this.props.required?<span className="mandatory">*</span> : <></>
    return(
      <span>
        <span>{this.props.name}{mandatory} : </span>
        <input
        className= 'test'
        type= "number"
        value= {this.props.data}
        onChange= {this.handleDataChange}
        step= {1}
        min= {1}  // counting the reserver, instead : 0
        // no max value to allow to see rooms with no enought space, without creating bugs
        // but for rooms view, set up an advertising ?
        required={this.props.required}
        />
      </span>
    )
  }
}

export {TabletForm, UserForm, url};
