import { Reducer } from "@reduxjs/toolkit";

interface IHoldInvoiceState {
  holds: HoldInvoice[];
  isLoading: boolean;
}

interface CreateHoldLoading {
  type: "CREATE_HOLD_LOADING";
}

interface CreateHoldSucccess {
  type: "CREATE_HOLD_SUCCESS";
  payload: HoldInvoice;
}

interface CreateHoldErr {
  type: "CREATE_HOLD_ERR";
}

interface FetchHoldLoading {
  type: "FETCH_HOLD_LOADING";
}

interface FetchHoldSucccess {
  type: "FETCH_HOLD_SUCCESS";
  payload: HoldInvoice[];
}

interface FetchHoldErr {
  type: "FETCH_HOLD_ERR";
}

interface RemoveHoldLoading {
  type: "REMOVE_HOLD_LOADING";
}
interface RemoveHoldSucces {
  type: "REMOVE_HOLD_SUCCESS";
  payload: HoldInvoice[];
}
interface RemoveHoldErr {
  type: "REMOVE_HOLD_ERR";
}

export type IHoldInvoiceActions =
  | CreateHoldLoading
  | CreateHoldSucccess
  | CreateHoldErr
  | FetchHoldLoading
  | FetchHoldSucccess
  | FetchHoldErr
  | RemoveHoldLoading
  | RemoveHoldSucces
  | RemoveHoldErr;

export const hold: Reducer<IHoldInvoiceState, IHoldInvoiceActions> = (
  state = { holds: [], isLoading: false },
  action
) => {
  switch (action.type) {
    case "CREATE_HOLD_LOADING":
      return { ...state, isLoading: true };
    case "CREATE_HOLD_SUCCESS":
      return {
        ...state,
        isLoading: false,
        holds: [...state.holds, action.payload],
      };
    case "CREATE_HOLD_ERR":
      return { ...state, isLoading: false };
    case "FETCH_HOLD_LOADING":
      return { ...state, isLoading: true };
    case "FETCH_HOLD_SUCCESS":
      return {
        ...state,
        isLoading: false,
        holds: action.payload,
      };
    case "FETCH_HOLD_ERR":
      return { ...state, isLoading: false };

    case "REMOVE_HOLD_LOADING":
      return { ...state, isLoading: true };
    case "REMOVE_HOLD_SUCCESS":
      return { ...state, isLoading: false, holds: action.payload };
    case "REMOVE_HOLD_ERR":
      return { ...state, isLoading: false };
    default:
      return state;
  }
};
