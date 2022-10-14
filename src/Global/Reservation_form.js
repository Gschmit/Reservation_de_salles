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
      videoConference: "videoConference" in this.props ? this.props.videoConference : false,
      numberOfPresentPerson: "numberOfPresentPerson" in this.props ? this.props.numberOfPresentPerson : "",
      roomName: "roomName" in this.props ? this.props.roomName : ""
    };

    this.handleDateValueChange = this.handleDateValueChange.bind(this);
    this.handleDurationValueChange = this.handleDurationValueChange.bind(this);
    this.handleNameReservingTextChange = this.handleNameReservingTextChange.bind(this);
    this.handleTitleMeetingTextChange = this.handleTitleMeetingTextChange.bind(this);
    this.handleVideoConferenceChange = this.handleVideoConferenceChange.bind(this);
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

  handleRoomNameChange(newRoomName){
    this.setState({
      roomName: newRoomName
    });
  };

  render(){
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
          videoConference= {this.state.videoConference}
          onChangeVideoConference= {this.handleVideoConferenceChange}
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
          videoConference= {this.state.videoConference}
          buttons= {this.props.buttons}
          />
        </form>
      </div>);
  };
};

class ButtonArea extends React.Component{
  render(){
    // Il faut un method="get" ou "post" dans le submit
    //       <input type="submit" value="Valider"/> dans le return
    return(<div>
      <ActionButton name= "Validate"
      date= {this.props.date}
      duration= {this.props.duration}
      nameOfWhoSReserving= {this.props.nameOfWhoSReserving}
      roomName= {this.props.roomName}
      titleMeeting= {this.props.titleMeeting}
      numberOfPresentPerson= {this.props.numberOfPresentPerson}
      videoConference= {this.props.videoConference}
      />
      <ActionButton name="Cancel"/>
    </div>); 
  }
};

class ActionButton extends React.Component {
  render(){
    return(
      React.createElement(
        'button',
        { onClick: () => alert(`You clicked on '${this.props.name}' ${this.props.date} 
          ${this.props.duration} ${this.props.nameOfWhoSReserving} ${this.props.roomName}
          ${this.props.titleMeeting} ${this.props.videoConference} ${this.props.numberOfPresentPerson}`) },
        this.props.name
      )
    ); /* date, duration, nameOfWhoSReserving, titleMeeting, videoConference, numberOfPresentPerson, roomName */
  };
};

class Informations extends React.Component {
  render(){
    let end = new Date(this.props.date.getTime() + this.props.duration * 30 * 60 * 1000)
    let dateData, startTimeData, endTimeData, durationData, roomNameData, reservingNameData, 
      videoConferenceData, titleMeetingData, presentPersonNumberData
    if (this.props.criteria.includes("date")){
      dateData = <CriteriaDate name= {`${allMessages.date['en']} : `}
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
      startTimeData = <CriteriaTime name= "start time : "
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
      endTimeData = <CriteriaTime name= "end time : "
        data= {`${setToTwoNumber(end.getHours())}:${setToTwoNumber(end.getMinutes())}`}
        type= "time"
        onChange= {this.props.onChangeDuration}
        change="duration"
        required={true}
        />
    } else {
      endTimeData = <></>
    }
    if (this.props.criteria.includes("duration")){
      durationData = <CriteriaDuration name= "duration (in hours) : "
        data= {this.props.duration / 2}
        type= "duration"
        onChange= {this.props.onChangeDuration}
        change="duration"
        required={true}
        />
    } else {
      durationData = <></>
    }
    if (this.props.criteria.includes("room name")){
      roomNameData = <CriteriaSelect name= "room : "
        data= {this.props.roomName}
        type= "select"
        onChange= {this.props.onChangeName}
        options= {options}
        required={true}
        />
    } else {
      roomNameData = <></>
    }
    if (this.props.criteria.includes("name of who is reserving")){
      reservingNameData = <CriteriaText name= "name of who is reserving : "
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
      titleMeetingData = <CriteriaText name= "title of the meeting : "
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
      presentPersonNumberData = <CriteriaNumber name= "number of physically present persons : "
      data= {this.props.numberOfPresentPerson}
      type= "number"
      onChange= {this.props.onChangePresent}
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
        {videoConferenceData}
        {this.props.criteria.includes("video conference")?<br/>:""}
        {titleMeetingData}
        <br/>
        {presentPersonNumberData}
      </div>);
  };
};
/*
class Criteria extends React.Component {
  render(){
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
    } else{
      data= this.props.data
      type= this.props.type
      step= "any"
    };
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
    return(this.props.name + " ");
  };
};
*/
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
    return(
      <span>
        {this.props.name + " "}
        <input
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
    return(
      <span>
        {this.props.name + " "}
        <input
        type= "time"
        value= {this.props.data}
        onChange= {this.handleDataChange}
        step= {60}
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
    } else {
      this.props.onChange(e.target.value, this.props.type)
    }
  }

  render(){
    return(
      <span>
        {this.props.name + " "}
        <input
        type= "number"
        value= {this.props.data}
        onChange= {this.handleDataChange}
        step= {1/2}
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
    return(
      <span>
        {this.props.name + " "}
        <select required={this.props.required}>
          {this.props.options.map(
            (arrayItem, index) => <option key={index} value={arrayItem}>{arrayItem}</option>
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
    return(
      <span>
        {this.props.name + " "}
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
    return(
      <span>
        {this.props.name + " "}
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
    return(
      <span>
        {this.props.name + " "}
        <input
        type= "number"
        value= {this.props.data}
        onChange= {this.handleDataChange}
        step= {1}
        required={this.props.required}
        />
      </span>
    )
  }
}

export {Form};
