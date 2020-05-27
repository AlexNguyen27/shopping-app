import {
  ADD_USER_INFO,
  UPDATE_USER_INFO,
  GET_USER_INFO
} from '../actions/user';
import User from '../../models/user';

const initialState = {
  user: {},
};

// eslint-disable-next-line no-unused-vars
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_INFO:
      return {
        user: action.userInfo,
      };
    case ADD_USER_INFO:
      const { userId, email } = action.user;
      const newUser = new User(userId, null, null, null, email, null, null, null);
      return {
        ...state,
        user: newUser
      };
  }
  return state;
};
