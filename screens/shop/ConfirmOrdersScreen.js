import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
} from 'react-native';
import * as firebase from 'firebase';

import { useDispatch, useSelector } from 'react-redux';
import { sendEmailVarification } from '../../store/actions/send-emailv2';
import * as ordersActions from '../../store/actions/orders';

import Colors from '../../constants/Colors';

const ConfirmOrdersScreen = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const cartTotalAmount = useSelector((state) => state.cart.totalAmount);

  const cartItems = useSelector((state) => {
    const transformCartItems = [];

    for (const key in state.cart.items) {
      const { productTitle, productPrice, quantity, sum } = state.cart.items[
        key
      ];
      transformCartItems.push({
        productId: key,
        productTitle,
        productPrice,
        quantity,
        sum,
      });
    }

    return transformCartItems;
  });
  const sendEmail = async () => {
    // const email = 'n16dccn151@student.ptithcm.edu.vn';
    setIsLoading(true);
    await dispatch(sendEmailVarification());
    setIsLoading(false);

    setTimeout(() => {
      firebase.auth().onAuthStateChanged((authUser) => {
        if (authUser.emailVerified) {
          // This will return true or false
          setIsLoading(true);
          dispatch(ordersActions.addOrder(cartItems, cartTotalAmount));

          props.navigation.navigate('Cart', {
            isOrdered: true,
          });
          setIsLoading(false);
        } else {
          console.log('Eror');
        }
      });
    }, 20000);
  };
  return (
    <View style={styles.centered}>
      <Text>Please check your email, a verify link was sent to your email</Text>
      {isLoading ? (
        <ActivityIndicator size="small" color={Colors.primary} />
      ) : (
        <Button
          color={Colors.primary}
          title="Send varification to email"
          onPress={() => {
            sendEmail();
          }}
        />
      )}
    </View>
  );
};

ConfirmOrdersScreen.navigationOptions = () => ({
  headerTitle: 'Confirm orders',
});

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    fontFamily: 'open-sans',
  },
  total: {
    position: 'absolute',
    borderRadius: 15,
    height: 25,
    width: 25,
    backgroundColor: Colors.accent,
    right: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  amount: {
    color: 'black',
    fontFamily: 'open-sans-bold',
  },
  notfound: {
    fontFamily: 'open-sans',
    fontSize: 16,
  },
  container: {
    marginBottom: 150,
  },
});

export default ConfirmOrdersScreen;
