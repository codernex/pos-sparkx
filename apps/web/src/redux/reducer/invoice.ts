import { Reducer } from "@reduxjs/toolkit";
import { InvoiceActionType, InvoiceState } from "../types";
import {
  FETCH_INVOICE_ERR,
  FETCH_INVOICE_LOADING,
  FETCH_INVOICE_SUCCESS,
  REMOVE_INVOICE_ERR,
  REMOVE_INVOICE_LOADING,
  REMOVE_INVOICE_SUCCESS,
} from "../constant";

const invoice: Reducer<InvoiceState, InvoiceActionType> = (
  state = {
    invoices: [],
    error: "",
    isLoading: false,
  },
  action
) => {
  switch (action.type) {
    case FETCH_INVOICE_LOADING: {
      return { ...state, isLoading: true };
    }
    case FETCH_INVOICE_SUCCESS: {
      return { ...state, invoices: action.payload, isLoading: false };
    }
    case FETCH_INVOICE_ERR: {
      return { ...state, error: action.payload?.message, isLoading: false };
    }

    case REMOVE_INVOICE_LOADING: {
      return { ...state, isLoading: true };
    }
    case REMOVE_INVOICE_SUCCESS: {
      return { ...state, isLoading: false, invoices: action.payload };
    }
    case REMOVE_INVOICE_ERR: {
      return { ...state, error: action.payload?.message, isLoading: false };
    }

    default:
      return state;
  }
};

export default invoice;
