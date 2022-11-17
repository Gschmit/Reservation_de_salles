import React from 'react';
import axios from 'axios';
import {UserForm, url} from '../Global/Reservation_form';
import {MyCalendar, meetingsToEventsForRooms} from '../Global/calendar';


function funcTest(){
    //axios.get("http://127.0.0.1:8000/booking_meeting_room/room/2/2022_9_28_14_45")
    axios.post(url + "room/2/", {year: 2022, month:9, day: 28, hour: 14,
        minute: 45})
    .then(res=> {
        const data = res.data
        /* document.getElementById("user homepage").innerHTML = null
        Object.keys(data).forEach(function(key) {
            let a = JSON.parse(res.data[key])
            document.getElementById("user homepage").innerHTML += a.title
            document.getElementById("user homepage").innerHTML += "\n \t"
            console.log(key)
            Object.keys(a).forEach(function(key2){
                console.log(key2, a[key2])
            });
        }); */
        console.log(data)
        console.log(new Date(data.date))
    })
}

class TabUser extends React.Component{
    render(){
        let tabDisplay
        if (this.props.typeDisplay === "form"){
            tabDisplay = <UserForm criteria={this.props.criteria} name={this.props.user.name} buttons={this.props.buttons}/>
        } else if (this.props.typeDisplay === "homepage"){
            tabDisplay = <UserHomepage nextMeeting={this.props.nextMeeting} user={this.props.user}/>
        } else if (this.props.typeDisplay === "user calendar"){
            tabDisplay = <UserCalendar user={this.props.user}/>
        } else if (this.props.typeDisplay === "room calendar"){
            tabDisplay = <RoomCalendar room={this.props.room}/>
        } else {
            tabDisplay = <p> Aucun affichage particulier n'a été spécifié </p>
        }

        return(tabDisplay)
    }
};

class UserHomepage extends React.Component{
    functionForTest(functionArguments){ // fonction à supprimer et modifier ce qui va avec !
        alert(`Fonction de rappel du bouton ${functionArguments} déclenchée`)
    }

    render(){
        return(
            <div id="user homepage" className='center'>
                <div className='space'>
                    <BookingButtons 
                        name="Réserver une salle" 
                        callBackFunction={this.functionForTest} 
                        arguments="Réserver"
                    />
                    <BookingButtons 
                        name="Modifier / Annuler  une réunion" 
                        callBackFunction={funcTest} 
                        arguments={null}
                    />
                </div>
                <br/>
                <NextMeeting nextMeeting={this.props.nextMeeting} user={this.props.user}/> 
            </div>
        )
       
    }
};

class BookingButtons extends React.Component{
    render(){
        return(
            React.createElement(
                'button',
                { className: "button", onClick: () => { this.props.callBackFunction(this.props.arguments); }},
                this.props.name
            )
        )
    }
};

class NextMeeting extends React.Component{
    render(){
        return(
            <p>
                {this.props.nextMeeting}
            </p>
        )
    }
};

class UserCalendar extends React.Component{
    state = {
        meetings: []
      };

    componentDidMount(){
        /*axios.get(url + `user_meetings/${this.props.user.id}`) // view pas encore faite
        .then(res => {
          let meetingList = []
          for (const meet in res.data){
            meetingList.push(JSON.parse(res.data[meet]))
          };
          this.setState({meetings : meetingList});
        });*/
      };
    
    render(){
        let events = meetingsToEventsForRooms(this.state.meetings)
        return(
            <MyCalendar eventsList={events} height={400} width={500}/>
        )
    }
};

class RoomCalendar extends React.Component{
    state = {
        meetings: []
      };
    
    componentDidMount(){
        /*axios.get(url + `room_meetings/${this.props.room.id}`)
        .then(res => {
          let meetingList = []
          for (const meet in res.data){
            meetingList.push(JSON.parse(res.data[meet]))
          };
          this.setState({meetings : meetingList});
        });*/
      };
    
    render(){
        let events = meetingsToEventsForRooms(this.state.meetings)
        return(
            <MyCalendar eventsList={events} height={400} width={500}/>
        )
    }
};

export default TabUser;
