import { AxiosError } from "axios";
import api from "../../api";
import { rejectedToast, successToast } from "../../app/utils/toaster";
import {
  ADD_PRODUCT_GROUP_LOADING,
  ADD_PRODUCT_GROUP_SUCCESS,
  FETCH_PRODUCT_GROUP_ERR,
  FETCH_PRODUCT_GROUP_SUCCESS,
} from "../constant";
import { AppDispatch } from "../store";
import { ApiError, CreateFN, ProductGroup } from "../types";

export const getProductGroup = () => async (dispatch: AppDispatch) => {
  dispatch({ type: FETCH_PRODUCT_GROUP_ERR });
  api
    .get('/product/group')
    .then((res: { data: ProductGroup }) => {
      dispatch({ type: FETCH_PRODUCT_GROUP_SUCCESS, payload: res.data });
    })
    .catch((err: AxiosError<ApiError>) => {
      dispatch({ type: FETCH_PRODUCT_GROUP_ERR });
    });
};

export const createProductGroup: CreateFN<ProductGroup> =
  (data, reset) => async (dispatch: AppDispatch) => {
    dispatch({ type: ADD_PRODUCT_GROUP_LOADING });
    api
      .post('/product/group', data)
      .then((res: { data: ProductGroup }) => {
        successToast('Product Group successfully created');
        dispatch({ type: ADD_PRODUCT_GROUP_SUCCESS, payload: res.data });
        reset();
      })
      .catch((err: AxiosError<ApiError>) => {
        rejectedToast(err);
      });
  };
