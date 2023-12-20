import { AxiosError } from "axios";
import api from "../../api";
import { rejectedToast, successToast } from "../../app/utils/toaster";
import { ApiError } from "../types";
import { Dispatch } from "@reduxjs/toolkit";
import { BarcodeActionType } from "../reducer/barcode";

export const printBarcode =
  (data: { startItemCode: string; endItemCode: string }) =>
  async (dispatch: Dispatch<BarcodeActionType>) => {
    dispatch({ type: "PRINT_BARCODE_LOADING" });
    api
      .post("/barcode/generate", data)
      .then((res: { data: Product[] }) => {
        dispatch({ type: "PRINT_BARCODE_SUCCESS", payload: res.data });
      })
      .catch((err: AxiosError<ApiError>) => {
        dispatch({
          type: "PRINT_BARCODE_FAILURE",
        });
        rejectedToast(err);
      });
  };

export const createBarcodeSetting =
  (data: any) => async (dispatch: Dispatch<BarcodeActionType>) => {
    dispatch({ type: "CREATE_BARCODE_LOADING" });
    api
      .post("/barcode", data)
      .then((res) => {
        successToast("Create Barcode Success");
        dispatch({ type: "CREATE_BARCODE_SUCCESS", payload: res.data });
      })
      .catch((err: AxiosError<ApiError>) => {
        dispatch({
          type: "CREATE_BARCODE_FAILURE",
        });
        rejectedToast(err);
      });
  };

export const fetchBarcode =
  () => async (dispatch: Dispatch<BarcodeActionType>) => {
    dispatch({ type: "FETCH_BARCODE_LOADING" });
    api
      .get("/barcode")
      .then((res) => {
        dispatch({ type: "FETCH_BARCODE_SUCCESS", payload: res.data });
      })
      .catch((err: AxiosError<ApiError>) => {
        dispatch({
          type: "FETCH_BARCODE_FAILURE",
        });
      });
  };

export const getDefaultBarcode =
  () => async (dispatch: Dispatch<BarcodeActionType>) => {
    dispatch({ type: "GET_DEFAULT_BARCODE_LOADING" });
    api
      .get("/barcode/default")
      .then((res) => {
        dispatch({ type: "GET_DEFAULT_BARCODE_SUCCESS", payload: res.data });
      })
      .catch((err: AxiosError<ApiError>) => {
        dispatch({
          type: "GET_DEFAULT_BARCODE_FAILURE",
        });
      });
  };
export const setDefaultBarcode =
  (id: number) => async (dispatch: Dispatch<BarcodeActionType>) => {
    dispatch({ type: "SET_DEFAULT_BARCODE_LOADING" });
    api
      .post(`/barcode/default/${id}`)
      .then((res) => {
        successToast("Default Barcode Set Successfully");
        dispatch({ type: "SET_DEFAULT_BARCODE_SUCCESS", payload: res.data });
      })
      .catch((err: AxiosError<ApiError>) => {
        dispatch({
          type: "SET_DEFAULT_BARCODE_FAILURE",
        });
        rejectedToast(err);
      });
  };

export const updateBarcodeSetting =
  (id: number, data: any) => async (dispatch: Dispatch<BarcodeActionType>) => {
    dispatch({ type: "UPDATE_BARCODE_LOADING" });
    api
      .patch(`/barcode/${id}`, data)
      .then((res) => {
        successToast("Barcode Updated Successfully");
        dispatch({ type: "UPDATE_BARCODE_SUCCESS", payload: res.data });
      })
      .catch((err: AxiosError<ApiError>) => {
        dispatch({
          type: "UPDATE_BARCODE_FAILURE",
        });
        rejectedToast(err);
      });
  };
export const deleteBarcodeSetting =
  (id: number) => async (dispatch: Dispatch<BarcodeActionType>) => {
    dispatch({ type: "DELETE_BARCODE_LOADING" });
    api
      .delete(`/barcode/${id}`)
      .then((res) => {
        successToast("Barcode Deleted Successfully");
        dispatch({ type: "DELETE_BARCODE_SUCCESS", payload: res.data });
      })
      .catch((err: AxiosError<ApiError>) => {
        dispatch({
          type: "DELETE_BARCODE_FAILURE",
        });
        rejectedToast(err);
      });
  };
