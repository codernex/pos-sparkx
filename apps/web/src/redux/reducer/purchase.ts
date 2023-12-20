import { Reducer } from "@reduxjs/toolkit";

interface PurchaseState {
  purchases: Purchase[];
  isLoading: boolean;
}

interface FetchPurchaseLoading {
  type: "FETCH_PURCHASE_LOADING";
}

interface FetchPurchaseSuccess {
  type: "FETCH_PURCHASE_SUCCESS";
  payload: Purchase[];
}

interface FetchPurchaseErr {
  type: "FETCH_PURCHASE_ERR";
}

export type PurchaseActionType =
  | FetchPurchaseLoading
  | FetchPurchaseSuccess
  | FetchPurchaseErr;

const purchase: Reducer<PurchaseState, PurchaseActionType> = (
  state = { isLoading: false, purchases: [] },
  action
) => {
  switch (action.type) {
    case "FETCH_PURCHASE_LOADING":
      return { ...state, isLoading: true };

    case "FETCH_PURCHASE_SUCCESS":
      return { ...state, isLoading: false, purchases: action.payload };

    case "FETCH_PURCHASE_ERR":
      return { ...state, isLoading: false };

    default:
      return state;
  }
};

export default purchase;
