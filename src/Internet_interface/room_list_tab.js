import React from 'react';

class TabRoomList extends React.Component {
    render(){
        return(
            <div>
                {this.props.roomList.map(
                    (roomItem, index) => 
                    <RoomFromTab key={index} 
                        roomName={roomItem} 
                        isActive={index === this.props.activeTab}
                    />
                )}
            </div>
        )   // peut-on accèder aux attributs des objets de la BDD de Django ?
    }
};

class RoomFromTab extends React.Component {
    render(){
        let active, videoConference
        if (this.props.isActive){
            // mis en bleu sur la maquette --> surtout un code (une classe par exemple) pour le CSS ?
            active = `${this.props.roomName} is active`
        } else {
            // on laisse normal
            active = `${this.props.roomName} is not active`
        }
        if (this.props.videoConference){
            videoConference = <p>image pour la visio</p>
        } else {
            videoConference = <p> Non actif </p>
        }
        // <p>{this.props.roomName}</p>
        return(
            <div>
                <p>{active}</p>
                {videoConference}
                
                <br/>
            </div>
        )
    }
};

export {TabRoomList}
