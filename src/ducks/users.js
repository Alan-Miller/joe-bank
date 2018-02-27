import axios from 'axios';
// axios.defaults.withCredentials = true;

const initialState = {
  user: {}
}

const GET_USER_INFO = 'GET_USER_INFO';

export function getUserInfo() {
  const userData = axios({
    method: 'GET',
    url: 'http://localhost:3322/auth/me',
    withCredentials: true
  })
  .then(response => response.data);

  return {
    type: GET_USER_INFO,
    payload: userData
  }
}

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case `${GET_USER_INFO}_FULFILLED`:
      return Object.assign({}, state, {user: action.payload});
    default: 
      return state;
  }
}