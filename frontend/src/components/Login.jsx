import React, { Component } from 'react';
import axios from 'axios';
import Tilt from 'react-tilt';
import { Button } from 'reactstrap';
 

import logo from '../assets/images/img-01.png';
import '../assets/fonts/font-awesome-4.7.0/css/font-awesome.css';
import '../assets/vendor/animate/animate.css';
import '../assets/vendor/css-hamburgers/hamburgers.css';
import '../assets/vendor/select2/select2.css';
import '../assets/css/login/main.css';
import '../assets/css/login/util.css';


class Login extends Component {
    constructor (props){
        super(props);
        this.state = {
            username: '',
            password: '',
            error: ''
        };
    }
    
    onChange(type, e) {
        var data = e.target.value;
        if (type === "username"){
            this.setState({ username: data });
        }
        else if (type === "password"){
            this.setState({ password: data});
        }
    }

    onClick() {
        let form = new FormData();
        form.append('username', this.state.username);
        form.append('pass', this.state.password);
        axios.post(this.props.ip + '/log-in/', form)
            .then(response => {
                if(response.data.login === true){
                    this.props.setUser({user: this.state.username})
                }
                else{
                    this.setState({
                        error: <h5 style={{ color: 'red' }}>User not found!</h5>
                    });
                }
            })
            .catch(error => console.log(error))
    }

    render() {
        return(
            <div className="limiter">
                <div className="container-login100">
                    <div className="wrap-login100">
                        <div className="login100-pic js-tilt" data-tilt>
                            <Tilt options={{ scale: 1.2 }}>
                                <img src={logo} alt="IMG"/>
                            </Tilt>
                        </div>
        
                        <form className="login100-form validate-form">
                            <span className="login100-form-title">
                                Member Login
                            </span>
        
                            <div className="wrap-input100 validate-input" data-validate = "Valid email is required: ex@abc.xyz">
                                <input className="input100" 
                                    type="text" 
                                    id="username_id"
                                    name="username" 
                                    placeholder="Username" 
                                    onChange={this.onChange.bind(this, "username")}
                                />
                                <span className="focus-input100"></span>
                                <span className="symbol-input100">
                                    <i className="fa fa-envelope" aria-hidden="true"></i>
                                </span>
                            </div>
        
                            <div className="wrap-input100 validate-input" data-validate = "Password is required">
                                <input className="input100" 
                                    type="password"
                                    id="pass_id" 
                                    name="pass" 
                                    placeholder="Password"
                                    onChange={this.onChange.bind(this, "password")}
                                />
                                <span className="focus-input100"></span>
                                <span className="symbol-input100">
                                    <i className="fa fa-lock" aria-hidden="true"></i>
                                </span>
                            </div>
                            
                            <div style={{ marginLeft: '33%' }}>
                            {
                                this.state.error === '' ?
                                ''
                                :
                                this.state.error
                            }
                            </div>

                            <div className="container-login100-form-btn">
                                <Button className={'login100-form-btn'} onClick={this.onClick.bind(this)}>
                                    Login
                                </Button>
                            </div>
    
                            <div className="text-center p-t-136">
                                <a className="txt2" href={this.props.ip + '/sign-up/'}>
                                    Create your Account
                                    <i className="fa fa-long-arrow-right m-l-5" aria-hidden="true"></i>
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>        

        );
    }
};

export default Login;