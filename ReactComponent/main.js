import React from 'react';
import ReactDOM from 'react-dom';
import Button from "./LoginForm";
import config from "../config/config";
import Registration from "./Registration";
import Error from './error';
import Profile from './Profile';

class Message extends React.Component {
    constructor(){
        super();
        this.state = {email: "your Email",appUsers:{}, profile:{},totalElements:0, registerSuccess: {},password: "your Password", firstName:"" ,lastName:"", password:"" , confirmPass:"",view: "login", error: {}};
        this.handle = this.handle.bind(this);
        this.setError = this.setError.bind(this);
        this.user = {};
    }
    setError(){
        this.setState({error: {}});
        this.setState({registerSuccess: {}});

    }

    handle(e) {
        if (e.target.id == "login") {
            let email = e.target.value;
            let password = e.target.name;
            if (email !== "" && password !== "") {
                this.setState({email: email, password: password});
                $.post(config.PATH() + '/login', {email: email, password: password}, this.success.bind(this));
            } else {
                this.setState({error: {message: "please fill the form"}});
                setTimeout(this.setError, 1000);
            }
        } else if (e.target.id == "registration") {
            this.setState({view: "registration"});
        }

    }

    registeration(e) {
        let target = e.target;
        if (target.id == "registerEmail") {
            this.setState({email: target.value});
        }
        if (target.id == "registerFirstName") {
            this.setState({firstName: target.value});
        }
        if (target.id == "registerLastName") {
            this.setState({lastName: target.value});
        }
        if (target.id == "registerPassword") {
            this.setState({password: target.value});
        }
        if (target.id == "registerConfirmPassword") {
            this.setState({confirmPass: target.value});
        }
    }

    register(e){
        if(e.target.id === "registerSubmit"){
            if(this.state.password === this.state.confirmPass){
                let body = {
                    email: this.state.email,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    password: this.state.password,
                    socialMediaConnect: "",
                    friends: []
                }
                $.post( config.PATH() + '/signup', body, this.success.bind(this));
            }else{
                this.setState({error:{message: "please confirm your password"} });
                setTimeout(this.setError, 1000);
            }
        }
    }

    success(data){
        if(data.httpCode === 400){
            this.setState({error: data});
            setTimeout(this.setError, 1000);
        }else if(this.state.view === "registration"){
        this.setState({registerSuccess: data});
            setTimeout(this.setError, 1000);
        }else if(this.state.view === 'login'){
            $.get( config.PATH() + '/appuser?pageNumber=1&&email='+this.state.email, this.detailUserSuccess.bind(this));
            this.user = data;
        }
    }

    detailUserSuccess(data){
        if(data.httpCode === 400){
            this.setState({error: data});
            setTimeout(this.setError, 1000);
        }else if(this.state.view === 'login'){
            this.setState({view:"profile", appUsers: data.members , totalElements: data.totalElements, profile: this.user});
        }
    }

    render(){
        console.log(this.state);
    if(this.state.view == 'login' && Object.keys(this.state.error).length > 0){
        return(
            <div>
                <Button onClick={this.handle} fb={FB} />
                <Error error={this.state.error.message} id="error"/>
            </div>
        );
    }else if(this.state.view == 'registration' &&  Object.keys(this.state.error).length > 0 ) {
        return (
            <div>
            <Registration onChange={this.registeration.bind(this)} onClick={this.register.bind(this)}/>
            <Error error={this.state.error.message} id="error" />
            </div>
        )

    }else if(this.state.view == 'registration' && Object.keys(this.state.registerSuccess).length > 0) {
        return (
            <div>
            <Registration onChange={this.registeration.bind(this)} onClick={this.register.bind(this)}/>
            <Error error={this.state.registerSuccess.message} id="success"/>
            </div>
        )
    }else if(this.state.view == 'login'){
        return(
                <div><Button onClick={this.handle} fb={FB} />
                </div>
        );

    }else if(this.state.view == 'registration') {
            return (<Registration onChange={this.registeration.bind(this)} onClick={this.register.bind(this)}/>);
        }else if(this.state.view === 'profile'){
        return(<Profile data={this.state.profile} appUser={this.state.appUsers} totalElements={this.state.totalElements} />);
    }

    }

}

ReactDOM.render(
    <Message />,
    document.getElementById('root')
);