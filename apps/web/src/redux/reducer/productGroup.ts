import { Reducer } from "@reduxjs/toolkit";
import {
  ADD_PRODUCT_GROUP_ERR,
  ADD_PRODUCT_GROUP_LOADING,
  ADD_PRODUCT_GROUP_SUCCESS,
  FETCH_PRODUCT_GROUP_ERR,
  FETCH_PRODUCT_GROUP_LOADING,
  FETCH_PRODUCT_GROUP_SUCCESS,
} from "../constant";
import { IProductGState, ProductGroupAction } from "../types";

const productGroup: Reducer<IProductGState, ProductGroupAction> = (
  state = { isLoading: false, productGroup: [] },
  action
) => {
  switch (action.type) {
    case ADD_PRODUCT_GROUP_LOADING:
      return { ...state, isLoading: true };

    case ADD_PRODUCT_GROUP_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        productGroup: [...state.productGroup, action.payload],
      };
    }

    case ADD_PRODUCT_GROUP_ERR: {
      return { ...state, isLoading: false };
    }

    case FETCH_PRODUCT_GROUP_LOADING: {
      return { ...state, isLoading: true };
    }

    case FETCH_PRODUCT_GROUP_SUCCESS: {
      return { ...state, isLoading: false, productGroup: action.payload };
    }

    case FETCH_PRODUCT_GROUP_ERR: {
      return { ...state, isLoading: false };
    }
    default:
      return state;
  }
};

export default productGroup;
