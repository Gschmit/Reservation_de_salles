import React from 'react';
import {TabRoomSelected} from './room_asset_tab';
import {TabRoomList} from './room_list_tab';
import {TabUser} from './user_tab'
import './user_interface.css'

class BookingRoomTool extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            activeRoomInList: "activeTab" in this.props ? this.props.activeTab : NaN,
            userDisplay: "userDisplay" in this.props ? this.props.userDisplay : null,
        }
        this.handleChangeActiveRoomInList = this.handleChangeActiveRoomInList.bind(this);
        this.handleChangeUserDisplay = this.handleChangeUserDisplay.bind(this);
    }

    handleChangeActiveRoomInList(newRoomActive){
        this.setState({activeRoomInList: newRoomActive})
    }

    handleChangeUserDisplay(newUserDisplay){
        this.setState({userDisplay: newUserDisplay})
    }

    render(){
        let roomSelected, nameRoomSelected
        if (isNaN(this.state.activeRoomInList)){
            roomSelected = <></>
            nameRoomSelected = ""
        } else {
            roomSelected = <td className="right"> 
            <TabRoomSelected assets={this.props.assets} picture={this.props.picture} room={this.state.activeRoomInList}/>
        </td>
            nameRoomSelected = this.props.roomList[this.state.activeRoomInList]
        }
        return(
            <table>
                <tbody>
                    <tr>
                        <td className="right">
                            <TabRoomList roomList={this.props.roomList} 
                                activeTab={this.state.activeRoomInList} 
                                onChange={this.handleChangeActiveRoomInList}
                            />
                        </td>
                        {roomSelected}
                        <td>
                            <TabUser typeDisplay={this.state.userDisplay}
                                criteria={this.props.criteria} 
                                name={this.props.name} 
                                buttons={this.props.buttons}
                                nextMeeting={this.props.nextMeeting}
                                user={this.props.user}
                                room={nameRoomSelected}
                                root={this.root}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    };
};

export {BookingRoomTool};
