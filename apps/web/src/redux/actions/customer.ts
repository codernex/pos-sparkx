import { AppDispatch } from '../store';
import api from '../../api';
import { rejectedToast, successToast } from '../../app/utils/toaster';
import {
  ADD_CUSTOMER_ERR,
  ADD_CUSTOMER_LOADING,
  ADD_CUSTOMER_SUCCESS,
  FETCH_CUSTOMER_ERR,
  FETCH_CUSTOMER_LOADING,
  FETCH_CUSTOMER_SUCCESS,
  REMOVE_CUSTOMER_ERR,
  REMOVE_CUSTOMER_LOADING,
  REMOVE_CUSTOMER_SUCCESS,
  UPDATE_CUSTOMER_ERR,
  UPDATE_CUSTOMER_LOADING,
  UPDATE_CUSTOMER_SUCCESS
} from '../constant';
import { AxiosError } from 'axios';
import { ApiError } from '../types';
import React from 'react';

export const createCustomer =
  (
    data: any,
    setCustomerPhone?: React.Dispatch<React.SetStateAction<string | null>>
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch({ type: ADD_CUSTOMER_LOADING });
    api
      .post('/customer', data)
      .then(res => {
        successToast('Customer created successfully');
        setCustomerPhone && setCustomerPhone(res.data?.customerPhone);
        dispatch({ type: ADD_CUSTOMER_SUCCESS, payload: res.data });
      })
      .catch((err: AxiosError<ApiError>) => {
        rejectedToast(err);
        dispatch({ type: ADD_CUSTOMER_ERR, payload: err.response?.data });
      });
  };

export const fetchCustomer = () => async (dispatch: AppDispatch) => {
  dispatch({ type: FETCH_CUSTOMER_LOADING });
  api
    .get('/customer')
    .then(res => {
      dispatch({ type: FETCH_CUSTOMER_SUCCESS, payload: res.data });
    })
    .catch((err: AxiosError<ApiError>) => {
      dispatch({ type: FETCH_CUSTOMER_ERR, payload: err.response?.data });
    });
};

export const updateCustomer =
  (data: ICustomer) => async (dispatch: AppDispatch) => {
    dispatch({ type: UPDATE_CUSTOMER_LOADING });
    api
      .patch(`/customer/${data.id}`, data)
      .then(res => {
        successToast('Customer Updated');
        dispatch({ type: UPDATE_CUSTOMER_SUCCESS, payload: res.data });
      })
      .catch((err: AxiosError<ApiError>) => {
        dispatch({ type: UPDATE_CUSTOMER_ERR, payload: err.response?.data });
      });
  };

export const deleteCustomer = (id: number) => async (dispatch: AppDispatch) => {
  dispatch({ type: REMOVE_CUSTOMER_LOADING });
  api
    .delete(`/customer/${id}`)
    .then(res => {
      successToast('Customer Deleted');
      dispatch({ type: REMOVE_CUSTOMER_SUCCESS, payload: res.data });
    })
    .catch((err: AxiosError<ApiError>) => {
      rejectedToast(err);
      dispatch({ type: REMOVE_CUSTOMER_ERR, payload: err.response?.data });
    });
};
