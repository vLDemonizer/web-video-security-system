import '../assets/css/App.css';
import React, { Component } from 'react';
import IpServerHandler from './IpServerHandler.jsx'
import Node from './Node.jsx';
import Cameras from './Cameras.jsx';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      indexComponent: 0,
      ip: '',
      node: '',

    };
  }
  
  render() {
    if (this.state.ip && this.state.indexComponent === 0) {
      return (
        <Node 
          ip={this.state.ip} 
          setNode={(node) => this.setState({
            node: node,
            indexComponent: this.state.indexComponent + 1
          })} 
        />
      );
    } else if (this.state.indexComponent === 0) {
      return (
        <IpServerHandler setIp={(ip) => this.setState({ip: ip})} />
      );
    } else if (this.state.indexComponent === 1) {
      return <Cameras ip={this.state.ip} node={this.state.node} />
    }
    return <div></div>;
  }
}

export default App;
