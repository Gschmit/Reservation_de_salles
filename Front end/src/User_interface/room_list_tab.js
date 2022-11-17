import React from 'react';

class TabRoomList extends React.Component {
    render(){
        let roomList = []
        for (const roomId in this.props.roomList) {
            roomList.push(this.props.roomList[roomId])
        };
        return(
                <div className="tab">
                    {roomList.map(roomItem => (
                        <RoomFromTab key={roomItem.id}
                            room={roomItem}
                            isActive={roomItem.id === this.props.activeTab}
                            onChange={this.props.onChange}
                        />  
                    ))}
                </div>
        );
    };
};


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
                <button className="tablinks" onClick={() => this.props.onChange(this.props.room.id, this.props.isActive)}>
                    {this.props.room.name} ({this.props.room.capacity} places) {active}
                </button>
                {videoConference} 
                <br/>
            </div>
            // à positionner correctement (faire un Tableau serait peut-etre judicieux !)

        )
    }
};

export default TabRoomList;
