/* Homepage on room's tablet */

import React from 'react';

class HomepageScreen extends React.Component{
    render(){
      return(
        <div>
            <h1> Homepage </h1> <br/>
            <HomepageRoomNameDisplay name={this.props.name} /> <br/>
            <HomepageRoomCalendar/>
        </div>
      )
    };
  };
  
  class HomepageRoomNameDisplay extends React.Component{
    render(){
      return(this.props.name)
    };
  };
  
  class HomepageRoomCalendar extends React.Component{
    render(){
      return("Calendar")
    };
  };

export {HomepageScreen};
