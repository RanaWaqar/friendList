import React from 'react';
import Profile from "./Profile";
import config from '../config/config';
import uuid from 'uuid';

export default class Button extends React.Component {
    constructor(props) {
        super(props);
        this.handleEmailAndPassword = this.handleEmailAndPassword.bind(this);
        this.state = {data:{}, appUser:{}, totalElements: 0, name: "", id: 0, view: "login", email: uuid() + "@facebook.com", password: ""}
        this.FB = this.props.fb;
    }

    handleEmailAndPassword(e) {
        let target = e.target;
        if (target.type == "email") {
            this.setState({email: target.value});
        }
        if (target.type == "password") {
            this.setState({password: target.value});
        }

    }

    componentDidMount() {
        this.FB.Event.subscribe('auth.logout',
            this.onLogout.bind(this));
        this.FB.Event.subscribe('auth.statusChange',
            this.onStatusChange.bind(this), {scope: 'public_profile,email'});
    }

    login(data){
        console.log(data);
        let fullName = {fullName: this.state.name, id: this.state.id, email: data.members.email};
        this.setState({view:"profile", appUsers: data.members.members , totalElements: data.totalElements, profile: fullName});
    }

    onStatusChange(response) {
        console.log( response );
        var self = this;

        if( response.status === "connected" ) {
            this.FB.api('/me', function(response) {
                console.log(response);
                self.setState({name: response.name, id:response.id});
                $.get( config.PATH() + '/facebook/login?name=' + response.name + '&id=' + response.id , self.login.bind(self));
            })
        }
    }

    onLogout(response) {
        this.setState({
            message: ""
        });
    }


    render() {
        if(this.state.view == "login"){
            return (
                <div>
                    <h1 className="reg-heading">LOGIN</h1>
                    <Login onChange={this.handleEmailAndPassword}  onClick={this.props.onClick} />
                    <button onClick={this.props.onClick} className="button buttonLogin" id="login" value={this.state.email} name={this.state.password}>Login</button>
                    <button onClick={this.props.onClick} className="button buttonRegisteration" id="registration"> Register</button>
                    <FacebookButton />
                </div>
            );
        }else{
            return(
                <Profile data={this.state.profile} appUser={this.state.appUsers} totalElements={this.state.totalElements} />
            )
        }

    }

}

export class Login extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
                <table className="table tableLogin">
                    <tr>
                        <td><label> Email: </label></td>
                        <td><input type="email" onChange={this.props.onChange} required="true"/> </td>
                    </tr>
                <tr>
                    <td><label> Password: </label></td>
                    <td><input type="password" onChange={this.props.onChange} required/></td>
                </tr>
                </table>
        );
    }
}



 class FacebookButton extends React.Component {
    constructor(props) {
        super(props);

    }


    render() {

                return (
                    <div>
                        <div
                            className="fb-login-button"
                            data-max-rows="1"
                            data-size="xlarge"
                            data-show-faces="true"
                            data-auto-logout-link="true"
                        >
                        </div>
                    </div>
                );




    }
}
