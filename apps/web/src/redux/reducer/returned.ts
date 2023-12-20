import { Reducer } from "@reduxjs/toolkit";

interface ReturnedState {
  returned: IReturned[];
  isLoading: boolean;
}

interface FetchReturnedLoading {
  type: "FETCH_RETURNED_LOADING";
}
interface FetchReturnedSuccess {
  type: "FETCH_RETURNED_SUCCESS";
  payload: IReturned[];
}

interface FetchReturnedErr {
  type: "FETCH_RETURNED_ERR";
}

export type ReturnedActionType =
  | FetchReturnedLoading
  | FetchReturnedSuccess
  | FetchReturnedErr;
const returned: Reducer<ReturnedState, ReturnedActionType> = (
  state = { returned: [], isLoading: false },
  action
) => {
  switch (action.type) {
    case "FETCH_RETURNED_LOADING":
      return { ...state, isLoading: true };

    case "FETCH_RETURNED_SUCCESS":
      return { ...state, isLoading: false, returned: action.payload };

    case "FETCH_RETURNED_ERR":
      return { ...state, isLoading: false };
    default:
      return state;
  }
};

export default returned;
