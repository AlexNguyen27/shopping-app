import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import {
  createDrawerNavigator,
  DrawerNavigatorItems,
} from 'react-navigation-drawer';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { useDispatch } from 'react-redux';
import { Platform, SafeAreaView, Button, View, Image } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import UserProductsScreen from '../screens/user/UserProductsScreen';
import EditProductScreen from '../screens/user/EditProductScreen';
import AuthScreen from '../screens/user/AuthScreen';
import StartupScreen from '../screens/StartupScreen';
import UserInformationScreen from '../screens/user/UserInformationScreen';

import * as authActions from '../store/actions/auth';
import Colors from '../constants/Colors';
import EditUserInfoScreen from '../screens/user/EditUserInfoScreen';

const defaultNavOption = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : '',
  },
  headerTitleStyle: {
    fontFamily: 'open-sans-bold',
    paddingVertical: 15
  },
  headerBackTitleStyle: {
    fontFamily: 'open-sans',
  },
  headerTitleAlign: 'center',
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
};

const ProductsNavigator = createStackNavigator(
  {
    ProductsOverview: ProductsOverviewScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavOption,
  }
);

const OrdersNavigator = createStackNavigator(
  {
    Orders: OrdersScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavOption,
  }
);

const AdminNavigator = createStackNavigator(
  {
    UserProducts: UserProductsScreen,
    EditProduct: EditProductScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <FontAwesome5 name="user-edit" size={21} color={drawerConfig.tintColor} />
        // <Ionicons
        //   name={Platform.OS === 'android' ? 'user-alt' : 'ios-create'}
        //   size={23}
        //   color={drawerConfig.tintColor}
        // />
      ),
    },
    defaultNavigationOptions: defaultNavOption,
  }
);

const UserInformationNavigator = createStackNavigator(
  {
    User: UserInformationScreen,
    EditUserInfo: EditUserInfoScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <FontAwesome5 name="user-alt" size={21} color={drawerConfig.tintColor} />

        // <View style={{ height: 100, top: 0, right: 0, alignItems: 'center', justifyContent: 'center' }}>
        //   <Image source={require('../assets/alex.jpeg')} style={{ width: 100, height: 100 }} resizeMode="center" />
        // </View>
      ),
    },
    defaultNavigationOptions: defaultNavOption,
  }
);

const ShopNavigator = createDrawerNavigator(
  {
    Products: ProductsNavigator,
    Orders: OrdersNavigator,
    Admin: AdminNavigator,
    UserInfo: UserInformationNavigator,
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary,
    },
    contentComponent: (props) => {
      const dispatch = useDispatch();
      return (
        <View style={{ flex: 1, paddingVertical: 20 }}>
          <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
            <DrawerNavigatorItems {...props} />
            <View>
              <Button
                title="Logout"
                color={Colors.primary}
                onPress={() => {
                  dispatch(authActions.logout());
                  // props.navigation.navigate('Auth');
                }}
              />
            </View>
          </SafeAreaView>
        </View>
      );
    },
  }
);

const AuthNavigator = createStackNavigator(
  {
    Auth: AuthScreen,
  },
  {
    defaultNavigationOptions: defaultNavOption,
  }
);

const MainNavigator = createSwitchNavigator({
  Startup: StartupScreen,
  Auth: AuthNavigator,
  Shop: ShopNavigator,
});
export default createAppContainer(MainNavigator);
