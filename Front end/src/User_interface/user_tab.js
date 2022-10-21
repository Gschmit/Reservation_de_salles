import React from 'react';
import {Form} from '../Global/Reservation_form';
import axios from 'axios';


function funcTest(){
    // axios.get("http://127.0.0.1:8000/booking_meeting_room/meeting_list")
    axios.get("http://127.0.0.1:8000/booking_meeting_room/room/2")
    .then(res=> {
        const data = res.data;
        console.log({data});
        console.log(data);
    })

}

class TabUser extends React.Component{
    render(){
        let tabDisplay
        if (this.props.typeDisplay === "form"){
            tabDisplay = <Form criteria={this.props.criteria} name={this.props.name} buttons={this.props.buttons}/>
        } else if (this.props.typeDisplay === "homepage"){
            tabDisplay = <UserHomepage nextMeeting={this.props.nextMeeting}/>
        } else if (this.props.typeDisplay === "user calendar"){
            tabDisplay = <UserCalendar userName={this.props.user}/>
        } else if (this.props.typeDisplay === "room calendar"){
            tabDisplay = <RoomCalendar roomName={this.props.room}/>
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
            <div className='center'>
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
                <NextMeeting nextMeeting={this.props.nextMeeting}/>
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
            <p>{this.props.nextMeeting}</p>
        )
    }
};

class UserCalendar extends React.Component{
    render(){
        return(
            <p>Calendrier de <strong>{this.props.userName}</strong></p>
        )
    }
};

class RoomCalendar extends React.Component{
    render(){
        return(
            <p>Calendrier de la salle <strong>{this.props.roomName}</strong></p>
        )
    }
};

export {TabUser}
