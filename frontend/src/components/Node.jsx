import React, { Component } from 'react';
import { 
    Button, Form, FormFeedback, FormText, FormGroup, Label, 
    Input, Container
} from 'reactstrap';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

class Node extends Component {
    constructor(props) {
        super(props);
        this.state = {
            validInput: false,
            invalidInput: false,
        }
        this.nodeRef = React.createRef();
        this.inputRef = React.createRef();

        this.getNode = this.getNode.bind(this);
        this.createNode = this.createNode.bind(this);
    }

    getNode(identifier) {
        axios.get('/nodes/' + identifier)
            .then(response => console.log(response))
            .catch(error => this.setState({invalidInput: true}))
    }

    createNode(identifier) {
        axios.post('/nodes/', {identifier: this.inputRef.current.value})
            .then(response => console.log(response))
            .catch(error => this.setState({invalidInput: true}))
    }

    render() {
        let validInput = false;
        let invalidInput = false;
        return (
            <Container>
                <br />
                <br />
                <br />
                <h1 className="text-center">Submit this Node's ID/Name</h1>
                <br />
                <Form>
                    <FormGroup>
                        <Label for="node">Node Identifier:</Label>
                        <Input 
                            invalid={this.state.invalidInput} 
                            type="text" 
                            name="node" 
                            id="node" 
                            placeholder="Insert Node Id"
                            innerRef={this.inputRef}
                            ref={this.nodeRef}

                        />
                        <FormFeedback invalid>Node not Found! Wish to make a new node?</FormFeedback>
                        <FormText>The ID will be checked in the backend</FormText>
                    </FormGroup>
                    <div className="text-center">
                        <Button onClick={() => {
                            if (this.inputRef.current.value) {
                                this.getNode(this.inputRef.current.value)
                            }
                        }} >Submit</Button>
                    </div>
                    <br />
                    <div className="text-center">
                        <Button>Create Node</Button>
                    </div>
                </Form>
            </Container>
        )
    }
}

export default Node;