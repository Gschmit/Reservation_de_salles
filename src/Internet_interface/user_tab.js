import React from 'react';
import {Form} from '../Global/Reservation_form';

class TabUser extends React.Component{
    render(){
        let tabDisplay
        if (this.props.typeDisplay === "form"){
            tabDisplay = <Form criteria={this.props.criteria} name={this.props.name} buttons={this.props.buttons}/>
        } else if (this.props.typeDisplay === "homepage"){
            tabDisplay = <UserHomepage nextMeeting={this.props.nextMeeting}/>
        } else if (this.props.typeDisplay === "calendar"){
            tabDisplay = <UserCalendar userName={this.props.user}/>
        } else {
            tabDisplay = <p> Aucun affichage particulier n'a été spécifié </p>
        }

        return(tabDisplay)
    }
};

class UserHomepage extends React.Component{
    functionForTest(functionArguments){
        alert(`Fonction de rappel du bouton ${functionArguments} déclenchée`)
    }

    render(){
        return(
            <span>
                <BookingButtons 
                    name="Réserver une salle" 
                    callBackFunction={this.functionForTest} 
                    arguments="Réserver"
                />
                <BookingButtons 
                    name="Modifier / Annuler  une réunion" 
                    callBackFunction={this.functionForTest} 
                    arguments="Modifier/annuler"
                />
                <br/>
                <NextMeeting nextMeeting={this.props.nextMeeting}/>
            </span>
        )
       
    }
};

class BookingButtons extends React.Component{
    render(){
        return(
            React.createElement(
                'button',
                { onClick: () => { this.props.callBackFunction(this.props.arguments); }},
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
            <p>Calendrier de {this.props.userName}</p>
        )
    }
};

export {TabUser}