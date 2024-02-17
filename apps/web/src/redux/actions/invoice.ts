import { AppDispatch } from "../store";
import {
  FETCH_INVOICE_ERR,
  FETCH_INVOICE_LOADING,
  FETCH_INVOICE_SUCCESS,
} from "../constant";
import api from "../../api";
import { rejectedToast } from "../../app/utils/toaster";
import { AxiosError } from "axios";
import { ApiError } from "../types";

export const getInvoice = () => async (dispatch: AppDispatch) => {
  dispatch({ type: FETCH_INVOICE_LOADING });
  api
    .get(`/invoice`)
    .then((res) =>
      dispatch({
        type: FETCH_INVOICE_SUCCESS,
        payload: res.data,
      })
    )
    .catch((err: AxiosError<ApiError>) => {
      dispatch({
        type: FETCH_INVOICE_ERR,
        payload: err.response?.data.message,
      });
    });
};
export const filterInvoice = (from_date: string, to_date: string, showroom_name: string) => async (dispatch: AppDispatch) => {
    dispatch({type: FETCH_INVOICE_LOADING})
    api.get(`/invoice?from_date=${from_date}&to_date=${to_date}&showroom_name=${showroom_name}`).then(res => dispatch({
        type: FETCH_INVOICE_SUCCESS,
        payload: res.data
    })).catch((err: AxiosError<ApiError>) => {
        dispatch({type: FETCH_INVOICE_ERR, payload: err.response?.data.message})
        rejectedToast(err)
    })
}

