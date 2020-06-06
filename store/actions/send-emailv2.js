import email from 'react-native-email';

export const sendEmail = () => {
  const to = ['tiaan@email.com', 'foo@bar.com']; // string or array of email addresses
  email(to, {
    // Optional additional arguments
    cc: ['thanhnguyen.tnn55@gmail.com'], // string or array of email addresses
    bcc: 'n16dccn151@student.ptithcm.edu.vn', // string or array of email addresses
    subject: 'Show how to use',
    body: 'Some body right here',
  }).catch(console.error);
};

export const sendEmailVarification = () => async (dispatch, getState) => {
  const { token } = getState().auth;
  const res = await fetch(
    'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDzvvnKFxIZQqKObK-bYqBsAKxwG6a5nYY',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestType: 'VERIFY_EMAIL',
        idToken: token,
      }),
    }
  );

  if (!res.ok) {
    const errorResData = await res.json();
    const errorMessage = errorResData.error.message;

    let message = 'Something when wrong!';
    if (errorMessage === 'INVALID_ID_TOKEN') {
      message = 'The user credential is no longer valid. The user must sign in again.';
    } else if (errorMessage === 'USER_NOT_FOUND') {
      message = 'There is no user record corresponding to this identifier. The user may have been deleted.';
    }
    throw new Error(message);
  }

  const resData = await res.json();

  console.log('sendng email ', resData);
};


export const confirmEmailVarification = () => async (dispatch, getState) => {
  const { token } = getState().auth;
  const res = await fetch(
    'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDzvvnKFxIZQqKObK-bYqBsAKxwG6a5nYY',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oobCode: 'test'
      }),
    }
  );

  if (!res.ok) {
    const errorResData = await res.json();
    const errorMessage = errorResData.error.message;

    // let message = 'Something when wrong!';
    // if (errorMessage === 'EXPIRED_OOB_CODE') {
    //   message = 'The user credential is no longer valid. The user must sign in again.';
    // } else if (errorMessage === 'USER_NOT_FOUND') {
    //   message = 'There is no user record corresponding to this identifier. The user may have been deleted.';
    // }
    throw new Error(errorMessage);
  }

  const resData = await res.json();

  console.log('confirm email ', resData);
};
