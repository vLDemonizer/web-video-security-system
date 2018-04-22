import '../assets/css/App.css';
import React, { Component } from 'react';
import IpServerHandler from './IpServerHandler.jsx'
import Node from './Node.jsx';
import Cameras from './Cameras.jsx';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      ip: '',
      node: '',

    };
  }
  
  render() {
    const index = this.state.index;
    if (index === 0) {
      return (
        <Node 
          ip={this.state.ip} 
          setNode={(node) => this.setState({
            node: node,
            index: this.state.index + 1
          })} 
        />
      );
    } 
    else if (index === 1) {

    } else if (index === 2) {
      return (
        <IpServerHandler setIp={(ip) => this.setState({ip: ip})} />
      );
    } else if (index === 3) {
      return <Cameras ip={this.state.ip} node={this.state.node} />
    }
    return <div></div>;
  }
}

export default App;
