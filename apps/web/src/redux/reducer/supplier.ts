import { Reducer } from "@reduxjs/toolkit";
import {
  ADD_SUPPLIER_ERR,
  ADD_SUPPLIER_LOADING,
  ADD_SUPPLIER_SUCCESS,
  FETCH_SUPPLIER_ERR,
  FETCH_SUPPLIER_LOADING,
  FETCH_SUPPLIER_SUCCESS,
} from "../constant";
import { ISupplierState, SupplierActionType } from "../types";

const supplier: Reducer<ISupplierState, SupplierActionType> = function (
  state = { isLoading: false, suppliers: [], error: null },
  action
) {
  switch (action.type) {
    case ADD_SUPPLIER_LOADING: {
      return { ...state, isLoading: true };
    }
    case ADD_SUPPLIER_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        suppliers: [...state.suppliers, action.payload],
      };
    }
    case ADD_SUPPLIER_ERR: {
      return {
        ...state,
        isLoading: false,
        suppliers: [],
        error: action.payload,
      };
    }

    case FETCH_SUPPLIER_LOADING: {
      return { ...state, isLoading: true, error: null, suppliers: [] };
    }

    case FETCH_SUPPLIER_SUCCESS: {
      return { ...state, suppliers: action.payload, isLoading: false };
    }

    case FETCH_SUPPLIER_ERR: {
      return {
        ...state,
        isLoading: false,
        suppliers: [],
        error: action.payload,
      };
    }

    case "UPDATE_SUPPLIER_LOADING":
      return { ...state, isLoading: true };
    case "UPDATE_SUPPLIER_SUCCESS":
      return {
        ...state,
        isLoading: false,
        suppliers: state.suppliers.map((supplier) =>
          supplier.id === action.payload.id ? action.payload : supplier
        ),
      };
    case "UPDATE_SUPPLIER_ERR":
      return { ...state, isLoading: false };
    case "DELETE_SUPPLIER_LOADING":
      return { ...state, isLoading: true };
    case "DELETE_SUPPLIER_SUCCESS":
      return { ...state, isLoading: false, suppliers: action.payload };
    case "DELETE_SUPPLIER_ERR":
      return { ...state, isLoading: false };

    default:
      return state;
  }
};
export default supplier;
