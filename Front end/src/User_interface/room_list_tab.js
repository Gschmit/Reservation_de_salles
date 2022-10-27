import React from 'react';

class TabRoomList extends React.Component {
    render(){ // roomName={roomItem} à remplacer par room={roomItem}
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
        )   // peut-on accèder aux attributs des objets de la BDD de Django ? // Ouiiiiii !
    }
};

class RoomFromTab extends React.Component {
    render(){
        let active, videoConference // videoConference est un attribut de la props room
        if (this.props.isActive){
            // mis en bleu sur la maquette --> surtout un code (une classe par exemple) pour le CSS ?
            active = `${this.props.roomName} is active`
        } else {
            // on laisse normal
            active = `${this.props.roomName} is not active`
        }
        if (this.props.videoConference /* this.props.room.videoConference */){ //(le nom est peut-être différent)
            videoConference = <p>image pour la visio</p> // créer un widget/image/photo pour ça 
        } else {
            videoConference = <p> Non actif </p> // <></>
        }
        return( 
            /*
            <div>
                <p>{this.room.name}</p>
                {videoConference} // à positionner correctement (faire un Tableau serait peut-etre judicieux !)
                <br/>
            </div>
            */
            <div>
                <p>{active}</p>
                {videoConference}
                <br/>
            </div>
        )
    }
};

export {TabRoomList}
