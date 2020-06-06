import React, { useReducer, useEffect, useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  View,
  Button,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';

import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import StatusBar from '../../components/UI/StatusBar';
import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const { input, isValid, value } = action;
    const updatedValues = {
      ...state.inputValues,
      [input]: value,
    };

    const updatedValidities = {
      ...state.updatedValidities,
      [input]: isValid,
    };

    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }

    return {
      inputValues: updatedValues,
      inputValidities: updatedValidities,
      formIsValid: updatedFormIsValid,
    };
  }

  return state;
};

const AuthScreen = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState();
  const imageAnimated = new Animated.Value(-500);
  const authInputAnimated = new Animated.Value(-1000);

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: '',
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });

  useEffect(() => {
    Animated.timing(imageAnimated,
      {
        toValue: 0, // from value 0 to 100
        friction: 10,
        duration: 1000 // time running
      }).start();

    Animated.timing(authInputAnimated,
      {
        toValue: 0, // from value 0 to 100
        friction: 10,
        duration: 1000 // time running
      }).start();
  }, []);
  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred!', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  const authHandler = async () => {
    let action;
    const { email, password } = formState.inputValues;
    // const email = 'thanhnguyen.tnn55@gmail.com';
    // const password = '123456';
    if (isSignup) {
      action = authActions.signup(email, password);
    } else {
      action = authActions.login(email, password);
    }

    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
      props.navigation.navigate('Shop');
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.screen}
    >
      <StatusBar />

      <LinearGradient colors={[Colors.linear1, Colors.linear2, Colors.linear3, Colors.linear4]} style={styles.gradient}>
        <Animated.View style={{ marginTop: imageAnimated }}>
          <Image source={require('../../assets/logotrans.png')} style={styles.image} resizeMode="center" />
        </Animated.View>
        <Animated.View style={[styles.authContainer, { left: authInputAnimated }]}>
          <Card style={{ padding: 20, width: 280}}>
            <ScrollView>
              <Input
                id="email"
                label="E-mail"
                keyboardType="email-address"
                required
                email
                autoCapitalize="none"
                errorText="Please enter a valid email address!"
                onInputChange={inputChangeHandler}
                initialValue=""
                returnKeyType="next"
              />
              <Input
                id="password"
                label="Password"
                keyboardType="default"
                secureTextEntry
                required
                minLength={5}
                autoCapitalize="none"
                errorText="Please enter a valid password!"
                onInputChange={inputChangeHandler}
                initialValue=""
                returnKeyType="next"
              />
              <View style={styles.btnContainer}>
                {isLoading ? (
                  <ActivityIndicator size="large" color={Colors.primary} />
                ) : (
                  <Button
                    title={isSignup ? 'Sign Up' : 'Login'}
                    color={Colors.primary}
                    onPress={authHandler}
                  />
                )}
              </View>
              <View style={styles.btnContainer}>
                <Button
                  title={`Switch to ${isSignup ? 'Login' : 'Sign Up'}`}
                  color={Colors.accent}
                  onPress={() => setIsSignup((prevState) => !prevState)}
                />
              </View>
            </ScrollView>
          </Card>
        </Animated.View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

AuthScreen.navigationOptions = {
  headerShown: false
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authContainer: {
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  btnContainer: {
    marginTop: 13,
  },
  welcomeContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  welcome: {
    fontFamily: 'open-sans-bold',
    fontSize: 20,
  },
  continue: {
    fontFamily: 'open-sans',
    fontSize: 15,
  },
  image: {
    width: 400,
    height: 250,
  }
});

export default AuthScreen;
