import React, { Component } from 'react';
import Login from './Login.jsx';
import Camera from './Camera.jsx';

class ComponentHandler extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: <Login key={1} changeComponentDown={ this.changeComponentDown.bind(this) }/>,
            index: 0
        };
        
        this.components = [
            <Login key={1} changeComponentDown={ this.changeComponentDown.bind(this) }/>,
            <Camera key={2} changeComponentDown={ this.changeComponentDown.bind(this) } changeComponentUp={ this.changeComponentUp.bind(this) }/>
        ];
    }

    changeComponentDown() {
        if (arguments.length === 0) {
            if (this.state.index === this.components.length) {
                this.setState({
                    current: this.components[0]
                })
            } else {
                this.setState({
                    current: this.components[this.state.index + 1],
                    index: this.state.index + 1
                })
            }
        } else if (typeof value === 'string') {
            console.log(value)

            if (this.state.index === this.components.length) {
                this.setState({
                    current: this.components[0]
                })
            } else {
                this.setState({
                    current: this.components[this.state.index + 1],
                    index: this.state.index + 1,
                })
            }
        }
    }

    changeComponentUp() {
        if (this.state.index - 1 === 0) {
            this.setState({
                current: this.components[0]
            })
        } else {
            this.setState({
                current: this.components[this.state.index - 1],
                index: this.state.index - 1
            })
        }
    }

    render() {
        return[
            this.state.current
        ];
    }
}

export default ComponentHandler;