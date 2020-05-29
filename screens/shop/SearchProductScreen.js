import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  YellowBox,
  Text,
  Platform,
  StyleSheet
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { SearchBar } from 'react-native-elements';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Colors from '../../constants/Colors';

import * as productsAction from '../../store/actions/products';
import * as cardActions from '../../store/actions/cart';

import HeaderButton from '../../components/UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import Star from '../../components/UI/Star';

const SearchProductScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const products = useSelector((state) => state.products.availableProducts);

  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [dataBackup, setDataBackup] = useState([]);
  const [searchKey, setSearchKey] = useState('');

  const loadProducts = useCallback(async () => {
    try {
      await dispatch(productsAction.fetchProducts());
    } catch (err) {
      console.log(err);
    }
  }, [dispatch, setIsLoading]);

  useEffect(() => {
    YellowBox.ignoreWarnings(['Setting a timer']);
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
      setDataBackup(products);
    });
  }, [dispatch, setDataBackup, loadProducts]);

  const setSearchText = (search) => {
    setSearchKey(search);
    const searchText = search;
    const mockup = dataBackup.filter((item) => {
      return item.title.toLowerCase().match(searchText) || String(item.price).match(searchText); // item.description.includes(searchText);
    });

    setData(mockup);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  const selectItemHandler = (id, title) => {
    props.navigation.navigate('ProductDetail', {
      productId: id,
      productTitle: title,
    });
  };

  return (
    <View>
      <SearchBar
        round
        lightTheme
        onChangeText={(search) => setSearchText(search)}
        inputStyle={{ color: 'black' }}
        placeholderTextColor="white"
        placeholder="Type product name and price here..."
        value={searchKey}
      />

      {
        data && data.length > 0 ? (
          <FlatList
            data={data && data.length > 0 ? data : dataBackup}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ProductItem
                imageUrl={item.imageUrl}
                title={item.title}
                price={item.price}
                onSelect={() =>
                  selectItemHandler(item.id, item.title)}
              >
                <MaterialCommunityIcons
                  name="eye"
                  size={30}
                  color={Colors.view}
                  onPress={() =>
                    selectItemHandler(item.id, item.title)}
                />
                <Star />
                <MaterialCommunityIcons
                  name="cart"
                  size={25}
                  color={Colors.primary}
                  title="To Cart"
                  onPress={() => dispatch(cardActions.addToCart(item))}
                />
              </ProductItem>
            )}
          />
        ) : (
          <View style={styles.centered}>
            <Text style={styles.notfound}>No products found!</Text>
          </View>
        )
      }
    </View>
  );
};

SearchProductScreen.navigationOptions = (navData) => ({
  headerTitle: 'Search Products',
  headerLeft: () => (
    <HeaderButtons HeaderButtonComponent={HeaderButton}>
      <Item
        title="Menu"
        iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
        onPress={() => {
          navData.navigation.toggleDrawer('Search');
        }}
      />
    </HeaderButtons>
  ),
});

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    fontFamily: 'open-sans'
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
  notfound: {
    fontFamily: 'open-sans',
    fontSize: 16
  }
});

export default SearchProductScreen;
