import Order from '../../models/order';

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

export const baseURL = 'https://shopping-app-e51f6.firebaseio.com';

export const fetchOrders = () => async (dispatch, getState) => {
  try {
    const { userId } = getState().auth;
    const res = await fetch(`${baseURL}/orders/${userId}.json`);

    if (!res.ok) {
      throw new Error('Something when wrong!');
    }
    const resData = await res.json();

    const loadedOrders = [];

    Object.keys(resData).map((key) => {
      return loadedOrders.push(
        new Order(
          key,
          resData[key].cartItems,
          resData[key].totalAmount,
          new Date(resData[key].date)
        )
      );
    });

    dispatch({
      type: SET_ORDERS,
      orders: loadedOrders,
    });
  } catch (err) {
    throw err;
  }
};

export const addOrder = (cartItems, totalAmount) => async (dispatch, getState) => {
  const date = new Date();

  const { token, userId } = getState().auth;
  const res = await fetch(`${baseURL}/orders/${userId}.json?auth=${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cartItems,
      totalAmount,
      date: date.toISOString(),
    }),
  });

  if (!res.ok) {
    throw new Error('Something when wrong!');
  }

  const resData = await res.json();

  dispatch({
    type: ADD_ORDER,
    orderData: {
      id: resData.name,
      items: cartItems,
      amount: totalAmount,
      date,
    },
  });
};
