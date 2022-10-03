/* Homepage on room's tablet */

import React from 'react';

class HomepageScreen extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
      return(
        <div>
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
