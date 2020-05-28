import React, { useEffect, useState, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import {
  FlatList,
  Button,
  Platform,
  ActivityIndicator,
  View,
  StyleSheet,
  Text,
  YellowBox
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HeaderButton from '../../components/UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';

import * as cardActions from '../../store/actions/cart';
import * as productsAction from '../../store/actions/products';

import Colors from '../../constants/Colors';
import Star from '../../components/UI/Star';

const ProductsOverviewScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const products = useSelector((state) => state.products.availableProducts);
  const dispatch = useDispatch();
  const cartObj = useSelector((state) => state.cart.items);

  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(productsAction.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setError, setIsLoading]);

  // loading product when scrolling down
  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      'willFocus',
      loadProducts,
    );
    return () => {
      willFocusSub.remove();
    };
  }, [loadProducts]);

  const setTotalCartItem = useCallback(async () => {
    const totalQuantity = Object.keys(cartObj).reduce(
      (sum, key) => sum + parseFloat(cartObj[key].quantity || 0),
      0
    );

    props.navigation.setParams({ totalQuantity });
  });

  useEffect(() => {
    setTotalCartItem();
  }, [cartObj]);

  useEffect(() => {
    YellowBox.ignoreWarnings(['Setting a timer']);
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProducts]);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate('ProductDetail', {
      productId: id,
      productTitle: title,
    });
  };
  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occured!</Text>
        <Button
          title="Try again"
          color={Colors.primary}
          onPress={loadProducts}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No products found. Maybe start adding some!</Text>
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={loadProducts}
      refreshing={isRefreshing}
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <ProductItem
          imageUrl={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() =>
            selectItemHandler(itemData.item.id, itemData.item.title)}
        >
          <MaterialCommunityIcons
            name="eye"
            size={30}
            color={Colors.view}
            onPress={() =>
              selectItemHandler(itemData.item.id, itemData.item.title)}
          />
          <Star />
          <MaterialCommunityIcons
            name="cart"
            size={25}
            color={Colors.primary}
            title="To Cart"
            onPress={() => dispatch(cardActions.addToCart(itemData.item))}
          />
        </ProductItem>
      )}
    />
  );
};

ProductsOverviewScreen.navigationOptions = (navData) => ({
  headerTitle: 'All Products',
  headerLeft: () => (
    <HeaderButtons HeaderButtonComponent={HeaderButton}>
      <Item
        title="Menu"
        iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
        onPress={() => {
          navData.navigation.toggleDrawer('Orders');
        }}
      />
    </HeaderButtons>
  ),
  headerRight: () => {
    let total = 0;
    if (navData.navigation.state.params) {
      const { totalQuantity } = navData.navigation.state.params;
      total = totalQuantity;
    }

    return (
      <View style={{ paddingTop: 15 }}>
        <View style={styles.total}>
          <Text style={styles.amount}>{total || 0}</Text>
        </View>
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Cart"
            iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
            onPress={() => {
              navData.navigation.navigate('Cart');
            }}
          />
        </HeaderButtons>
      </View>
    );
  },
});

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontFamily: 'open-sans-bold'
  },
});

export default ProductsOverviewScreen;
