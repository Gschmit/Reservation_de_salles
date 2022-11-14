import React from 'react';

class TabRoomList extends React.Component {
    render(){
        return(
            <div>
                {this.props.roomList.map(
                    (roomItem, index) => 
                    <RoomFromTab key={index} 
                        room={roomItem}
                        isActive={index === this.props.activeTab}
                    />
                )}
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
            <div>
                <p>{this.props.room.name} ({this.props.room.capacity} places) {active}</p>
                {videoConference} 
                <br/>
            </div>
            // à positionner correctement (faire un Tableau serait peut-etre judicieux !)

        )
    }
};

export {TabRoomList}
// export default TabRoomList; // would be better
