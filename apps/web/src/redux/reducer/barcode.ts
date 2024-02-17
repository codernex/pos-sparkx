import {Reducer} from '@reduxjs/toolkit';

interface FetchBarcodeLoading {
    type: 'FETCH_BARCODE_LOADING';

}

interface FetchBarcodeSuccess {
    type: 'FETCH_BARCODE_SUCCESS';
    payload: BarcodeSetting[]
}

interface FetchBarcodeFailure {
    type: 'FETCH_BARCODE_FAILURE';
}

interface PrintBarcodeLoading {
    type: 'PRINT_BARCODE_LOADING';
}

interface PrintBarcodeSuccess {
    type: 'PRINT_BARCODE_SUCCESS';
    payload: Product[]
}

interface PrintBarcodeFailure {
    type: 'PRINT_BARCODE_FAILURE';
}

interface CreateBarcodeLoading {
    type: 'CREATE_BARCODE_LOADING';
}

interface CreateBarcodeSuccess {
    type: 'CREATE_BARCODE_SUCCESS';
    payload: BarcodeSetting
}

interface CreateBarcodeFailure {
    type: 'CREATE_BARCODE_FAILURE';
}

interface GetDefaultBarcodeLoading {
    type: 'GET_DEFAULT_BARCODE_LOADING';
}

interface GetDefaultBarcodeSuccess {
    type: 'GET_DEFAULT_BARCODE_SUCCESS';
    payload: IDefaultBarcode
}

interface SetDefaultBarcodeLoading {
    type: 'SET_DEFAULT_BARCODE_LOADING';
}

interface SetDefaultBarcodeSuccess {
    type: 'SET_DEFAULT_BARCODE_SUCCESS';
    payload: IDefaultBarcode
}

interface SetDefaultBarcodeFailure {
    type: 'SET_DEFAULT_BARCODE_FAILURE';
}

interface GetDefaultBarcodeFailure {
    type: 'GET_DEFAULT_BARCODE_FAILURE';
}

interface UpdateBarcodeLoading {
    type: 'UPDATE_BARCODE_LOADING';
}

interface UpdateBarcodeSuccess {
    type: 'UPDATE_BARCODE_SUCCESS';
    payload: BarcodeSetting
}

interface UpdateBarcodeFailure {
    type: 'UPDATE_BARCODE_FAILURE';
}

interface DeleteBarcodeLoading {
    type: 'DELETE_BARCODE_LOADING';
}

interface DeleteBarcodeSuccess {
    type: 'DELETE_BARCODE_SUCCESS';
    payload: BarcodeSetting[]
}

interface DeleteBarcodeFailure {
    type: 'DELETE_BARCODE_FAILURE';
}

export type BarcodeActionType =
    FetchBarcodeLoading
    | FetchBarcodeSuccess
    | FetchBarcodeFailure
    | PrintBarcodeLoading
    | PrintBarcodeSuccess
    | PrintBarcodeFailure
    | CreateBarcodeLoading
    | CreateBarcodeSuccess
    | CreateBarcodeFailure
    | GetDefaultBarcodeLoading
    | GetDefaultBarcodeSuccess
    | GetDefaultBarcodeFailure
    | SetDefaultBarcodeLoading
    | SetDefaultBarcodeSuccess
    | SetDefaultBarcodeFailure
    | UpdateBarcodeLoading
    | UpdateBarcodeSuccess
    | UpdateBarcodeFailure
    | DeleteBarcodeLoading
    | DeleteBarcodeSuccess
    | DeleteBarcodeFailure;

const barcode: Reducer<IPrintBarcodeState, BarcodeActionType> = function (
    state = {barcode: [], products: [], isLoading: false, defaultBarcode: undefined},
    action
) {
    switch (action.type) {
        case 'FETCH_BARCODE_LOADING': {
            return {
                ...state,
                isLoading: true
            };
        }
        case "FETCH_BARCODE_SUCCESS":
            return {...state, isLoading: false, barcode: action.payload}
        case "FETCH_BARCODE_FAILURE":

            return {...state, isLoading: false}

        case "PRINT_BARCODE_LOADING":
            return {...state, isLoading: true}

        case "PRINT_BARCODE_SUCCESS":
            return {...state, products: action.payload, isLoading: false};

        case 'PRINT_BARCODE_FAILURE': {
            return {...state, isLoading: false};
        }
        case "CREATE_BARCODE_LOADING":
            return {...state, isLoading: true}
        case "CREATE_BARCODE_SUCCESS":
            return {...state, isLoading: false, barcode: [...state?.barcode, action.payload]}
        case "CREATE_BARCODE_FAILURE":
            return {...state, isLoading: false}
        case "GET_DEFAULT_BARCODE_LOADING":
            return {...state, isLoading: true}
        case "GET_DEFAULT_BARCODE_SUCCESS":
            return {...state, isLoading: false, defaultBarcode: action.payload}
        case "GET_DEFAULT_BARCODE_FAILURE":
            return {...state, isLoading: false}
        case "SET_DEFAULT_BARCODE_LOADING":
            return {...state, isLoading: true}
        case "SET_DEFAULT_BARCODE_SUCCESS":
            return {...state, isLoading: false, defaultBarcode: action.payload}
        case "SET_DEFAULT_BARCODE_FAILURE":
            return {...state, isLoading: false}
        case "UPDATE_BARCODE_LOADING":
            return {...state, isLoading: true}
        case "UPDATE_BARCODE_SUCCESS":
            return {
                ...state,
                isLoading: false,
                barcode: state.barcode.map(item => item.id === action.payload.id ? action.payload : item)
            }
        case "UPDATE_BARCODE_FAILURE":
            return {...state, isLoading: false}
        case "DELETE_BARCODE_LOADING":
            return {...state, isLoading: true}
        case "DELETE_BARCODE_SUCCESS":
            return {...state, isLoading: false, barcode: action.payload}
        case "DELETE_BARCODE_FAILURE":
            return {...state, isLoading: false}


        default:
            return state;
    }
};
export default barcode;
