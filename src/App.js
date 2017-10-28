import React, { Component } from 'react';
import { HashRouter, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Private from './components/Private/Private';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <HashRouter>
          <div>
            <Route component={Login} exact path="/" />
            <Route component={Private} path="/private" />
          </div>
        </HashRouter>
      </div>
    );
  }
}

export default App;

// Normally, .env is only available to back end. 
// But if we use React env variables, we can access on the front end.