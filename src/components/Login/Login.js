import React, { Component } from 'react';
import logo from './communityBank.svg';
import './Login.css';


export default class Login extends Component {
    render() {
        return (
            <div className='App'>  
                <img src={logo} alt="bank logo"/>
                <a href={process.env.REACT_APP_LOGIN}><button type="" className="">Login</button></a>
            </div> 
        )
    }
}