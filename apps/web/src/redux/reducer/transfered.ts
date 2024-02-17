import {Reducer} from "@reduxjs/toolkit";

interface ITransferedState {
    transferred: ITransfer[]
    isLoading: boolean
}

interface FetchTransferLoading {
    type: 'FETCH_TRANSFER_LOADING'
}

interface FetchTransferSuccess {
    type: 'FETCH_TRANSFER_SUCCESS'
    payload: ITransfer[]
}

interface FetchTransferError {
    type: 'FETCH_TRANSFER_ERROR'
}

export type TransferAction = FetchTransferLoading | FetchTransferSuccess | FetchTransferError;
const transferred: Reducer<ITransferedState, TransferAction> = (state = {
    transferred: [],
    isLoading: false
}, action) => {

    switch (action.type) {
        case "FETCH_TRANSFER_LOADING":
            return {...state, isLoading: true};

        case "FETCH_TRANSFER_SUCCESS": {
            return {...state, isLoading: false, transferred: action.payload};
        }
        case "FETCH_TRANSFER_ERROR": {
            return {...state, isLoading: false, transferred: []};
        }
        default:
            return state
    }
}

export default transferred