/* Homepage on room's tablet */

import React from 'react';

class HomepageScreen extends React.Component{
    render(){
      return(
        <div>
            <h1> Homepage </h1> <br/>
            <HomepageRoomNameDisplay roomName={this.props.name} /> <br/>
            <HomepageRoomCalendar roomName={this.props.name} />
        </div>
      )
    };
  };
  
  class HomepageRoomNameDisplay extends React.Component{
    render(){
      return(this.props.roomName)
    };
  };
  
  class HomepageRoomCalendar extends React.Component{
    render(){
      return(`Calendar of ${this.props.roomName}`)
    };
  };

export {HomepageScreen};
