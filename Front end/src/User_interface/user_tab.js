import React from 'react';
import {Form} from '../Global/Reservation_form';
import axios from 'axios';


async function funcTest(root){
    const req = axios.get('http://127.0.0.1:8000/booking_meeting_room/new_meeting');
    const res = await req;
    //console.log(res.data);
    axios.get("http://127.0.0.1:8000/booking_meeting_room/meeting_list")
    .then(res=> {
        const configName = res.config;
        const data = res.data;
        const headers = res.headers.getContentType();
        const request = res.request.response;
        const status = res.status;
        const statusText = res.statusText;
        //console.log({"configName" : typeof configName, "data" : typeof data, "headers" : typeof headers, 
        //    "request" : typeof request, "status" : typeof status, "statusText" : typeof statusText     
        // });
        console.log({configName, data, headers, request, status, statusText});
        // root.render();
        console.log(headers)
    })

}

class TabUser extends React.Component{
    render(){
        let tabDisplay
        if (this.props.typeDisplay === "form"){
            tabDisplay = <Form criteria={this.props.criteria} name={this.props.name} buttons={this.props.buttons}/>
        } else if (this.props.typeDisplay === "homepage"){
            tabDisplay = <UserHomepage nextMeeting={this.props.nextMeeting} root={this.root}/>
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
                        arguments={this.root}
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
