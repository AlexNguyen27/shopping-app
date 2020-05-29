import React, { useCallback, useEffect, useReducer, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
  Button
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';

import Input from '../../components/UI/Input';
import HeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';
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

const EditProductScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const prodId = props.navigation.getParam('productId');
  const editedProduct = useSelector((state) =>
    state.products.userProducts.find((prod) => prod.id === prodId));

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : '',
      imageUrl: editedProduct ? editedProduct.imageUrl : '',
      description: editedProduct ? editedProduct.description : '',
      price: '',
    },
    inputValidities: {
      title: !!editedProduct,
      imageUrl: !!editedProduct,
      description: !!editedProduct,
      price: !!editedProduct,
    },
    formIsValid: !!editedProduct,
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
    const { title, description, imageUrl, price } = formState.inputValues;
    try {
      if (editedProduct) {
        await dispatch(
          productsActions.updateProduct(prodId, title, description, imageUrl)
        );
      } else {
        await dispatch(
          productsActions.createProduct(title, description, imageUrl, +price)
        );
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err);
    }

    setIsLoading(false);
  }, [prodId, formState, dispatch]);

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

  const onChooseImagePress = async () => {
    // const result = await ImagePicker.launchCameraAsync();
    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.cancelled) {
      const { uri } = result;
      const imageName = uri.split('/').pop();

      setIsLoading(true);
      uploadImage(uri, imageName)
        .then(async () => {
          Alert.alert('Success', 'Image uploaded successfully', [
            { text: 'OK' },
          ]);

          getImageUrl(imageName);
          setIsLoading(false);
        })
        .catch((err) => {
          Alert.alert('An error occurred', err.message, [
            { text: 'OK' }
          ]);
        });
    }
  };

  const uploadImage = async (uri, imageName) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const ref = firebase.storage().ref().child(`images/${imageName}`);
      return ref.put(blob);
    } catch (err) {
      throw err;
    }
  };
  const getImageUrl = async (imageName) => {
    try {
      const ref = firebase.storage().ref(`images/${imageName}`);
      const url = await ref.getDownloadURL();

      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: url,
        isValid: true,
        input: 'imageUrl',
      });
    } catch (err) {
      setError(err);
    }
  };
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
            id="title"
            label="Title"
            initialValue={editedProduct ? editedProduct.title : ''}
            initialValid={!!editedProduct}
            onInputChange={inputChangeHandler}
            errorText="Please enter a valid title!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            required
          />
          <Input
            id="imageUrl"
            label="ImageURL"
            initialValue={editedProduct ? editedProduct.imageUrl : ''}
            initialValid={!!editedProduct}
            onInputChange={inputChangeHandler}
            errorText="Please enter a valid imageUrl!"
            keyboardType="default"
            returnKeyType="next"
            // required
            editable={false}
          />
          <Button color={Colors.primary} title="Choose image..." onPress={onChooseImagePress} />
          {editedProduct ? null : (
            <Input
              id="price"
              label="Price"
              initialValue={editedProduct ? editedProduct.price : ''}
              initialValid={!!editedProduct}
              onInputChange={inputChangeHandler}
              errorText="Please enter a valid price!"
              keyboardType="decimal-pad"
              returnKeyType="next"
              min={0.1}
            />
          )}
          <Input
            id="description"
            label="Description"
            initialValue={editedProduct ? editedProduct.description : ''}
            initialValid={!!editedProduct}
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

EditProductScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam('submit');
  return {
    headerTitle: navData.navigation.getParam('productId')
      ? 'Edit Product'
      : 'Add Product',
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

export default EditProductScreen;
