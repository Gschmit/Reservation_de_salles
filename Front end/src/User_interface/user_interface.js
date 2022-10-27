import React from 'react';
import {TabRoomSelected} from './room_asset_tab';
import {TabRoomList} from './room_list_tab';
import {TabUser} from './user_tab'
import './user_interface.css';
// import axios from 'axios';


class BookingRoomTool extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            activeRoomInList: "activeTab" in this.props ? this.props.activeTab : NaN,
            userDisplay: "userDisplay" in this.props ? this.props.userDisplay : null,
            roomList: [],
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

    componentDidMount(){
          /* axios.get("http://127.0.0.1:8000/booking_meeting_room/room_list") // éventuellement rajouter un '/' à la fin
          .then(res => {
            this.setState({roomList : JSON.parse(res.data.à_voir)})
          }); */ // la liste des salles, peut être triée d'une certaine manière ?
        };

    render(){
        let roomSelected, nameRoomSelected//, userId, nextMeeting
        if (isNaN(this.state.activeRoomInList)){
            roomSelected = <></>
            nameRoomSelected = ""
        } else {
            roomSelected = <td className="right"> 
            <TabRoomSelected assets={this.props.assets} picture={this.props.picture} room={this.state.activeRoomInList}/>
            </td> // this.props.picture à remplacer par this.state.roomList[this.state.activeRoomInList]
            nameRoomSelected = this.props.roomList[this.state.activeRoomInList] // remplacer props.roomList par 
        // state.roomList
        };
        /* let promiseUser = axios.get("http://127.0.0.1:8000/booking_meeting_room/user/2/")
        userId = promiseUser.then(res=> {
            const data = JSON.parse(res.data.user).id
            return(data)
        });
        // console.log(userId)
        // console.log(typeof userId)
        let promiseMeeting = axios.get("http://127.0.0.1:8000/booking_meeting_room/meeting_list")
        promiseMeeting.then(res=> {
            const data = res.data
            Object.keys(data).forEach(function(key) {
                let a = JSON.parse(res.data[key])
                console.log(a.start_timestamps)
                console.log(typeof a.start_timestamps)
            });

        }); */
        // Here, we just want to access to the next meeting of the user --> create a python view to do this
        
        return( // remplacer props.roomList par state.roomList
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
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    };
};

export {BookingRoomTool};
