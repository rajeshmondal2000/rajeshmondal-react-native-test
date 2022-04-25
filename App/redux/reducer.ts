import { combineReducers } from "redux";

interface ActionI {
  type: string;
  payload: any;
}

const initialState = {
  products: [],
};

function productReducer(state = initialState, action: ActionI) {
  switch (action.type) {
    case "FETCH_PRODUCTS":
      state = {
        ...state,
        products: action.payload,
      };
      return state;

    default:
      return state;
  }
}

export default combineReducers({ products: productReducer });
