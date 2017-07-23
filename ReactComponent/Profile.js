import React from 'react';
import config from '../config/config';

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {view: "appUser",friendsList:{}, pageNumber: 1, totalElements: 0, members:[]}
    }
    componentWillMount(){
        this.setState({totalElements: this.props.totalElements, members: this.props.appUser, friendsList: this.props.data.friends});
    }
    handlePagination(e) {
        this.setState({pageNumber: e.target.id});
        $.get( config.PATH() + '/appuser?pageNumber=' + e.target.id, this.detailUserSuccess.bind(this));
    }
    detailUserSuccess(data){
        this.setState({totalElements: data.totalElements, members: data.members, view:'appUser'});
    }
    handleUsers(e){
        let body= {
            userEmail: this.props.data.email != null ? this.props.data.email : "dumy@facebook.com",
            userName: this.props.data.fullName != null ? this.props.data.fullName: "",
            friendEmail: e.target.id != "" ? e.target.id : "dumy@facebook.com",
            friendName: e.target.name,
            pageNumber: this.state.pageNumber
        }
     $.post( config.PATH() + '/update/friendList' ,body, this.successAppUsers.bind(this));
    }

    successAppUsers(data){
        this.setState({members: data});
    }

    appUser(){
        $.get( config.PATH() + '/appuser?pageNumber=1&&email=' + this.props.data.email, this.detailUserSuccess.bind(this));
    }

    updateFriend(data) {
        this.setState({friendsList: data.friends, view: "friends"});
    }
    getFriendList(){
        let email = this.props.data.email != null ? this.props.data.email : "";
        $.get(config.PATH() + '/single/friendList?email=' + email, this.updateFriend.bind(this) );
    }
    render() {
     if (this.state.view === "appUser") {
            return (
                <div>
                    <div id="profileHead">
                        <h2>WELCOME {this.props.data.fullName}</h2>
                    </div>
                    <div id="profileFriends" onClick={this.appUser.bind(this)}><h3>App Users(click me to see users)</h3></div>
                    <div id="profileAppUsers" onClick={this.getFriendList.bind(this)}><h3>Friends (click me to see friends)</h3></div>
                    <ApplicationUser applicationUser={this.state.members} onClick={this.handleUsers.bind(this)}/>
                    <Pagination pages={this.state.totalElements} onClick={this.handlePagination.bind(this)} />
                </div>
            );
        }else if(this.state.view === "friends"){
         return (
             <div>
                 <div id="profileHead">
                     <h2>WELCOME {this.props.data.fullName}</h2>
                 </div>
                 <div id="profileFriends" onClick={this.appUser.bind(this)}><h3>App Users(click me to see users)</h3></div>
                 <div id="profileAppUsers" onClick={this.getFriendList.bind(this)}><h3>Friends(click me to see friends)</h3></div>
                 <FriendList friendList={this.state.friendsList}/>
             </div>
         );
     }

    }

}

export class FriendList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div id="fl">
                {this.props.friendList.map((value, index) => {
                    return (
                        <div className="tab">{value}</div>
                    )
                })}
        </div>
        );
    }
}

export class ApplicationUser extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {


        let element = this.props.applicationUser.map((value, index) => {
            return (
                <div className="tab">
                    {value.fullName}
                    <button id={value.email} name={value.fullName} className="addFriend" onClick={this.props.onClick}>Add Friend</button>
                </div>
            )

        });

        return (
            <div>
                {element}
            </div>
        )

    }
}

class Pagination extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let pages = Math.floor(this.props.pages / 10);
        console.log(pages);

        function pagination() {
            let html = [];
            for (let i = 0; i < pages; i++) {
                html.push(i);
            }
            return html;
        }

        let html = pagination();
        return (

            <div className="pagination">
                {html.map((value, index) => {
                    return (<a href="#" id={index + 1} onClick={this.props.onClick}>{index + 1}</a>);
                })}
            </div>
        )
    }

}
