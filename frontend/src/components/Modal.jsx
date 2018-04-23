import React from 'react';
import {
    Modal, Button, Form, FormGroup, Input, Label,
    ModalHeader, ModalBody, ModalFooter, Collapse, Col
} from 'reactstrap';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';


class MyLargeModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: this.props.showModal,
            edit: false,
            create: false,
            cameras: '',
            name: this.props.name,
            description: '',
        };

        this.identifierRef = React.createRef();
        this.descriptionRef = React.createRef();
        this.selectRef = React.createRef();

        this.edit = this.edit.bind(this);
        this.createCamera = this.createCamera.bind(this);
    }
    
    edit() {
        this.setState({edit: !this.state.edit});
    }

    createCamera() {
        let form = new FormData();
        form.append('identifier', this.identifierRef.current.value);
        form.append('description', this.descriptionRef.current.value);
        axios.post(this.props.ip + '/get-cameras/' + this.props.node + '/', form)
            .then(response => console.log(response))
            .catch(error => console.log(error))
        this.setState({create: false});
        this.props.updateBackendCameras();
        this.props.hide();
    }

    render() {
        const trimCameras = (e) => {
            let value = this.selectRef.current.value;
            console.log(value)
            this.props.selectCamera(value);
            let cameras = this.props.backendCameras;
            this.props.hide();
            return cameras.splice(cameras.map(camera => camera.identifier).indexOf(value), 1);
        };
        return (
            <div>
                <Modal isOpen={this.props.show}>
                    <ModalHeader className="text-center">
                        {this.props.name}
                        <Button color="danger" onClick={this.props.hide}>X</Button>
                    </ModalHeader>
                    <ModalBody>
                        <div className="embed-responsive embed-responsive-16by9">
                            <video src={this.props.url} alt={this.props.name} className="embed-responsive-item fuente"></video>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.edit} style={{ marginBottom: '1rem' }}>Edit</Button>
                        <Collapse isOpen={this.state.edit}>
                            <Form>
                                <Collapse isOpen={!this.state.create}>
                                    <FormGroup>
                                        <Label for="exampleSelect">Select from existing cameras</Label>
                                        <Input type="select" name="select" innerRef={this.selectRef}>
                                            {this.props.backendCameras ? this.props.backendCameras.map(camera => (
                                                <option>{camera.identifier}</option>
                                                ))
                                                :
                                                ''
                                            }
                                        </Input>
                                        <Button color="primary" onClick={trimCameras}>Select Camera</Button>
                                        <Button color="warning" onClick={() => this.setState({create: true})}>Create new Camera</Button>
                                    </FormGroup>
                                </Collapse>
                                <Collapse isOpen={this.state.create}>
                                    <FormGroup>
                                        <Label>Create new Identifier</Label>
                                        <Input type="text" placeholder="Identifier" name="identifier" innerRef={this.identifierRef}/>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Description</Label>
                                        <Input type="text" placeholder="Camera Description" name="description" innerRef={this.descriptionRef}/>
                                    </FormGroup>
                                    <Button color="primary" onClick={this.createCamera}>Save</Button>
                                    <Button color="danger" onClick={() => this.setState({create: false})}>Cancel</Button>
                                </Collapse>
                            </Form>
                        </Collapse>
                    </ModalFooter>
                </Modal>
            </div>
            
        );
    }
  }
  
export default MyLargeModal;