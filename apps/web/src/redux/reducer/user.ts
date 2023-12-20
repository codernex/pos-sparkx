import { Reducer } from "@reduxjs/toolkit";
import { IUserState, UserActionType } from "../types";

const initialState: IUserState = {
  user: [],
  isLoading: false,
  isError: "",
};
export const user: Reducer<IUserState, UserActionType> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "CREATE_USER_LOADING": {
      return { ...state, isLoading: true };
    }
    case "CREATE_USER_SUCCESS": {
      return {
        ...state,
        isLoading: false,
        isError: "",
        user: [...state.user, action.payload],
      };
    }
    case "CREATE_USER_ERR": {
      return { ...state, isLoading: false, isError: action.payload.message };
    }
    case "FETCH_USER_LOADING": {
      return { ...state, isLoading: true };
    }
    case "FETCH_USER_SUCCESS": {
      return {
        ...state,
        isLoading: false,
        isError: "",
        user: action.payload,
      };
    }
    case "FETCH_USER_ERR": {
      return { ...state, isLoading: false, isError: action.payload.message };
    }
    case "UPDATE_USER_LOADING":
      return { ...state, isLoading: true };
    case "UPDATE_USER_SUCCESS": {
      return {
        ...state,
        isLoading: false,
        user: state.user.map((u) =>
          u.id === action.payload.id ? action.payload : u
        ),
      };
    }
    case "UPDATE_USER_ERR":
      return { ...state, isLoading: false };

    case "DELETE_USER_LOADING":
      return { ...state, isLoading: true };
    case "DELETE_USER_SUCCESS":
      return { ...state, isLoading: false, user: action.payload };
    case "DELETE_USER_ERR": {
      return { ...state, isLoading: false };
    }
    default: {
      return state;
    }
  }
};

export default user;
