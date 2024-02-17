import {Dispatch} from "@reduxjs/toolkit";
import {BrandAction} from "../reducer/brand";
import api from "../../api";
import {rejectedToast, successToast} from "../../app/utils/toaster";
import {AxiosError} from "axios";
import {ApiError} from "../types";

export const createBrand = (data: any) => async (dispatch: Dispatch<BrandAction>) => {
    dispatch({type: 'CREATE_BRAND_LOADING'})
    api.post('/brands', data).then(res => {
        successToast('Create brand success!')
        dispatch({type: 'CREATE_BRAND_SUCCESS', payload: res.data})
    }).catch((err: AxiosError<ApiError>) => {
        dispatch({type: 'CREATE_BRAND_FAILURE', payload: err.response?.data})
        rejectedToast(err)
    })
}

export const getBrand = () => async (dispatch: Dispatch<BrandAction>) => {
    dispatch({type: 'FETCH_BRANDS_LOADING'})
    api.get('/brands').then(res => {
        dispatch({type: 'FETCH_BRANDS_SUCCESS', payload: res.data})
    }).catch((err: AxiosError<ApiError>) => {
        dispatch({type: 'FETCH_BRANDS_FAILURE', payload: err.response?.data})
    })
}
export const updateBrand = (id: number, data: any) => async (dispatch: Dispatch<BrandAction>) => {
    dispatch({type: 'UPDATE_BRAND_LOADING'})
    api.patch(`/brands/${id}`, data).then(res => {
        successToast('Update brand success!')
        dispatch({type: 'UPDATE_BRAND_SUCCESS', payload: res.data})
    }).catch((err: AxiosError<ApiError>) => {
        dispatch({type: 'UPDATE_BRAND_FAILURE', payload: err.response?.data})
        rejectedToast(err)
    })
}
export const deleteBrand = (id: number) => async (dispatch: Dispatch<BrandAction>) => {
    dispatch({type: 'DELETE_BRAND_LOADING'})
    api.delete(`/brands/${id}`).then(res => {
        successToast('Delete brand success!')
        dispatch({type: 'DELETE_BRAND_SUCCESS', payload: res.data})
    }).catch((err: AxiosError<ApiError>) => {
        dispatch({type: 'DELETE_BRAND_FAILURE', payload: err.response?.data})
        rejectedToast(err)
    })
}

