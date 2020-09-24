import React, {Component} from "react";

class SquareA extends Component {
    render() {
        const classes = `grid-square color-${this.props.color}`
        return <div className={classes} />
    }
};

export default SquareA;