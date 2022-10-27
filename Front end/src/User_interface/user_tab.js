import React from 'react';
import {Form} from '../Global/Reservation_form';
import axios from 'axios';
import MyCalendar from '../Global/calendar';


function funcTest(){
    //axios.get("http://127.0.0.1:8000/booking_meeting_room/room/2/2022_9_28_14_45")
    axios.post("http://127.0.0.1:8000/booking_meeting_room/room/2/", {year: 2022, month:9, day: 28, hour: 14,
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
            <p>
                TO DO : <br/>
                - mettre le fichier test de django à jour suite au "post" mis en places <span style={{color:"limegreen"}}>done</span> <br/>
                - supprimer le "get" inutile que l'on vient de remplacer ainsi <span style={{color:"limegreen"}}>done</span> <br/> 
                - dans le front, définir toutes les fonctions (args et responses) dont on va avoir besoin <br/>
                - dans le back : <br/>
                -- créer les tests pour nos fonctions <br/>
                -- créer les fonctions adéquats, passant tous les tests <br/>
                - remplacer dans le front les fonctions voulues par leur response <br/>
                - vérifier que ça fonctionne comme voulue <br/>
                - le CSS
                {this.props.nextMeeting}
            </p>
        )
    }
};

class UserCalendar extends React.Component{
    render(){
        return(
            <MyCalendar eventslist={[]} height={500} width={700}/>
        )
    }
};

class RoomCalendar extends React.Component{
    render(){
        return(
            <MyCalendar eventslist={[]} height={500} width={700}/>
        )
    }
};

export {TabUser}
