import React from 'react';
import {
  FontAwesome,
} from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

import Colors from '../../constants/Colors';

const Star = (props) => {
  return (
    <View style={styles.starContainer}>
      <FontAwesome name="star" style={styles.star} size={24} color="black" />
      <FontAwesome name="star" style={styles.star} size={24} color="black" />
      <FontAwesome name="star" style={styles.star} size={24} color="black" />
      <FontAwesome name="star" style={styles.star} size={24} color="black" />
      <FontAwesome
        name="star-half-empty"
        style={styles.star}
        size={24}
        color="black"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  star: {
    color: Colors.star,
  },
});

export default Star;
