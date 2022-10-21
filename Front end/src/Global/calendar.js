import React from 'react';
import './global.css';

import { Calendar, globalizeLocalizer } from 'react-big-calendar';
// import '../../node_modules/react-big-calendar/lib/sass/styles';
import '../../node_modules/react-big-calendar/lib/css/react-big-calendar.css'
import globalize from 'globalize';

const localizer = globalizeLocalizer(globalize)

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
        return(
            <div>
                <Calendar
                localizer={localizer}
                events={this.props.eventsList}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                />
            </div>
        )
    }
};

export default MyCalendar;
