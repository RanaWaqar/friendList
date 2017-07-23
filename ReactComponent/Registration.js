import React from 'react';



export default class Registration extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>
        <h1 className="reg-heading">REGISTRATION</h1>
            <table className="table">
                <tr>
                    <td>Email: </td>
                    <td><input type="email" id ="registerEmail" onChange={this.props.onChange}/></td>
                </tr>
                <tr>
                    <td>FirstName: </td>
                    <td><input type="txt" id ="registerFirstName" onChange={this.props.onChange}/></td>
                </tr>
                <tr>
                    <td>LastName: </td>
                    <td><input type="txt" id ="registerLastName" onChange={this.props.onChange}/></td>
                </tr>
                <tr>
                    <td>Password: </td>
                    <td><input type="password" id ="registerPassword" onChange={this.props.onChange}/></td>
                </tr>
                <tr>
                    <td>Confirm Password: </td>
                    <td><input type="password" id ="registerConfirmPassword" onChange={this.props.onChange} /></td>
                </tr>
                <tr>
                    <td></td>
                    <td><input className="button" id ="registerSubmit" type="submit" onClick={this.props.onClick}/></td>
                </tr>


            </table>
            </div>
        );
    }
}