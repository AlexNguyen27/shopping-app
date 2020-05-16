import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux';

import Card from '../../components/UI/Card';
import CartItem from '../../components/shop/CartItem';
import * as cartActions from '../../store/actions/cart';
import * as ordersActions from '../../store/actions/orders';
import Colors from '../../constants/Colors';

// eslint-disable-next-line no-unused-vars
const CartScreen = (props) => {
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

    // return transformCartItems.sort((a, b) =>
    //   a.productPrice > b.productPrice ? 1 : -1
    // );
    return transformCartItems;
  });

  const sendOrdersHandler = async () => {
    setIsLoading(true);
    await dispatch(ordersActions.addOrder(cartItems, cartTotalAmount));
    setIsLoading(false);
  };

  return (
    <View style={styles.screen}>
      <Card style={styles.sumary}>
        <Text style={styles.sumaryText}>
          Total:
          <Text style={styles.amount}>
            ${Math.round(cartTotalAmount.toFixed(2) * 100) / 100}
          </Text>
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Button
            color={Colors.accent}
            title="Order Now"
            disabled={cartItems.length === 0}
            onPress={sendOrdersHandler}
          />
        )}
      </Card>
      <View>
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.productId}
          renderItem={(itemData) => (
            <CartItem
              quantity={itemData.item.quantity}
              title={itemData.item.productTitle}
              amount={itemData.item.sum}
              deletable
              onRemove={() => {
                dispatch(cartActions.removeFromCart(itemData.item.productId));
              }}
            />
          )}
        />
      </View>
    </View>
  );
};

CartScreen.navigationOptions = {
  headerTitle: 'Your Cart',
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
