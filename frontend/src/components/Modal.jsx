import React from 'react';
import {
    Modal, Button, Form, FormGroup, Input, Label,
    ModalHeader, ModalBody, ModalFooter, Collapse, Col
} from 'reactstrap';


class MyLargeModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: this.props.showModal,
            edit: false
        };

        this.edit = this.edit.bind(this);
    }
    
    edit() {
        this.setState({edit: !this.state.edit});
    }

    render() {
      return (
          <div>
                <Modal isOpen={this.props.show}>
                    <ModalHeader className="text-center">
                        {this.props.name}
                        <Button color="danger" onClick={this.props.hide}>X</Button>
                    </ModalHeader>
                    <ModalBody>
                        <div className="embed-responsive embed-responsive-16by9">
                            <video src={this.props.src} alt={this.props.name} className="embed-responsive-item fuente"></video>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.edit} style={{ marginBottom: '1rem' }}>Edit</Button>
                        <Collapse isOpen={this.state.edit}>
                            <Form>
                                <FormGroup>
                                    <Label>Identifier</Label>{' '}
                                    <Input type="text" placeholder="Identifier" name="identifier" />
                                </FormGroup>{' '}
                                <FormGroup>
                                    <Label>Description</Label>{' '}
                                    <Input type="text" placeholder="Camera Description" name="description" />
                                </FormGroup>{' '}
                                <Button color="primary">Save</Button>
                            </Form>
                        </Collapse>
                    </ModalFooter>
                </Modal>
          </div>
        
      );
    }
  }
  
export default MyLargeModal;