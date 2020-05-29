import React from 'react';
import { StyleSheet, StatusBar as StatusBarCore, Platform, View } from 'react-native';
import Colors from '../../constants/Colors';

const StatusBar = (props) => {
  return (
    <View style={styles.container}>
      <StatusBarCore translucent backgroundColor={props.color ? props.color : Colors.statusBar} barStyle="dark-content" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === 'ios' ? 20 : 0
  }
});

export default StatusBar;
