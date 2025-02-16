// import User from '../../models/user';

export const ADD_USER_INFO = 'ADD_USER_INFO';
export const UPDATE_USER_INFO = 'UPDATE_USER_INFO';
export const GET_USER_INFO = 'GET_USER_INFO';

export const baseURL = 'https://shopping-app-e51f6.firebaseio.com';

export const fetchUser = () => async (dispatch, getState) => {
  try {
    const { userId, token } = getState().auth;
    const res = await fetch(`${baseURL}/users/${userId}.json?auth=${token}`);

    if (!res.ok) {
      throw new Error('Can not get user info!');
    }

    const user = await res.json();
    dispatch({
      type: GET_USER_INFO,
      user: {
        id: userId,
        ...user
      },
    });
  } catch (err) {
    throw err;
  }
};

export const createUser = (userData) => async (dispatch, getState) => {
  const { token } = getState().auth;
  const { userId, email } = userData;

  const res = await fetch(`${baseURL}/users/${userId}.json?auth=${token}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      profileUrl: '',
      description: '',
    }),
  });

  if (!res.ok) {
    throw new Error('Something when wrong!');
  }

  // const user = await res.json();

  dispatch({
    type: ADD_USER_INFO,
    user: userData,
  });
};

export const updateUser = (userData) => async (dispatch, getState) => {
  const { token, userId } = getState().auth;

  const res = await fetch(`${baseURL}/users/${userId}.json?auth=${token}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...userData,
    }),
  });

  if (!res.ok) {
    throw new Error('Something when wrong!');
  }
  dispatch({
    type: UPDATE_USER_INFO,
    user: {
      ...userData
    },
  });
};
