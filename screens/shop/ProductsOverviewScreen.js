import React from 'react';
// eslint-disable-next-line no-unused-vars
import { FlatList, Text } from 'react-native';
import { useSelector , useDispatch } from 'react-redux';
import ProductItem from '../../components/shop/ProductItem';
import * as cardActions from '../../store/actions/cart';

// eslint-disable-next-line no-unused-vars
const ProductsOverviewScreen = (props) => {
  const products = useSelector((state) => state.products.availableProducts);
  const dispatch = useDispatch();
  
  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <ProductItem
          imageUrl={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onViewDetail={() => {
            props.navigation.navigate('ProductDetail', {
              productId: itemData.item.id,
              productTitle: itemData.item.title,
            });
          }}
          onAddToCard={() => {
            dispatch(cardActions.addToCart(itemData.item))
          }}
        />
      )}
    />
  );
};

export default ProductsOverviewScreen;
