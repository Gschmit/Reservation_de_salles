import React from 'react';
import axios from 'axios';
import {url} from '../Global/Reservation_form';
import {TabRoomSelected} from './room_asset_tab';
import {TabRoomList} from './room_list_tab';
import {TabUser} from './user_tab'
import './user_interface.css';

function assetsList(aRoom){
    let out = [[], null] 
    out[1] = aRoom.computer ? out[0].push("computer") : null
    out[1] += aRoom.paperboard ? out[0].push("paperboard") : null
    out[1] += aRoom.projector ? out[0].push("projector") : null
    out[1] += aRoom.television_screen ? out[0].push("television screen") : null
    out[1] += aRoom.videoconference ? out[0].push("videoconference") : null
    out[1] += aRoom.wall_whiteboard ? out[0].push("wall whiteboard") : null
    out[1] += aRoom.whiteboard ? out[0].push("whiteboard") : null
    return out[0]       // the second element is just to make the code working, without creating a useless variable
    };


class BookingRoomTool extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            activeRoomInList: "activeTab" in this.props ? this.props.activeTab : NaN,
            userDisplay: "userDisplay" in this.props ? this.props.userDisplay : null,
            roomList: [],
            user: 0,
            nextMeeting: "",
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

    componentDidMount(){ // on fait 3 appel "get" successif ... ne peut on pas optimiser cela en un seul ?
        axios.get(url + "room_list")
        .then(res => {
            let rooms = []
            for (const room in res.data) {
                rooms.push(JSON.parse(res.data[room]))
            };
            this.setState({roomList : rooms})
        });  // la liste des salles, peut être triée d'une certaine manière ?
        axios.get(url + `user/${this.props.user}/`)
        .then(res => {
            let user = JSON.parse(res.data["user"]) 
            this.setState({user : user})
        });
        axios.get(url + `user_next_meeting/${this.props.user}`)
            .then(res => {
                this.setState({nextMeeting : res.data});
            }); 
    };
    // this component have a 'previousPage' props !
    render(){
        let roomSelected, nameRoomSelected
        if (isNaN(this.state.activeRoomInList)){
            roomSelected = <></>
            nameRoomSelected = ""
        } else {
            let picture = typeof this.state.roomList[this.state.activeRoomInList] != "undefined" ? this.state.roomList[this.state.activeRoomInList].picture : null
            let name = typeof this.state.roomList[this.state.activeRoomInList] != "undefined" ? this.state.roomList[this.state.activeRoomInList].name : "name"
            let assets = []
            if (typeof this.state.roomList[this.state.activeRoomInList] != "undefined"){
                assets = assetsList(this.state.roomList[this.state.activeRoomInList])
            }
            roomSelected = <td className="right"> 
                <TabRoomSelected assets={assets} picture={picture} room={this.state.activeRoomInList}/>
            </td> 
            nameRoomSelected = name
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
        
        return(
            <table>
                <tbody>
                    <tr>
                        <td className="right">
                            <TabRoomList roomList={this.state.roomList} 
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
                                nextMeeting={this.state.nextMeeting}
                                user={this.state.user}
                                userName={this.props.userName}
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
