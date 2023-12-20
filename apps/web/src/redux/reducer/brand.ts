import { Reducer } from "@reduxjs/toolkit";
import { ApiError } from "../types";

interface BrandState {
  brands: IBrand[];
  isLoading: boolean;
  error: string | undefined;
}

interface CreateBrandLoading {
  type: "CREATE_BRAND_LOADING";
}

interface CreateBrandSuccess {
  type: "CREATE_BRAND_SUCCESS";
  payload: IBrand;
}

interface CreateBrandFailure {
  type: "CREATE_BRAND_FAILURE";
  payload: ApiError | undefined;
}

interface FetchBrandsLoading {
  type: "FETCH_BRANDS_LOADING";
}

interface FetchBrandsSuccess {
  type: "FETCH_BRANDS_SUCCESS";
  payload: IBrand[];
}

interface UpdateBrandLoading {
  type: "UPDATE_BRAND_LOADING";
}

interface UpdateBrandSuccess {
  type: "UPDATE_BRAND_SUCCESS";
  payload: IBrand;
}

interface UpdateBrandFailure {
  type: "UPDATE_BRAND_FAILURE";
  payload: ApiError | undefined;
}

interface DeleteBrandLoading {
  type: "DELETE_BRAND_LOADING";
}

interface DeleteBrandSuccess {
  type: "DELETE_BRAND_SUCCESS";
  payload: IBrand[];
}

interface DeleteBrandFailure {
  type: "DELETE_BRAND_FAILURE";
  payload: ApiError | undefined;
}

interface FetchBrandsFailure {
  type: "FETCH_BRANDS_FAILURE";
  payload: ApiError | undefined;
}

export type BrandAction =
  | CreateBrandLoading
  | CreateBrandFailure
  | CreateBrandSuccess
  | FetchBrandsLoading
  | FetchBrandsSuccess
  | FetchBrandsFailure
  | UpdateBrandLoading
  | UpdateBrandSuccess
  | UpdateBrandFailure
  | DeleteBrandLoading
  | DeleteBrandSuccess
  | DeleteBrandFailure;

const brand: Reducer<BrandState, BrandAction> = (
  state = { brands: [], error: "", isLoading: false },
  action
) => {
  switch (action.type) {
    case "CREATE_BRAND_LOADING":
      return { ...state, isLoading: true };
    case "CREATE_BRAND_SUCCESS":
      return {
        ...state,
        isLoading: false,
        brands: [...state.brands, action.payload],
      };
    case "CREATE_BRAND_FAILURE":
      return { ...state, isLoading: false, error: action.payload?.message };
    case "FETCH_BRANDS_LOADING":
      return { ...state, isLoading: true };
    case "FETCH_BRANDS_SUCCESS":
      return { ...state, isLoading: false, brands: action.payload };
    case "FETCH_BRANDS_FAILURE":
      return { ...state, isLoading: false, error: action.payload?.message };
    case "UPDATE_BRAND_LOADING":
      return { ...state, isLoading: true };
    case "UPDATE_BRAND_SUCCESS":
      return {
        ...state,
        isLoading: false,
        brands: state.brands.map((brand) =>
          brand.id === action.payload.id ? action.payload : brand
        ),
      };
    case "UPDATE_BRAND_FAILURE":
      return { ...state, isLoading: false, error: action.payload?.message };
    case "DELETE_BRAND_LOADING":
      return { ...state, isLoading: true };
    case "DELETE_BRAND_SUCCESS":
      return {
        ...state,
        isLoading: false,
        brands: action.payload,
      };
    case "DELETE_BRAND_FAILURE":
      return { ...state, isLoading: false, error: action.payload?.message };

    default:
      return state;
  }
};

export default brand;
