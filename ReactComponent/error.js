import React from "react";

export default class Error extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div id={this.props.id}>{this.props.error}</div>
        );
    }
}



