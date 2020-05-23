import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import CartItem from './CartItem';
import Colors from '../../constants/Colors';
import Card from '../UI/Card';

const OrderItem = (props) => {
  const [showDetail, setShowDetail] = useState(false);

  const { amount, date, items } = props;

  return (
    <Card style={styles.orderItem}>
      <View style={styles.sumary}>
        <Text style={styles.totalAmount}>
          Total Amount: <Text style={styles.price}>${amount.toFixed(2)}</Text>
        </Text>
      </View>
      <View>
        <Text style={styles.date}>{date}</Text>
      </View>
      <MaterialIcons
        name={showDetail ? 'expand-less' : 'expand-more'}
        color={Colors.primary}
        size={25}
        onPress={() => setShowDetail((prevState) => !prevState)}
      />
      {showDetail && (
        <View style={styles.detailItems}>
          {items.map((cartItem) => (
            <CartItem
              key={cartItem.productId}
              quantity={cartItem.quantity}
              amount={cartItem.sum}
              title={cartItem.productTitle}
              price={cartItem.productPrice}
            />
          ))}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  orderItem: {
    margin: 20,
    padding: 10,
    alignItems: 'center',
  },
  price: {
    color: Colors.view
  },
  sumary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  totalAmount: {
    fontFamily: 'open-sans-bold',
    fontSize: 16,
  },
  date: {
    fontSize: 16,
    fontFamily: 'open-sans-bold',
    color: 'gray',
  },
  detailItems: {
    width: '100%',
  },
});

export default OrderItem;
