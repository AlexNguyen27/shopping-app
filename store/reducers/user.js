import {
  ADD_USER_INFO,
  UPDATE_USER_INFO,
  GET_USER_INFO
} from '../actions/user';
import User from '../../models/user';
import { LOGOUT } from '../actions/auth';

const initialState = {
  user: {},
};

// eslint-disable-next-line no-unused-vars
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_INFO:
      return {
        user: action.user,
      };
    case ADD_USER_INFO:
      const { userId, email } = action.user;
      const newUser = new User(userId, '', '', '', email, '', '', '');
      return {
        ...state,
        user: newUser
      };
    case UPDATE_USER_INFO:
      const { firstName, lastName, phone, address, profileUrl, description } = action.user;
      return {
        user: {
          ...state.user,
          firstName,
          lastName,
          phone,
          address,
          profileUrl,
          description
        }
      };
    case LOGOUT:
      return initialState;
  }
  return state;
};
