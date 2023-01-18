import React from 'react';
import { Children, cloneElement } from 'react';
import './global.css';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import '../../node_modules/react-big-calendar/lib/css/react-big-calendar.css'
import moment from "moment"; 

const localizer = momentLocalizer(moment)

const messages = { // make it a function to be depending on the language of the navigator
    allDay: "journée",
    previous: "précédent",
    next: "suivant",
    today: "aujourd'hui",
    month: "mois",
    week: "semaine",
    work_week: "semaine de travail",
    day: "jour",
    agenda: "Agenda",
    date: "date",
    time: "heure",
    event: "événement",
    showMore: total => `+ ${total} événement(s) supplémentaire(s)`
  }

function languageFormated(language){
    if (language.includes("-")){
        return language.slice(0, language.indexOf("-"))
    } else {
        return language
    }
};

require(`moment/locale/${languageFormated(window.navigator.language)}`)

function meetingsToEventsForRooms(meetingList){
    let events = []
        meetingList.forEach(element => {
            let startDate = new Date(element.start_timestamps);
            // To see the time difference
            // console.log("meetingsToEventsForRooms, ligne 40, calendar.js", startDate, element.start_timestamps)
            events.push({start : startDate, end : new Date(startDate.getTime() + element.duration * 30 * 60 * 1000),
                title: element.username,
                meetingId: element.id,
            });
        });
    return events
}

class MyCalendar extends React.Component{
    /*constructor(props){
        super(props)
        this.state = {
            today: new Date(),
            activeDate: "activeDate" in this.props ? this.props.activeDate : new Date(),
            meetings: "meetings" in this.props ? this.props.meetings : [],
        }
    } */

    render(){
        let events = meetingsToEventsForRooms(this.props.eventsList)
        let displayTime = new Date()
        displayTime.setHours(7)
        return( //Views ('month'|'week'|'work_week'|'day'|'agenda')
            <div>
                <Calendar
                    longPressThreshold={1}     // for handling mobile touch, see below for more info
                    localizer={localizer}
                    culture={window.navigator.language}
                    views={["day", "work_week", "week"]}
                    defaultView={"work_week"}
                    messages={messages}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    scrollToTime={displayTime}
                    style={{ height: this.props.height, width: this.props.width}}
                    selectable={true} // modifiable ? doit être à true pour 'onSelectSlot' et 'onSelecting'
                    onSelectSlot={this.props.onSelectSlot}
                    onSelectEvent= {this.props.onSelectEvent}  // cette props n'existe nulle part, doit elle rester 
                    // une props, ou est-ce qu'on fait une unique fonction, dont les attributs sont des props/state ?
                />
            </div>
        )
    }
};
/* From the React-Big-Calendar documentation:

longPressThreshold Specifies the number of milliseconds the user must press and hold on the screen for a 
touch to be considered a "long press." Long presses are used for time slot selection on touch devices.

type: number default: 250
*/

export {MyCalendar, meetingsToEventsForRooms};
