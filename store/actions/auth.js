import { AsyncStorage } from 'react-native';
import { createUser, fetchUser } from './user';

// export const SIGNUP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;

export const authenticate = (userId, token, expiryTime) => async (dispatch) => {
  dispatch(setLogoutTimer(expiryTime));

  dispatch({
    type: AUTHENTICATE,
    userId,
    token,
  });
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem('userData');
  return { type: LOGOUT };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = (expirationTime) => async (dispatch) => {
  timer = setTimeout(() => {
    dispatch(logout());
  }, expirationTime); // set time out
};

export const signup = (email, password) => async (dispatch) => {
  const response = await fetch(
    'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDzvvnKFxIZQqKObK-bYqBsAKxwG6a5nYY',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    }
  );

  if (!response.ok) {
    const errorResData = await response.json();
    const errorMessage = errorResData.error.message;

    let message = 'Something when wrong!';
    if (errorMessage === 'EMAIL_EXISTS') {
      message = 'This email already exists!';
    }
    throw new Error(message);
  }

  const resData = await response.json();

  const { idToken, localId, expiresIn } = resData;
  dispatch(authenticate(localId, idToken, Number(expiresIn) * 1000));
  // get milisecond of date
  const expirationDate = new Date(
    new Date().getTime() + Number(expiresIn) * 1000
  );

  // save user
  const userData = {
    userId: localId,
    email
  };

  dispatch(createUser(userData));
  saveDataToStorage(idToken, localId, expirationDate);
};

export const login = (email, password) => async (dispatch) => {
  const res = await fetch(
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDzvvnKFxIZQqKObK-bYqBsAKxwG6a5nYY',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  );
  if (!res.ok) {
    const errorResData = await res.json();
    const errorMessage = errorResData.error.message;

    let message = 'Something when wrong!';
    if (errorMessage === 'EMAIL_NOT_FOUND') {
      message = 'This email could not be found!';
    } else if (errorMessage === 'INVALID_PASSWORD') {
      message = 'This password is not valid';
    }
    throw new Error(message);
  }

  const resData = await res.json();

  const { idToken, localId, expiresIn } = resData;
  dispatch(authenticate(localId, idToken, Number(expiresIn) * 1000));

  const expirationDate = new Date(
    new Date().getTime() + Number(resData.expiresIn) * 1000
  );

  dispatch(fetchUser());
  saveDataToStorage(idToken, localId, expirationDate);
};

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      token,
      userId,
      expiryDate: expirationDate.toISOString(),
    })
  );
};
