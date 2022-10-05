/* Reservation on room's tablet */

import allMessages from '../Displayed_messages'; 
import React from 'react';

let options = ["test1", "Second élement"]

function setToTwoNumber(number){
  if (number < 10){
    return(`0${number}`)
  }else{
    return(number)
  }
}

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: "date" in this.props ? this.props.date : new Date(), /* Give the date and the start time of the meeting */
      duration: "duration" in this.props ? this.props.duration : 2, /* in half hour */
      nameOfWhoSReserving: "user" in this.props ? this.props.user : "",
      titleMeeting: "titleMeeting" in this.props ? this.props.titleMeeting : "",
      numberOfPresentPerson: "numberOfPresentPerson" in this.props ? this.props.numberOfPresentPerson : "",
      roomName: "roomName" in this.props ? this.props.roomName : ""
    };
    this.handleDateValueChange = this.handleDateValueChange.bind(this);
    this.handleDurationValueChange = this.handleDurationValueChange.bind(this);
    this.handleNameReservingTextChange = this.handleNameReservingTextChange.bind(this);
    this.handleTitleMeetingTextChange = this.handleTitleMeetingTextChange.bind(this);
    this.handlePresentPersonValueChange = this.handlePresentPersonValueChange.bind(this);
    this.handleRoomNameChange = this.handleRoomNameChange.bind(this);
  };

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

  handleRoomNameChange(newRoomName){
    this.setState({
      roomName: newRoomName
    });
  };

  render(){
    console.log("Form Ok");
    let changeName = this.props.criteria.includes("room name") ? this.handleRoomNameChange : this.handleNameReservingTextChange
    return(
      <div>
        <h1> Reservation form of {this.props.name} </h1>
        <br/>
        <form>
          <Informations date= {this.state.date}
          onChangeDate= {this.handleDateValueChange}
          duration= {this.state.duration}
          onChangeDuration= {this.handleDurationValueChange}
          nameOfWhoSReserving= {this.state.nameOfWhoSReserving}
          roomName= {this.state.roomName}
          onChangeName= {changeName}
          titleMeeting= {this.state.titleMeeting}
          onChangeTitle= {this.handleTitleMeetingTextChange}
          numberOfPresentPerson={this.state.numberOfPresentPerson}
          onChangePresent={this.handlePresentPersonValueChange}
          criteria= {this.props.criteria}
          /> <br/>
          <ButtonArea date= {this.state.date}
          duration= {this.state.duration}
          nameOfWhoSReserving= {this.state.nameOfWhoSReserving}
          roomName= {this.state.roomName}
          titleMeeting= {this.state.titleMeeting}
          numberOfPresentPerson= {this.state.numberOfPresentPerson}
          buttons= {this.props.buttons}
          />
        </form>
      </div>);
  };
};

class ButtonArea extends React.Component{
  render(){ 
    console.log("ButtonArea Ok");       // Il faut un method="get" ou "post" dans le submit
    //       <input type="submit" value="Valider"/> dans le return
    return(<div>
      <ActionButton name="Validate"
      date= {this.props.date}
      duration= {this.props.duration}
      nameOfWhoSReserving= {this.props.nameOfWhoSReserving}
      roomName= {this.props.roomName}
      titleMeeting= {this.props.titleMeeting}
      numberOfPresentPerson= {this.props.numberOfPresentPerson}
      />
      <ActionButton name="Cancel"/>
    </div>)
  }
};

class ActionButton extends React.Component {
  render(){
    console.log("ActionButton Ok");
    return(
      React.createElement(
        'button',
        { onClick: () => alert(`You clicked on '${this.props.name}' ${this.props.date} 
          ${this.props.duration} ${this.props.nameOfWhoSReserving} ${this.props.roomName}
          ${this.props.titleMeeting} ${this.props.numberOfPresentPerson}`) },
        this.props.name
      )
    );
  };
};

