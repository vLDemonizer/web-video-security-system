import '../assets/css/App.css';
import React, { Component } from 'react';
import IpServerHandler from './IpServerHandler.jsx'
import Node from './Node.jsx';
import Cameras from './Cameras.jsx';
import Login from './Login.jsx';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      ip: '',
      node: '',
      user: '',
    };
  }
  
  render() {
    const index = this.state.index;
    const ip = this.state.ip;
    console.log(ip)
    switch (index) {
      case 0:
        return (
          <IpServerHandler setIp={(ip) => this.setState({
            ip: ip,
            index: index + 1
          })} />
        );
      case 1:
        return (
          <Login ip={ip} setUser={(user) => this.setState({
            user: user,
            index: index + 1
          })} 
          />
        );
      case 2:
        return (
          <Node 
            ip={ip} 
            setNode={(node) => this.setState({
              node: node,
              index: index + 1
            })} 
          />
        );
      case 3:
        return <Cameras ip={ip} node={this.state.node} />

    }
    return <div></div>;
  }
}

export default App;
