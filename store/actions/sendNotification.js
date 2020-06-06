const functions = require('firebase-functions');
const fetch = require('node-fetch');


const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);


// send the push notification
exports.sendNotification = functions.database.ref('products/').onCreate((event) => {
  const { root } = event.data.ref;
  const messages = [];

  // return the main promise
  return root.child('/users').once('value').then((snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const { expoToken } = childSnapshot.val();

      messages.push({
        to: expoToken,
        sound: 'default',
        body: 'New Note Added'
      });
    });
    // firebase.database then() respved a single promise that resolves
    // once all the messages have been resolved
    return Promise.all(messages);
  })
    .then((msg) => {
      console.log(msg);
      fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(msg)

      });
    })
    .catch((reason) => {
      console.log(reason);
    });
});
