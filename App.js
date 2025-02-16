import React, { useState } from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
// import { composeWithDevTools } from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk';
import * as firebase from 'firebase';
import ApiKeys from './constants/ApiKeys';

import productsReducer from './store/reducers/products';
import cartReducer from './store/reducers/cart';
import orderReducer from './store/reducers/orders';
import authReducer from './store/reducers/auth';
import userReducer from './store/reducers/user';

import NavigationContainer from './navigation/NavigationContainer';

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders: orderReducer,
  auth: authReducer,
  user: userReducer,
});

// Should remove compose when devploy app to production
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const fetchFonts = () =>
  Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
  });

firebase.initializeApp(ApiKeys.FirebaseConfig);

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
      />
    );
  }
  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}
