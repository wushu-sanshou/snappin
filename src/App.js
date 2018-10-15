import React, { Component } from 'react';
import './App.css';
import { Route } from 'react-router';
import User from './components/User';
import Admin from './components/Admin';

class App extends Component {
  render() {
    return (
      <div className="App">
          <Route exact path="/" component={User}/>
          <Route exact path="/admin" component={Admin}/>
      </div>
    );
  }
}

export default App;
