/* Reservation on room's tablet */

import allMessages from '../Displayed_messages'; 
import React from 'react';
import axios from 'axios';
import './global.css';
// import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const url = "http://127.0.0.1:8000/booking_meeting_room/"

function setToTwoNumber(number){
  if (number < 10){
    return(`0${number}`)
  }else{
    return(number)
  }
}

/*const Modal = () => (
  <Popup trigger={<button className="button"> Open Modal </button>} modal>
    <span> Modal content </span>
  </Popup>
);//*/

class Form extends React.Component {
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
      name: "",
      meetings: {},
      response: {rejected: true, error: null, warning: null},
    };    // pour la room et le user, trouver un moyen de stocker l'id et/ou l'objet plutôt que le nom
    // pour le user, ça va être compliqué ...

    this.handleDateValueChange = this.handleDateValueChange.bind(this);
    this.handleDurationValueChange = this.handleDurationValueChange.bind(this);
    this.handleNameReservingTextChange = this.handleNameReservingTextChange.bind(this);
    this.handleTitleMeetingTextChange = this.handleTitleMeetingTextChange.bind(this);
    this.handleVideoConferenceChange = this.handleVideoConferenceChange.bind(this);
    this.handlePresentPersonValueChange = this.handlePresentPersonValueChange.bind(this);
    this.handleRoomNameChange = this.handleRoomNameChange.bind(this);
    this.handleSubmitResponseChange = this.handleSubmitResponseChange.bind(this);
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

  handleSubmitResponseChange(newResponse){
    this.setState({
      response: newResponse
    });
  };

  async handleSubmit(event) {
    event.preventDefault();
    let dateUTC = new Date(this.state.date.getTime() - this.state.date.getTimezoneOffset() * 60 * 1000)
      let present
      if (!this.state.numberOfPresentPerson === ""){
        present = this.state.numberOfPresentPerson
      }
      let response = await axios.put(
        url + "meeting",
        {
          room: this.state.room, user: this.state.nameOfWhoSReserving, date: dateUTC, 
          duration: this.state.duration, title: this.state.titleMeeting, 
          physically_present_person: present
        }
      )
      .then(res => {
        return res.data
      })
      console.log("axios :", response)
      this.handleSubmitResponseChange(response)
    if (!response.rejected){
      this.props.previousPage.root.render(this.props.previousPage.toRender)
      this.props.root.render(<></>)
      console.log("Warning :", response.warning)
    } else if (response.error === "No user fill in") {
      console.log("Error :", response.error,)
      console.log("Warning :", response.warning)
      event.preventDefault();
    } else if (response.error === "Two meetings overlap") {
      console.log("Error :", response.error)
      console.log("Warning :", response.warning)
      let start = new Date(response.warning[0])
      let day = `${setToTwoNumber(start.getDate())}/${setToTwoNumber(start.getMonth() + 1)}/${start.getFullYear()}`
      start = `${setToTwoNumber(start.getHours())}:${setToTwoNumber(start.getMinutes())}`
      let end = new Date(response.warning[1])
      end = `${setToTwoNumber(end.getHours())}:${setToTwoNumber(end.getMinutes())}`
      alert(`Il y a déjà une réunion prévue de ${start} à ${end} le ${day}`)
      event.preventDefault();
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
    let changeName = this.props.criteria.includes("room id") ? this.handleRoomNameChange : this.handleNameReservingTextChange
    return( //<h1> Reservation form of {this.state.name} </h1> <br/>
      <div>
        <form onSubmit={this.handleSubmit} >
          <Informations date= {this.state.date}
          onChangeDate= {this.handleDateValueChange}
          duration= {this.state.duration}
          onChangeDuration= {this.handleDurationValueChange}
          nameOfWhoSReserving= {this.state.nameOfWhoSReserving}
          roomName= {this.state.room}
          onChangeName= {changeName}
          videoConference= {this.state.videoConference}
          onChangeVideoConference= {this.handleVideoConferenceChange}
          titleMeeting= {this.state.titleMeeting}
          onChangeTitle= {this.handleTitleMeetingTextChange}
          numberOfPresentPerson= {this.state.numberOfPresentPerson}
          onChangePresent= {this.handlePresentPersonValueChange}
          criteria= {this.props.criteria}
          roomList= {this.state.roomList}
          /> <br/>
          <ButtonArea date= {this.state.date}
          duration= {this.state.duration}
          nameOfWhoSReserving= {this.state.nameOfWhoSReserving}
          room= {this.state.room}
          titleMeeting= {this.state.titleMeeting}
          numberOfPresentPerson= {this.state.numberOfPresentPerson}
          videoConference= {this.state.videoConference}
          buttons= {this.props.buttons}
          previousPage= {this.props.previousPage}
          root= {this.props.root}
          onSubmitCheckResponse= {this.handleSubmitResponseChange}
          />
        </form>
      </div>
    ); // à quoi sert la props buttons ?? (elle remonte jsuqu'au composant "BookingRoomTool", mais n'est pas 
    // renseigné dans le fichier "index") (pas utiliser dans le composant "ButtonArea")
  };
};

