const element = "Hello, world !";

const domContainer = document.querySelector('#root');

ReactDOM.render(
    element,
    domContainer
  );

/* Homepage on room's tablet */

class HomepageScreen extends React.Component{
  render(){
    return("hello")
  };
};

class HomepageRoomNameDisplay extends React.Component{
  render(){
    return("hello")
  };
};

class HomepageRoomCalendar extends React.Component{
  render(){
    return("hello")
  };
};

homepage = new HomepageScreen()
ReactDOM.render(homepage.render(), document.getElementById("homepage"))

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

  handleDateValueChange(newDate){
    this.setState({
      date: newDate
    });
  };

  handleDurationValueChange(newDuration){
    this.setState({
      duration: newDuration
    });
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
    let informationsBloc = new Informations({
      date: this.state.date,
      onChangeDate: this.handleDateValueChange,
      duration: this.state.duration,
      onChangeDuration: this.handleDurationValueChange,
      nameOfWhoSReserving: this.state.nameOfWhoSReserving,
      onChangeName: this.handleNameReservingTextChange,
      titleMeeting:this.state.titleMeeting,
      onChangeTitle: this.handleTitleMeetingTextChange,
      numberOfPresentPerson:this.state.numberOfPresentPerson,
      onChangePresent: this.handlePresentPersonValueChange,
    }).render();
    let actionButtonBloc = new ActionButton({
      date: this.state.date,
      duration: this.state.duration,
      nameOfWhoSReserving: this.state.nameOfWhoSReserving,
      titleMeeting:this.state.titleMeeting,
      numberOfPresentPerson:this.state.numberOfPresentPerson,
    }).render();
    let out = informationsBloc + " /saut de ligne/ " + actionButtonBloc;
    console.log("Form Ok");
    return(out);
  };
};

class ActionButton extends React.Component {
  render(){
    React.createElement(
      'button',
      { onClick: () => alert("You clicked on 'Validate'") },
      'Validate'
    );
    React.createElement(
      'button',
      { onClick: () => alert("You clicked on 'Cancel'") },
      'Cancel'
    );
    let out = "I'm an ActionButton";
    console.log("ActionButton Ok");
    return(out);
  };
};

class Informations extends React.Component {
  render(){
    let date = new Criteria({
      name: "date", 
      date: `${this.props.date.getDate()}/${this.props.date.getMonth() + 1}/${this.props.date.getFullYear()}`,
      test: true,
    }).render();
    let startTime = new Criteria({
      name: "start time", 
      time: `${this.props.date.getHours()}h${this.props.date.getMinutes()}`,
      test: false,
    }).render();
    let end = new Date(this.props.date.getTime() + this.props.duration * 30 * 60 * 1000)
    let endTime = new Criteria({
      name: "end time",
      time: `${end.getHours()}h${end.getMinutes()}`,
      test: false,
    }).render();
    let duration = new Criteria({name: "duration", duration: this.props.duration}).render();
    let nameWhoReserve = new Criteria({
      name: "name of who is reserving", 
      namePerson: this.props.nameOfWhoSReserving,
      test: false,
    }).render();
    let titleMeeting = new Criteria({
      name: "title of the meeting", 
      title: this.props.titleMeeting,
      test: false,
    }).render();
    let numberPersonPresent = new Criteria({
      name: "number of physically present persons",
      number: this.props.numberOfPresentPerson,
      test: false,
    }).render();
    console.log("Informations Ok");
    let out = date + " /saut de ligne/ " + startTime + " /tabulation/ " + endTime
      + " /saut de ligne/ " + duration + " /saut de ligne/ " + nameWhoReserve + " /saut de ligne/ "
      + titleMeeting + " /saut de ligne/ " + numberPersonPresent;
    return(out);
  };
};

class Criteria extends React.Component {
  render(){
    let name = new CriteriaName({name: this.props.name}).render();
    let data = new CriteriaData({name: this.props.name, test: this.props.test, data: this.props}).render();
    console.log(`${this.props.name} Criteria Ok`);
    let out = name + " /tabulation/ " + data;
    return(out);
  };
};

class CriteriaData extends React.Component {
  render(){
    if (this.props.test){
      document.getElementById("wyn").value = this.props.name + " " + this.props.data.date
      console.log(this.props.name)
    }
    console.log(`${this.props.name} CriteriaData Ok`);
    return(`${this.props.name} CriteriaData Ok`);
    /* return (
      <form>
        <input
          type="text"
          placeholder=""
          value="" />
      </form>
    ); */
  };
};

class CriteriaName extends React.Component {
  render(){
    console.log(`${this.props.name} CriteriaName Ok`);
    return(`I'm the ${this.props.name} CriteriaName`);
  };
};

let tabletForm = new Form();
ReactDOM.render(tabletForm.render(), document.getElementById("essai"));

console.log("front_end.js")
