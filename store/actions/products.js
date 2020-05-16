import Product from '../../models/product';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const baseURL = 'https://shopping-app-e51f6.firebaseio.com';

export const fetchProducts = () => async (dispatch) => {
  try {
    const res = await fetch(`${baseURL}/products.json`);

    if (!res.ok) {
      throw new Error('Something when wrong!');
    }

    const resData = await res.json();

    const loadedProducts = [];

    Object.keys(resData).map((key) => {
      return loadedProducts.push(
        new Product(
          key,
          'u1',
          resData[key].title,
          resData[key].imageUrl,
          resData[key].description,
          resData[key].price
        )
      );
    });
    dispatch({ type: SET_PRODUCTS, products: loadedProducts });
  } catch (err) {
    throw err;
  }
};

export const deleteProduct = (productId) => async (dispatch) => {
  const res = await fetch(`${baseURL}/products/${productId}.json`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Something when wrong!');
  }

  dispatch({
    type: DELETE_PRODUCT,
    pid: productId,
  });
};

export const createProduct = (title, description, imageUrl, price) => async (
  dispatch
) => {
  const res = await fetch(`${baseURL}/products.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      description,
      imageUrl,
      price,
    }),
  });

  if (!res.ok) {
    throw new Error('Something when wrong!');
  }

  const resData = await res.json();

  dispatch({
    type: CREATE_PRODUCT,
    productData: {
      id: resData.name,
      title,
      description,
      imageUrl,
      price,
    },
  });
};

export const updateProduct = (id, title, description, imageUrl) => async (
  dispatch
) => {
  const res = await fetch(`${baseURL}/products/${id}.json`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      description,
      imageUrl,
    }),
  });

  if (!res.ok) {
    throw new Error('Something when wrong!');
  }
  dispatch({
    type: UPDATE_PRODUCT,
    pid: id,
    productData: {
      title,
      description,
      imageUrl,
    },
  });
};
