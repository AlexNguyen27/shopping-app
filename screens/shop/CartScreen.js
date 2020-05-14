import React from 'react';
import { View, Text, Button, StyleSheet, ColorPropType } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';

import Colors from '../../constants/Colors';

const CartScreen = (props) => {
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
  return (
    <View style={styles.screen}>
      <View style={styles.sumary}>
        <Text style={styles.sumaryText}>
          Total:{' '}
          <Text style={styles.amount}>${cartTotalAmount.toFixed(2)}</Text>
        </Text>
        <Button color={Colors.accent} title="Order Now" disabled={cartItems.length === 0}/>
      </View>
      <View>
        <Text>CART ITEMS</Text>
        <FlatList />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    margin: 20,
  },
  sumary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 10,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  sumaryText: {
    fontFamily: 'open-sans-bold',
    fontSize: 18,
  },
  amount: {
    color: Colors.primary,
  },
});
export default CartScreen;
