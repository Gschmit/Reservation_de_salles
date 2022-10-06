import React from 'react';

class TabRoomList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            activeTab: NaN
        }
        this.handleActiveTabChange = this.handleActiveTabChange.bind(this);
    }

    handleActiveTabChange(newActiveTab){
        this.setState({activeTab: newActiveTab})
    }

    render(){
        return(
            <div>
                {this.props.roomList.map(
                    (roomItem, index) => 
                    <RoomFromTab key={index} 
                        roomName={roomItem} 
                        isActive={index === this.state.activeTab}
                    />
                )}
            </div>
        )   // peut-on accèder aux attributs des objets de la BDD de Django ?
    }
}

class RoomFromTab extends React.Component {
    render(){
        let videoConference
        if (this.props.isActive){
            // mis en bleu sur la maquette --> surtout un code (une classe par exemple) pour le CSS ?
            console.log(this.props.roomName + " is active")
        } else {
            // on laisse normal
            console.log(this.props.roomName + " is not active")
        }
        if (this.props.videoConference){
            videoConference = <p>image pour la visio</p>
        } else {
            videoConference = <p> Non actif </p>
        }
        return(
            <div>
                <p>{this.props.roomName}</p>
                {videoConference}
                <br/>
            </div>
        )
    }
}

export {TabRoomList}