class ButtonArea extends React.Component{
  constructor(props){
    super(props);

    this.handleSubmitResponseChange = this.handleSubmitResponseChange.bind(this);
  }

  handleSubmitResponseChange(response) {
      this.props.onSubmitCheckResponse(response);
  }

  render(){
    return(<div className='space'>
      <ActionButton name= "Valider" type= "submit"
      //callback= {}
      />
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
        <button type= {this.props.type} onClick= {this.props.callback}> {this.props.name} </button>
    );
  };
};

class Informations extends React.Component {
  render(){
    let end = new Date(this.props.date.getTime() + this.props.duration * 30 * 60 * 1000)
    let dateData, startTimeData, endTimeData, durationData, roomNameData, reservingNameData, 
      videoConferenceData, titleMeetingData, presentPersonNumberData
    if (this.props.criteria.includes("date")){
      dateData = <CriteriaDate name= {`${allMessages.date['fr']}`}
        data= {`${this.props.date.getFullYear()}-${setToTwoNumber(this.props.date.getMonth() + 1)}-${setToTwoNumber(this.props.date.getDate())}`}
        type= "date"
        onChange= {this.props.onChangeDate}
        change="date"
        required={true}
        />
    } else {
      dateData = <></>
    }
    if (this.props.criteria.includes("start time")){
      startTimeData = <CriteriaTime name= "début"
        data= {`${setToTwoNumber(this.props.date.getHours())}:${setToTwoNumber(this.props.date.getMinutes())}`}
        type= "time"
        onChange= {this.props.onChangeDate}
        change="time"
        required={true}
        step={300} // 5 minutes
        />
    } else {
      startTimeData = <></>
    }
    if (this.props.criteria.includes("end time")){
      endTimeData = <CriteriaTime name= "fin"
        data= {`${setToTwoNumber(end.getHours())}:${setToTwoNumber(end.getMinutes())}`}
        type= "time"
        onChange= {this.props.onChangeDuration}
        change="duration"
        required={true}
        step={1800} // 30 minutes
        />
    } else {
      endTimeData = <></>
    }
    if (this.props.criteria.includes("duration")){
      durationData = <CriteriaDuration name= "durée (en heures)"
        data= {this.props.duration / 2}
        type= "duration"
        onChange= {this.props.onChangeDuration}
        change="duration"
        required={true}
        />
    } else {
      durationData = <></>
    }
    if (this.props.criteria.includes("room id")){
      roomNameData = <CriteriaSelect name= "salle"
        data= {this.props.roomName}
        type= "select"
        onChange= {this.props.onChangeName}
        list= {this.props.roomList}
        required={true}
        />
    } else {
      roomNameData = <></>
    }
    if (this.props.criteria.includes("name of who is reserving")){
      reservingNameData = <CriteriaText name= "Personne qui réserve" // better name ?
        data= {this.props.nameOfWhoSReserving}
        type= "text"
        onChange= {this.props.onChangeName}
        required={true}
        />
    } else {
      reservingNameData = <></>
    }
    if (this.props.criteria.includes("video conference")){
      videoConferenceData = <CriteriaRadio name= "do you need video conference ?"
        data= {this.props.videoConference}
        type= "radio"
        onChange= {this.props.onChangeVideoConference}
        required={true}
        />
    } else {
      videoConferenceData = <></>
    }
    if (this.props.criteria.includes("meeting title")){
      titleMeetingData = <CriteriaText name= "intitulé de la réunion"
        data= {this.props.titleMeeting}
        type= "text"
        onChange= {this.props.onChangeTitle}
        change="normal"
        required={false}
        />
    } else {
      titleMeetingData = <></>
    }
    if (this.props.criteria.includes("present person")){
      presentPersonNumberData = <CriteriaNumber name= "nombre de personnes physiquement présentes"
      data= {this.props.numberOfPresentPerson}
      type= "number"
      onChange= {this.props.onChangePresent}
      required={false}
      /> 
    } else {
      presentPersonNumberData = <></>
    }
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
        {this.props.criteria.includes("video conference")?<br/>:""}
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
        className='shift'
        type= "date"
        value= {this.props.data}
        onChange= {this.handleDataChange}
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
        className='shift'
        type= "time"
        value= {this.props.data}
        onChange= {this.handleDataChange}
        step= {this.props.step}
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
        <select required={this.props.required} onChange={this.handleDataChange}>
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
      <span>
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
      </span>
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

export {Form, url};