class Informations extends React.Component {
  render(){
    let end = new Date(this.props.date.getTime() + this.props.duration * 30 * 60 * 1000)
    let dateData, startTimeData, endTimeData, durationData, roomNameData, reservingNameData, 
      videoConferenceData, titleMeetingData, presentPersonNumberData
    console.log(`Informations Ok`);
    if (this.props.criteria.includes("date")){
      dateData = <Criteria name= {`${allMessages.date['en']} : `}
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
      startTimeData = <Criteria name= "start time : "
        data= {`${setToTwoNumber(this.props.date.getHours())}:${setToTwoNumber(this.props.date.getMinutes())}`}
        type= "time"
        onChange= {this.props.onChangeDate}
        change="time"
        required={true}
        />
    } else {
      startTimeData = <></>
    }
    if (this.props.criteria.includes("end time")){
      endTimeData = <Criteria name= "end time : "
        data= {`${setToTwoNumber(end.getHours())}:${setToTwoNumber(end.getMinutes())}`}
        type= "time"
        onChange= {this.props.onChangeDuration}
        change="duration : "
        required={true}
        />
    } else {
      endTimeData = <></>
    }
    if (this.props.criteria.includes("duration")){
      durationData = <Criteria name= "duration (in hours) : "
        data= {this.props.duration / 2}
        type= "duration"
        onChange= {this.props.onChangeDuration}
        change="duration"
        required={true}
        />
    } else {
      durationData = <></>
    }
    if (this.props.criteria.includes("room name")){    // fait doublons avec l'élément select plus haut
      roomNameData = <Criteria name= "room : "
        data= {this.props.roomName}
        type= "select"
        onChange= {this.props.onChangeName}
        change="normal"
        required={true}
        />
    } else {
      roomNameData = <></>
    }
    if (this.props.criteria.includes("name of who is reserving")){
      reservingNameData = <Criteria name= "name of who is reserving : "
        data= {this.props.nameOfWhoSReserving}
        type= "text"
        onChange= {this.props.onChangeName}
        change="normal"
        required={true}
        />
    } else {
      reservingNameData = <></>
    }
    if (this.props.criteria.includes("video conference")){
      videoConferenceData = <Criteria name= "do you need video conference ?"
        data= {this.props.nameOfWhoSReserving}
        type= "radio"
        onChange= {this.props.onChangeName}
        change="normal"
        required={true}
        />
    } else {
      videoConferenceData = <></>
    }
    if (this.props.criteria.includes("meeting title")){
      titleMeetingData = <Criteria name= "title of the meeting : "
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
      presentPersonNumberData = <Criteria name= "number of physically present persons : "
      data= {this.props.numberOfPresentPerson}
      type= "number"
      onChange= {this.props.onChangePresent}
      change="normal"
      required={false}
      /> 
    } else {
      presentPersonNumberData = <></>
    }
    return(
      <div>
        {dateData}
        <br/>
        {startTimeData} {endTimeData}
        <br/>
        {durationData}
        <br/>
        {roomNameData} {reservingNameData}
        <br/>
        {titleMeetingData}
        <br/>
        {presentPersonNumberData}
      </div>);
  };
};

class Criteria extends React.Component {
  render(){
    console.log(`${this.props.name} Criteria Ok`);
    return(
      <span>
        <CriteriaName name= {this.props.name}/>
        <CriteriaData name= {this.props.name}
        data = {this.props.data}
        type= {this.props.type}
        onChange= {this.props.onChange}
        change={this.props.change}
        options={options}
        required={this.props.required}
        />
      </span>
    );
  };
};

class CriteriaData extends React.Component {
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
    if (this.props.type === "select"){
      return(
        <select>
          {this.props.options.map(arrayItem => <option value={arrayItem}>{arrayItem}</option>)}
      </select>);
    }
    let data, type, step
    if (this.props.type === "date"){
      data= this.props.data
      type= "date"
      step= "any"
    } else if (this.props.type === "time"){
      data= this.props.data
      type= "time"
      step= 60
    } else if (this.props.type === "duration"){
      data= this.props.data
      type= "number"
      step= 1/2
    } else if (this.props.type === "text"){
      data= this.props.data
      type= "text"
      step= "any"
    } else if (this.props.type === "number"){
      data= this.props.data
      type= "number"
      step= 1

/* <input type="select">
   <nom>images-type</nom>
   <libellé>support actuel de vos images</libellé>
   <option valeur="papier">photo papier</option>
   <option valeur="dia">diapositives</option>
   <option valeur="numeriques">images numériques</option>
   <p>Si vous utilisez plusieurs formats, cochez celui qui est le plus fréquent.</p>
</input> */
    } else{
      data= this.props.data
      type= this.props.type
      step= "any"
    };
    console.log(`${this.props.name} CriteriaData Ok ${data} ${type}`);
    return (
        <input
          type= {type}
          value= {data}
          onChange= {this.handleDataChange}
          step= {step}
          required={this.props.required}
          />
    );
  };
};

class CriteriaName extends React.Component {
  render(){
    console.log(`${this.props.name} CriteriaName Ok`);
    return(this.props.name + " ");
  };
};

export {Form};
