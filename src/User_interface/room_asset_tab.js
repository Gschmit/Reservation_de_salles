import React from 'react';
import './room_asset_tab.css';

class TabRoomSelected extends React.Component {  // Il faudra ajouter/ajuster les props à renseigner
    render(){
        return(
            <div>
                <RoomSelectedPicture picture={this.props.picture}/>
                <hr/>
                <RoomSelectedData assets={this.props.assets}/>
            </div>
        )
    }
}

class RoomSelectedPicture extends React.Component {  // la prop alt dans le render devra être modifier quand l'image fonctionnera
    render(){
        return(
            <div>
                <img src={this.props.picture} alt={`l'affichage ne fonctionne pas ${this.props.picture}`}></img>
            </div>
        )
    }
}

class RoomSelectedData extends React.Component {
    render(){
        return(
            <div>
                <p> <strong>Quelques informations sur la salle :</strong> </p>
                <br/>
                <RoomSelectedAssetsList assets={this.props.assets}/>
            </div>
        )
    }
}

class RoomSelectedAssetsList extends React.Component {
    render(){
        return(
            <ul>
                {this.props.assets.map(
                    (arrayItem, index) => 
                    <li key={index} value={arrayItem}>{arrayItem}</li>
                )}
            </ul>
        )
    }
}

export {TabRoomSelected}