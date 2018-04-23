import React, { Component } from 'react';
import {Col, Button, ButtonGroup} from 'reactstrap';
import MyLargeModal from './Modal.jsx';

class CameraItem extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
          showModal: false,
          identifier: '',
        };
    }




    render() {
        if (this.props.record) {
            this.props.startRecording(this.props.src, this.state.identifier);
        }
        return (
            <Col xs={12} sm={6} md={4} onClick={() => this.setState({ showModal: true })}>
                <h5 className="text-center">{this.state.identifier}</h5>
                <div className="embed-responsive embed-responsive-16by9">
                    <video src={this.props.url} alt={this.props.identifier} className="embed-responsive-item fuente"></video>
                </div>
                <MyLargeModal 
                    show={this.state.showModal} 
                    hide={() => this.setState({showModal: false})}
                    name={this.props.name} 
                    url={this.props.url}
                    ip={this.props.ip}
                    node={this.props.node}
                    backendCameras={this.props.backendCameras}
                    selectCamera={identifier => this.setState({identifier: identifier})}
                    updateBackendCameras={this.props.updateBackendCameras}
                />
            </Col>
        );
    }
}

export default CameraItem;