import React from 'react';
import {
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';

import Colors from '../../constants/Colors';
import * as cardActions from '../../store/actions/cart';
import Star from '../../components/UI/Star';

const ProductDetailScreen = (props) => {
  const productId = props.navigation.getParam('productId');

  const selectedProduct = useSelector((state) =>
    state.products.availableProducts.find((prod) => prod.id === productId)
  );

  const dispatch = useDispatch();

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
      <View style={styles.actions}>
        <FontAwesome.Button
          color="white"
          backgroundColor={Colors.primary}
          name="cart-arrow-down"
          size={24}
          onPress={() => {
            dispatch(cardActions.addToCart(selectedProduct));
          }}
        >
          ADD TO CART
        </FontAwesome.Button>
      </View>
      <Star />
      <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
      <Text style={styles.description}>{selectedProduct.description}</Text>
    </ScrollView>
  );
};

ProductDetailScreen.navigationOptions = (navData) => {
  return {
    headerTitle: navData.navigation.getParam('productTitle'),
  };
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 300,
  },
  price: {
    fontFamily: 'open-sans-bold',
    fontSize: 20,
    textAlign: 'center',
    color: '#888',
    marginVertical: 10,
  },
  description: {
    fontFamily: 'open-sans',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  actions: {
    marginVertical: 10,
    alignItems: 'center',
  },
});

export default ProductDetailScreen;
