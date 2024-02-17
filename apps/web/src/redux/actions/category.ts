import api from "../../api";
import { rejectedToast, successToast } from "../../app/utils/toaster";
import {
  CREATE_CATEGORY_SUCCESS,
  FETCH_CATEGORY_ERR,
  FETCH_CATEGORY_SUCCESS,
} from "../constant";
import { AppDispatch } from "../store";
import { Category, CreateFN } from "../types";

export const createCat: CreateFN<Category> =
  (data, reset, navigate) => async (dispatch: AppDispatch) => {
    api
      .post('/product/category', data)
      .then((res: { data: Category }) => {
        dispatch({
          type: CREATE_CATEGORY_SUCCESS,
          payload: res.data
        });
        successToast('Category Created Successfully');
        reset();
      })
      .catch(err => {
        if (err.response.data.message) {
          rejectedToast(err.response.data.message);
        } else {
          rejectedToast(err.message);
        }
      });
  };

export const getCat = () => async (dispatch: AppDispatch) => {
  api
    .get('/product/category')
    .then((res: { data: Category[] }) => {
      dispatch({ type: FETCH_CATEGORY_SUCCESS, payload: res.data });
    })
    .catch(err => {
        dispatch({type:FETCH_CATEGORY_ERR})
    });
};
