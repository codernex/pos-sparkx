import {AppDispatch} from "../store";
import {
    FETCH_BUSINESS_ERR,
    FETCH_BUSINESS_LOADING,
    FETCH_BUSINESS_SUCCESS,
    UPDATE_BUSINESS_ERR,
    UPDATE_BUSINESS_LOADING,
    UPDATE_BUSINESS_SUCCESS
} from "../constant";
import api from "../../api";
import {ApiError} from "../types";
import {AxiosError} from "axios";
import {Dispatch} from "@reduxjs/toolkit";
import {BusinessAction} from "../types/business";

export const fetchBusiness = () => async (dispatch: AppDispatch) => {
    dispatch({type: FETCH_BUSINESS_LOADING})
    api.get('/business').then(res => {
        dispatch({type: FETCH_BUSINESS_SUCCESS, payload: res.data})
    }).catch((err: AxiosError<ApiError>) => {
        dispatch({type: FETCH_BUSINESS_ERR, error: err.response?.data})
    })
}

export const updateBusiness = (data: any) => async (dispatch: Dispatch<BusinessAction>) => {
    dispatch({type: UPDATE_BUSINESS_LOADING})
    api.patch(`business`, data).then(res => {
        dispatch({type: UPDATE_BUSINESS_SUCCESS, payload: res.data})
    }).catch((err: AxiosError<ApiError>) => {
        dispatch({type: UPDATE_BUSINESS_ERR, payload: err.response?.data})
    })
}