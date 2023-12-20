import { Reducer } from "@reduxjs/toolkit";
import { CREATE_CATEGORY_SUCCESS, FETCH_CATEGORY_SUCCESS } from "../constant";
import { CatActionType, ICatState } from "../types";
const category: Reducer<ICatState, CatActionType> = function (
  state = { isLoading: false, categories: [] },
  action
) {
  switch (action.type) {
    case FETCH_CATEGORY_SUCCESS: {
      return { ...state, categories: action.payload, isLoading: false };
    }

    case CREATE_CATEGORY_SUCCESS: {
      return {
        ...state,
        categories: [...state.categories, action.payload],
        isLoading: false,
      };
    }

    default:
      return state;
  }
};

export default category;
