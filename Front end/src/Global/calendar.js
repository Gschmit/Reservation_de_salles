import React from 'react';
import './global.css';

import { Calendar, globalizeLocalizer } from 'react-big-calendar'
import globalize from 'globalize'

const localizer = globalizeLocalizer(globalize)

const MyCalendar = props => (
  <div>
    <Calendar
      localizer={localizer}
      events={props.eventsList}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    />
  </div>
)

/*
class Calendar extends React.Component{
    constructor(props){
        super(props)
        state={
            today: new Date(),
            activeDate: "activeDate" in this.props ? this.props.activeDate : new Date(),
            meetings: "meetings" in this.props ? this.props.meetings : [],
        }
    }
    render()
} */

export default MyCalendar

