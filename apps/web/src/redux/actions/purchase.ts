import { Dispatch } from '@reduxjs/toolkit';
import api from '../../api';
import { PurchaseActionType } from '../reducer/purchase';

export const fetchPurchase =
  () => async (dispatch: Dispatch<PurchaseActionType>) => {
    dispatch({ type: 'FETCH_PURCHASE_LOADING' });
    api
      .get('/purchase')
      .then(res => {
        dispatch({ type: 'FETCH_PURCHASE_SUCCESS', payload: res.data });
      })
      .catch(err => {
        dispatch({ type: 'FETCH_PURCHASE_ERR' });
      });
  };
