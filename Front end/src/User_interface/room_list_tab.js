import React from 'react';

class TabRoomList extends React.Component {
    render(){
        console.log("length", this.props.roomList.length)
        return(
                <div className="tab">
                    {this.props.roomList.map((roomItem, index) => (
                        <RoomFromTab key={roomItem.id}
                            room={roomItem}
                            index={index}
                            isActive={index === this.props.activeTab}
                            onChange={this.props.onChange}
                        />  
                    ))}
                </div>
        );
    };
};

/* // solution 1
<div id="menu-tab">
                <div id="page-wrap">
                    <div className="tabs">
                        {this.props.roomList.map(
                            (roomItem, index) =>
                            <div className="tab"  key={index}>
                                <input id={`tab-${index}`} name="tab-group-1" type="radio" />
                                <label htmlFor={`tab-${index}`} > {roomItem.name} {index} </label>
                                <RoomFromTab 
                                    room={roomItem}
                                    isActive={index === this.props.activeTab}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
*/

/* // solution 2
<div>
  <p>Click on the buttons inside the tabbed menu:</p>
  <div className="tab">
  {this.state.data.map((button, i) => (
    <button key={button.name} className="tablinks" onClick={() => this.handleClick(i)}>{button.name}</button>
    )
    )
  }
  </div>
</div>
*/


class RoomFromTab extends React.Component {
    render(){
        let active, videoConference
        if (this.props.isActive){
            // mis en bleu sur la maquette --> surtout un code (une classe par exemple) pour le CSS ?
            active = "is active"
        } else {
            // on laisse normal
            active = "is not active"
        }
        if (this.props.room.videoconference){
            videoConference = <p>image pour la visio</p> // créer un widget/image/photo pour ça 
        } else {
            videoConference = <p> Non actif </p> // <></>
        }
        return( 
            <div className="content">
                <button className="tablinks" onClick={() => this.props.onChange(this.props.index, this.props.isActive)}>
                    {this.props.room.name} ({this.props.room.capacity} places) {active}
                </button>
                {videoConference} 
                <br/>
            </div>
            // à positionner correctement (faire un Tableau serait peut-etre judicieux !)

        )
    }
};

export {TabRoomList}
// export default TabRoomList; // would be better
