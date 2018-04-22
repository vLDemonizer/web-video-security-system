import React, { Component } from 'react';
import {
    Button, Form, FormFeedback, FormText,
    FormGroup, Label, Input, Container
} from 'reactstrap';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

class IpServerHandler extends Component {
    constructor(props) {
        super(props);
        this.state = {
            validIp: false,
            invalidIp: false,
        }
        this.ipRef = React.createRef();
        this.inputRef = React.createRef();

        this.checkIp = this.checkIp.bind(this);
    }

    checkIp(ip) {
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)) {
            const address = 'http://' + ip + ':8000';
            this.setState({
                validIp: true, 
                invalidIp: false
            });
            axios.get(address)
                .then(response => this.props.setIp(address))
                .catch(error => console.log(error))
        } else {
            this.setState({
                invalidIp: true, 
                validIp: false
            });
        }
    }

    render () {
        return (
            <Container>
                <br />
                <br />
                <br />
                <h1 className="text-center">Submit Server's IP Address</h1>
                <br />
                <Form>
                    <FormGroup>
                        <Label for="Server">Server IP:</Label>
                        <Input 
                            valid={this.state.validIp} 
                            invalid={this.state.invalidIp} 
                            type="text" 
                            name="server" 
                            id="server" 
                            placeholder="Insert Server IP"
                            innerRef={this.ipRef}
                            ref={this.inputRef}
                        />
                        <FormFeedback valid>Valid IP address, but it's not OUR Server!</FormFeedback>
                        <FormFeedback invalid>Invalid IP address format!</FormFeedback>
                    </FormGroup>
                    <div className="text-center">
                        <Button onClick={() => this.checkIp(this.ipRef.current.value)}>
                            Submit
                        </Button>
                    </div>
                </Form>
            </Container>
        )
    }
}

export default IpServerHandler;