import React from 'react';

function setToTwoNumber(number){
  if (number < 10){
    return(`0${number}`)
  }else{
    return(number)
  }
}

/* Homepage on room's tablet */

class HomepageScreen extends React.Component{
  render(){
    return(
      <div>
        <HomepageRoomNameDisplay/> <br/>
        <HomepageRoomCalendar/>
      </div>
    )
  };
};

class HomepageRoomNameDisplay extends React.Component{
  render(){
    return("Name")
  };
};

class HomepageRoomCalendar extends React.Component{
  render(){
    return("Calendar")
  };
};

/* Reservation on room's tablet */

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(), /* Give the date and the start time of the meeting */
      duration: 2, /* in half hour */
      nameOfWhoSReserving: "",
      titleMeeting:"",
      numberOfPresentPerson:1
    };
    this.handleDateValueChange = this.handleDateValueChange.bind(this);
    this.handleDurationValueChange = this.handleDurationValueChange.bind(this);
    this.handleNameReservingTextChange = this.handleNameReservingTextChange.bind(this);
    this.handleTitleMeetingTextChange = this.handleTitleMeetingTextChange.bind(this);
    this.handlePresentPersonValueChange = this.handlePresentPersonValueChange.bind(this);
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
        duration: newDuration
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

  render(){
    console.log("Form Ok");
    return(
      <div>
        <Informations date={this.state.date}
        onChangeDate= {this.handleDateValueChange}
        duration= {this.state.duration}
        onChangeDuration= {this.handleDurationValueChange}
        nameOfWhoSReserving= {this.state.nameOfWhoSReserving}
        onChangeName= {this.handleNameReservingTextChange}
        titleMeeting= {this.state.titleMeeting}
        onChangeTitle= {this.handleTitleMeetingTextChange}
        numberOfPresentPerson={this.state.numberOfPresentPerson}
        onChangePresent={this.handlePresentPersonValueChange}
        /> <br/>
        <ButtonArea date= {this.state.date}
        duration= {this.state.duration}
        nameOfWhoSReserving= {this.state.nameOfWhoSReserving}
        titleMeeting= {this.state.titleMeeting}
        numberOfPresentPerson= {this.state.numberOfPresentPerson}
        />
      </div>);
  };
};

class ButtonArea extends React.Component{
  render(){ 
    console.log("ButtonArea Ok");
    return(<div>
      <ActionButton name="Validate"
      date= {this.props.date}
      duration= {this.props.duration}
      nameOfWhoSReserving= {this.props.nameOfWhoSReserving}
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
          ${this.props.duration} ${this.props.nameOfWhoSReserving} ${this.props.titleMeeting}
          ${this.props.numberOfPresentPerson}`) },
        this.props.name
      )
    );
  };
};

class Informations extends React.Component {
  render(){
    let end = new Date(this.props.date.getTime() + this.props.duration * 30 * 60 * 1000)
    // Toute les props sont des strings ;(
    console.log(`Informations Ok`);
    return(
      <div>
        <Criteria name= "date" 
        data= {`${this.props.date.getFullYear()}-${setToTwoNumber(this.props.date.getMonth() + 1)}-${setToTwoNumber(this.props.date.getDate())}`}
        type= "date"
        onChange= {this.props.onChangeDate}
        change="date"
        /> <br/>
        <Criteria name= "start time"
        data= {`${setToTwoNumber(this.props.date.getHours())}:${setToTwoNumber(this.props.date.getMinutes())}`}
        type= "time"
        onChange= {this.props.onChangeDate}
        change="time"
        />
        <Criteria name= "end time"
        data= {`${setToTwoNumber(end.getHours())}:${setToTwoNumber(end.getMinutes())}`}
        type= "time"
        onChange= {this.props.onChangeDuration}
        change="duration"
        /> <br/>
        <Criteria name= "duration"
        data= {this.props.duration}
        type= "duration"
        onChange= {this.props.onChangeDuration}
        change="duration"
        /> <br/>
        <Criteria name= "name of who is reserving"
        data= {this.props.nameOfWhoSReserving}
        type= "text"
        onChange= {this.props.onChangeName}
        change="normal"
        /> <br/>
        <Criteria name= "title of the meeting"
        data= {this.props.titleMeeting}
        type= "text"
        onChange= {this.props.onChangeTitle}
        change="normal"
        /> <br/>
        <Criteria name= "number of physically present persons"
        data= {this.props.numberOfPresentPerson}
        type= "number"
        onChange= {this.props.onChangePresent}
        change="normal"
        /> 
      </div>);
  };
};

class Criteria extends React.Component {
  render(){
    console.log(`${this.props.name} Criteria Ok`);
    return(
      <div>
        <CriteriaName name= {this.props.name}/>
        <CriteriaData name= {this.props.name}
        data = {this.props.data}
        type= {this.props.type}
        onChange= {this.props.onChange}
        change={this.props.change}
        />
      </div>
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
    let data, type
    if (this.props.type === "date"){
      data= this.props.data
      type= "date"
    } else if (this.props.type === "time"){
      data= this.props.data
      type= "time"
    } else if (this.props.type === "duration"){
      data= this.props.data
      type= "text" // does 'duration' existe ? If not, what's the type used on teams
    } else if (this.props.type === "text"){
      data= this.props.data
      type= "text"
    } else if (this.props.type === "number"){
      data= this.props.data
      type= "number"
    } else{
      data= this.props.data
      type= this.props.type
    };
    console.log(`${this.props.name} CriteriaData Ok ${data} ${type}`);
    return (
        <input
          type= {type}
          value= {data}
          onChange= {this.handleDataChange}
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

export {Form, HomepageScreen};

console.log("front_end.js")
