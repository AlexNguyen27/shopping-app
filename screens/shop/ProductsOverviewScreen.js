import React from 'react';
// eslint-disable-next-line no-unused-vars
import { FlatList, Text } from 'react-native';
import { useSelector } from 'react-redux';
import ProductItem from '../../components/shop/ProductItem';

// eslint-disable-next-line no-unused-vars
const ProductsOverviewScreen = (props) => {
  const products = useSelector((state) => state.products.availableProducts);

  const onAddToCard = () => {
    props.navigation.navigate({ routeName: 'ProductDetail' });
  };

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
          onAddToCard={onAddToCard}
        />
      )}
    />
  );
};

export default ProductsOverviewScreen;
