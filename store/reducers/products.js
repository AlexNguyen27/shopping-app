import PRODUCTS from '../../data/dummy-data';

const initialState = {
  availableProducts: PRODUCTS,
  userProducts: PRODUCTS.filter((prod) => prod.owner === 'u1'),
};

// eslint-disable-next-line no-unused-vars
export default (state = initialState, action) => {
  return state;
};
