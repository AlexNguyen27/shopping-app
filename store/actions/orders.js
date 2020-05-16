import Order from '../../models/order';

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

export const baseURL = 'https://shopping-app-e51f6.firebaseio.com';

export const fetchOrders = () => async (dispatch) => {
  try {
    const res = await fetch(`${baseURL}/orders/u1.json`);

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

export const addOrder = (cartItems, totalAmount) => async (dispatch) => {
  const date = new Date();

  const res = await fetch(`${baseURL}/orders/u1.json`, {
    method: 'POST',
    headers: {
      'Context-Type': 'application/json',
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
