import React from 'react';
import './global.css';

import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
// import '../../node_modules/react-big-calendar/lib/sass/styles';  // kécécé ?
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
    event: "événement", // Or anything you want
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

function meetingsToEvents(meetingList){
    let events = []
        meetingList.forEach(element => {
            let startDate = new Date(
                element.start_timestamps.year, element.start_timestamps.month - 1,
                element.start_timestamps.day, element.start_timestamps.hour,
                element.start_timestamps.minute
                );
            events.push({start : startDate, end : new Date(startDate.getTime() + element.duration * 30 * 60 * 1000),
                title: element.title
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
        let events = meetingsToEvents(this.props.eventsList)
        return( //Views ('month'|'week'|'work_week'|'day'|'agenda')
            <div>
                <Calendar
                    localizer={localizer}
                    culture={window.navigator.language}
                    views={["work_week", "week", "day"]}
                    defaultView={"work_week"}
                    messages={messages}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
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

export {MyCalendar, meetingsToEvents};
