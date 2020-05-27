import React, { useCallback, useEffect, useReducer, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import Input from '../../components/UI/Input';
import HeaderButton from '../../components/UI/HeaderButton';
import * as userActions from '../../store/actions/user';
import Colors from '../../constants/Colors';

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

const EditUserInfoScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const userId = props.navigation.getParam('userId');
  const userInfo = useSelector((state) => state.user.user);

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      firstName: userInfo ? userInfo.firstName : '',
      lastName: userInfo ? userInfo.lastName : '',
      phone: userInfo ? userInfo.phone : '',
      address: userInfo ? userInfo.address : '',
      profileUrl: userInfo ? userInfo.profileUrl : '',
      description: userInfo ? userInfo.description : ''
    },
    inputValidities: {
      firstName: !!userInfo,
      lastName: !!userInfo,
      phone: !!userInfo,
      address: !!userInfo,
      profileUrl: !!userInfo,
      description: !!userInfo
    },
    formIsValid: !!userInfo,
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error.message, [{ text: 'Okay' }]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong Input!', 'Please check input of the form!', [
        { text: 'OK' },
      ]);
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      // console.log(formState.inputValues);
      await dispatch(
        userActions.updateUser(formState.inputValues)
      );
      props.navigation.goBack();
    } catch (err) {
      setError(err);
    }

    setIsLoading(false);
  }, [userId, formState, dispatch]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

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

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View style={styles.form}>
          <Input
            id="firstName"
            label="First name"
            initialValue={userInfo ? userInfo.firstName : ''}
            initialValid={!!userInfo}
            onInputChange={inputChangeHandler}
            errorText="Please enter a valid name!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            required
          />
          <Input
            id="lastName"
            label="Last name"
            initialValue={userInfo ? userInfo.lastName : ''}
            initialValid={!!userInfo}
            onInputChange={inputChangeHandler}
            errorText="Please enter a valid name!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            required
          />
          <Input
            id="profileUrl"
            label="Profile Url"
            initialValue={userInfo ? userInfo.profileUrl : ''}
            initialValid={!!userInfo}
            onInputChange={inputChangeHandler}
            errorText="Please enter a valid profileUrl!"
            keyboardType="default"
            returnKeyType="next"
            required
          />
          <Input
            id="phone"
            label="Phone"
            initialValue={userInfo ? userInfo.phone : ''}
            initialValid={!!userInfo}
            onInputChange={inputChangeHandler}
            errorText="Please enter a valid phone!"
            keyboardType="decimal-pad"
            returnKeyType="next"
            min={0.1}
          />
          <Input
            id="address"
            label="Address"
            initialValue={userInfo ? userInfo.address : ''}
            initialValid={!!userInfo}
            onInputChange={inputChangeHandler}
            errorText="Please enter a valid address!"
            keyboardType="default"
            autoCapitalize="sentences"
            returnKeyType="next"
            required
          />
          <Input
            id="description"
            label="Description"
            initialValue={userInfo ? userInfo.description : ''}
            initialValid={!!userInfo}
            onInputChange={inputChangeHandler}
            errorText="Please enter a valid description!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            multiline
            numberOfLines={3}
            required
            minLength={5}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditUserInfoScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam('submit');
  return {
    headerTitle: 'Edit Your Info',
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
          }
          onPress={submitFn}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditUserInfoScreen;
