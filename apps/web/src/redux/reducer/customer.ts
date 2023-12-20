import { Reducer } from "@reduxjs/toolkit";
import { CustomerAction, ICustomerState } from "../types";
import {
  ADD_CUSTOMER_ERR,
  ADD_CUSTOMER_LOADING,
  ADD_CUSTOMER_SUCCESS,
  FETCH_CUSTOMER_ERR,
  FETCH_CUSTOMER_LOADING,
  FETCH_CUSTOMER_SUCCESS,
  REMOVE_CUSTOMER_ERR,
  REMOVE_CUSTOMER_LOADING,
  REMOVE_CUSTOMER_SUCCESS,
  UPDATE_CUSTOMER_ERR,
  UPDATE_CUSTOMER_LOADING,
  UPDATE_CUSTOMER_SUCCESS,
} from "../constant";

const customer: Reducer<ICustomerState, CustomerAction> = (
  state = {
    customers: [],
    isLoading: false,
    error: "",
  },
  action
) => {
  switch (action.type) {
    case ADD_CUSTOMER_LOADING:
      return { ...state, isLoading: true };

    case ADD_CUSTOMER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        customers: [...state.customers, action.payload],
      };

    case ADD_CUSTOMER_ERR:
      return { ...state, isLoading: false, error: action.payload?.message };

    case FETCH_CUSTOMER_LOADING: {
      return { ...state, isLoading: true };
    }
    case FETCH_CUSTOMER_SUCCESS: {
      return { ...state, isLoading: false, customers: action.payload };
    }
    case FETCH_CUSTOMER_ERR: {
      return { ...state, isLoading: false, error: action.payload?.message };
    }
    case UPDATE_CUSTOMER_LOADING: {
      return { ...state, isLoading: true };
    }
    case UPDATE_CUSTOMER_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        customers: state.customers.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    }
    case UPDATE_CUSTOMER_ERR: {
      return { ...state, isLoading: false, error: action.payload?.message };
    }

    case REMOVE_CUSTOMER_LOADING: {
      return { ...state, isLoading: true };
    }

    case REMOVE_CUSTOMER_SUCCESS: {
      return { ...state, isLoading: false, customers: action.payload };
    }

    case REMOVE_CUSTOMER_ERR: {
      return { ...state, isLoading: false, error: action.payload?.message };
    }

    default:
      return state;
  }
};

export default customer;
