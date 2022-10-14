import React from 'react';
import {TabRoomSelected} from './room_asset_tab';
import {TabRoomList} from './room_list_tab';
import {TabUser} from './user_tab'

class BookingRoomTool extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            activeRoomInList: "activeTab" in this.props ? this.props.activeTab : NaN,
            // isActiveRoomSelected: "isActiveRoomSelected" in this.props ? this.props.isActiveRoomSelected : false,
            userDisplay: "userDisplay" in this.props ? this.props.userDisplay : null,
        }
        this.handleChangeActiveRoomInList = this.handleChangeActiveRoomInList.bind(this);
        // this.handleChangeIsActiveRoomSelected = this.handleChangeIsActiveRoomSelected.bind(this);
        this.handleChangeUserDisplay = this.handleChangeUserDisplay.bind(this);
    }

    handleChangeActiveRoomInList(newRoomActive){
        this.setState({activeRoomInList: newRoomActive})
    }

    /*handleChangeIsActiveRoomSelected(newActiveRule){
        this.setState({isActiveRoomSelected: newActiveRule})
    }*/

    handleChangeUserDisplay(newUserDisplay){
        this.setState({userDisplay: newUserDisplay})
    }

    render(){
        let roomSelected
        if (isNaN(this.state.activeRoomInList)){
            roomSelected = <></>
        } else {
            roomSelected = <td> 
            <TabRoomSelected assets={this.props.assets} picture={this.props.picture} room={this.state.activeRoomInList}/>
        </td>
        }
        // console.log(this.state.isActiveRoomSelected, this.state.activeRoomInList)
        return(
            <table border={1}>
                <tbody>
                    <tr>
                        <td>
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
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    };
};

export {BookingRoomTool};
