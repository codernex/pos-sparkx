import {Dispatch} from "@reduxjs/toolkit";
import {TransferAction} from "../reducer/transfered";
import api from "../../api";
import {AxiosError} from "axios";
import {ApiError} from "../types";

export const fetchTransfers = () => async (dispatch: Dispatch<TransferAction>) => {
    dispatch({type: 'FETCH_TRANSFER_LOADING'})
    api.get('/product/transfer').then(res => dispatch({
        type: 'FETCH_TRANSFER_SUCCESS',
        payload: res.data
    })).catch((err: AxiosError<ApiError>) => dispatch({type: 'FETCH_TRANSFER_ERROR'}))
}