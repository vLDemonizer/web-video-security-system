import '../assets/css/App.css';
import React, { Component } from 'react';
import Camera from './Camera.jsx'

class App extends React.Component {
  
  render() {
    return (
      <div>
        <h1>Hello, Electron!</h1>
        <p>I hope you enjoy using basic-electron-react-boilerplate to start your dev off right!</p>
      <Camera />
      </div>
    );
  }
}

export default App;
