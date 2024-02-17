import { Dispatch } from '@reduxjs/toolkit';
import { TaxActionTypes } from '../reducer/tax';
import api from '../../api';
import { AxiosError } from 'axios';
import { ApiError } from '../types';
import { toast } from 'react-toastify';
import { rejectedToast } from '../../app/utils/toaster';
import success = toast.success;

export const fetchTax = () => async (dispatch: Dispatch<TaxActionTypes>) => {
  dispatch({ type: 'FETCH_TAX_LOADING' });
  api
    .get('/tax')
    .then(res => {
      dispatch({ type: 'FETCH_TAX_SUCCESS', payload: res.data });
    })
    .catch((err: AxiosError<ApiError>) => {
      dispatch({ type: 'FETCH_TAX_FAILURE', payload: err.response?.data });
    });
};

export const createTax =
  (data: any) => async (dispatch: Dispatch<TaxActionTypes>) => {
    dispatch({ type: 'ADD_TAX_LOADING' });
    api
      .post('/tax', data)
      .then(res => {
        success('Successfully added new tax');
        dispatch({ type: 'ADD_TAX_SUCCESS', payload: res.data });
      })
      .catch((err: AxiosError<ApiError>) => {
        rejectedToast(err);
        dispatch({ type: 'ADD_TAX_FAILURE', payload: err.response?.data });
      });
  };

export const deleteTax =
  (id: number) => async (dispatch: Dispatch<TaxActionTypes>) => {
    dispatch({ type: 'REMOVE_TAX_LOADING' });
    api
      .delete(`/tax/${id}`)

      .then(res => {
        success('Successfully Removed Tax');
        dispatch({ type: 'REMOVE_TAX_SUCCESS', payload: res.data });
      })
      .catch((err: AxiosError<ApiError>) => {
        rejectedToast(err);
        dispatch({ type: 'REMOVE_TAX_FAILURE' });
      });
  };
