import React, { Component } from 'react';
import {Col, Button, ButtonGroup} from 'reactstrap';
import MyLargeModal from './Modal.jsx';

class CameraItem extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
          showModal: false
        };
    }

    render() {
        return (
            <Col xs={12} sm={6} md={4} onClick={() => this.setState({ showModal: true })}>
                <h5 className="text-center">{this.props.name}</h5>
                    <br />
                    <div className="embed-responsive embed-responsive-16by9">
                        <video src={this.props.src} alt={this.props.name} className="embed-responsive-item fuente"></video>
                    </div>
                    <MyLargeModal 
                        show={this.state.showModal} 
                        hide={() => this.setState({showModal: false})}
                        name={this.props.name} 
                        src={this.props.src}
                    />
            </Col>
        );
    }
}

export default CameraItem;