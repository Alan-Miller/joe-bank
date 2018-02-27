import React, { Component } from 'react';
import './Private.css';
// import axios from 'axios';
import { getUserInfo } from '../../ducks/users';
import { connect } from 'react-redux';

class Private extends Component {
  constructor(props) {
    super(props); // super allows you to you this keyword in constructor
    this.state = {
      userInfo: {}
    };
  }

  componentDidMount() {
    this.props.getUserInfo();
    // axios.get('/auth/me')
    // .then(response => {
    //   this.setState({
    //     userInfo: response.data
    //   });
    // });
  }

  render() {
      const user = this.props.user;
      console.log('id', user.id);
      return (
          <div className='privateInfo'>
            
            <h1>Joe Bank</h1><hr />
            <h4>Account information:</h4>
            <p>Username: { user.id ? user.username : null }</p>
            <p>Email: { user.id ? user.email : null }</p>
            <p>ID: { user.id ? user.auth_id : null }</p>
            <h4>Available balance: { Math.floor((Math.random() + 1) * 1000) + '.00' } </h4>
            <a href={ process.env.REACT_APP_AUTH0_v2_LOGOUT }><button>Log out</button></a>
          </div> 
      )
  }
}

function mapStateToProps(state) {
  // console.log('state from Private', user);
  // return user;
  return state;
}

export default connect(mapStateToProps, { getUserInfo })(Private);

// {JSON.stringify(this.state.userInfo, null, 2)} // can display object in React this way