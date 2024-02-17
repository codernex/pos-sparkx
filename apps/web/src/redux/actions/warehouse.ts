import { AxiosError } from "axios";
import api from "../../api";
import { rejectedToast, successToast } from "../../app/utils/toaster";
import {
  ADD_WAREHOUSE_ERR,
  ADD_WAREHOUSE_LOADING,
  ADD_WAREHOUSE_SUCCESS,
  FETCH_WAREHOUSE_ERR,
  FETCH_WAREHOUSE_LOADING,
  FETCH_WAREHOUSE_SUCCESS,
  REMOVE_WAREHOUSE_ERR,
  REMOVE_WAREHOUSE_LOADING,
  REMOVE_WAREHOUSE_SUCCESS,
  UPDATE_WAREHOUSE_ERR,
  UPDATE_WAREHOUSE_LOADING,
  UPDATE_WAREHOUSE_SUCCESS,
} from "../constant";
import { AppDispatch } from "../store";
import { ApiError, Warehouse } from "../types";

export const getWareHouse = () => async (dispatch: AppDispatch) => {
    dispatch({type: FETCH_WAREHOUSE_LOADING});
    api
        .get('/warehouse')
        .then((res: { data: Warehouse[] }) => {
            dispatch({type: FETCH_WAREHOUSE_SUCCESS, payload: res.data});
        })
        .catch((err: AxiosError<ApiError>) => {
            dispatch({
                type: FETCH_WAREHOUSE_ERR
            });
        });
};

export const addWarehouse =
    (data: any) => async (dispatch: AppDispatch) => {
        dispatch({type: ADD_WAREHOUSE_LOADING});
        api
            .post('/warehouse', data)
            .then((res: { data: Warehouse }) => {
                dispatch({type: ADD_WAREHOUSE_SUCCESS, payload: res.data})
                successToast('warehouse added success');
            })
            .catch((err: AxiosError<ApiError>) => {
                dispatch({
                    type: ADD_WAREHOUSE_ERR
                });
                rejectedToast(err);
            });
    };


export const updateWarehouse = (data: Warehouse) => async (dispatch: AppDispatch) => {
    dispatch({type: UPDATE_WAREHOUSE_LOADING})
    api.patch(`/warehouse/${data.whId}`, data).then(res => {
        successToast('Location Updated')
        dispatch({type: UPDATE_WAREHOUSE_SUCCESS, payload: res.data})
    }).catch((err: AxiosError<ApiError>) => {
        dispatch({type: UPDATE_WAREHOUSE_ERR})
        rejectedToast(err)
    })
}

export const deleteWarehouse = (id: number) => async (dispatch: AppDispatch) => {
    dispatch({type: REMOVE_WAREHOUSE_LOADING})
    api.delete(`/warehouse/${id}`).then(res => {
        successToast('Location Removed')
        dispatch({type: REMOVE_WAREHOUSE_SUCCESS, payload: res.data})
    }).catch((err: AxiosError<ApiError>) => {
        dispatch({type: REMOVE_WAREHOUSE_ERR})
        rejectedToast(err)
    })
}