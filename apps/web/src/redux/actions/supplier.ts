import { AxiosError } from "axios";
import { NavigateFunction } from "react-router-dom";
import api from "../../api";
import { rejectedToast, successToast } from "../../app/utils/toaster";
import {
  ADD_SUPPLIER_ERR,
  ADD_SUPPLIER_LOADING,
  ADD_SUPPLIER_SUCCESS,
  FETCH_SUPPLIER_ERR,
  FETCH_SUPPLIER_LOADING,
  FETCH_SUPPLIER_SUCCESS,
} from "../constant";
import { AppDispatch } from "../store";
import { ApiError, SupplierActionType } from "../types";
import { Dispatch } from "@reduxjs/toolkit";

export const addSupplier =
  (data: any, reset: Function, navigate: NavigateFunction) =>
  async (dispatch: AppDispatch) => {
    dispatch({ type: ADD_SUPPLIER_LOADING });
    api
      .post("/supplier", data)
      .then((res) => {
        successToast("Supplier Added");
        dispatch({ type: ADD_SUPPLIER_SUCCESS, payload: res.data });
        reset();
        // navigate('/supplier', { replace: true });
      })
      .catch((err: AxiosError<ApiError>) => {
        dispatch({ type: ADD_SUPPLIER_ERR, payload: err.message });
        rejectedToast(err);
      });
  };

export const getSupplier = () => async (dispatch: AppDispatch) => {
  dispatch({ type: FETCH_SUPPLIER_LOADING });
  api
    .get("/supplier")
    .then((res: { data: Supplier[] }) => {
      dispatch({
        type: FETCH_SUPPLIER_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err: AxiosError<ApiError>) => {
      dispatch({ type: FETCH_SUPPLIER_ERR, payload: err.message });
    });
};

export const updateSupplier =
  (id: number, data: any) => async (dispatch: Dispatch<SupplierActionType>) => {
    dispatch({ type: "UPDATE_SUPPLIER_LOADING" });
    api
      .patch(`/supplier/${id}`, data)
      .then((res) => {
        successToast("Supplier Updated");
        dispatch({ type: "UPDATE_SUPPLIER_SUCCESS", payload: res.data });
      })
      .catch((err: AxiosError<ApiError>) => {
        dispatch({ type: "UPDATE_SUPPLIER_ERR" });
        rejectedToast(err);
      });
  };


export const deleteSupplier =(id:number)=>async (dispatch: Dispatch<SupplierActionType>)=>{
    dispatch({type:'DELETE_SUPPLIER_LOADING'})
    api.delete(`/supplier/${id}`)
        .then(res=>{
            dispatch({type:'DELETE_SUPPLIER_SUCCESS',payload:res.data})
            successToast('Supplier Deleted');
        })
        .catch(err=>{
            dispatch({type:'DELETE_SUPPLIER_ERR'})
            rejectedToast(err)
        })
}