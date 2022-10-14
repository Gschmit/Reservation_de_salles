import React from 'react';
import {Form} from '../Global/Reservation_form';

class TabUser extends React.Component{
    render(){
        let tabDisplay
        if (this.props.typeDisplay === "form"){
            tabDisplay = <Form criteria={this.props.criteria} name={this.props.name} buttons={this.props.buttons}/>
        } else if (this.props.typeDisplay === "homepage"){
            tabDisplay = <UserHomepage nextMeeting={this.props.nextMeeting}/>
        }

        return(tabDisplay)
    }
};

class UserHomepage extends React.Component{
    render(){
        return(
            <span>
                <BookingButtons/>
                <BookingButtons/>
                <br/>
                <NextMeeting nextMeeting={this.props.nextMeeting}/>
            </span>
        )
       
    }
};

class BookingButtons extends React.Component{
    render(){
        return(
            <p>hello button</p>
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


export {TabUser}
