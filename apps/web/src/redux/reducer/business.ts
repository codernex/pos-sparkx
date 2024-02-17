import {Reducer} from "@reduxjs/toolkit";
import {BusinessAction, IBusinessState} from "../types/business";
import {
    FETCH_BUSINESS_ERR,
    FETCH_BUSINESS_LOADING,
    FETCH_BUSINESS_SUCCESS,
    UPDATE_BUSINESS_ERR,
    UPDATE_BUSINESS_LOADING,
    UPDATE_BUSINESS_SUCCESS
} from "../constant";

const business: Reducer<IBusinessState, BusinessAction> = (state = {
    business: null,
    isLoading: false,
    error: undefined
}, action) => {

    switch (action.type) {
        case FETCH_BUSINESS_LOADING: {
            return {...state, isLoading: true}
        }
        case FETCH_BUSINESS_SUCCESS: {
            return {...state, business: action.payload, isLoading: false}
        }
        case FETCH_BUSINESS_ERR: {
            return {...state, isLoading: false, error: action.payload?.message}
        }

        case UPDATE_BUSINESS_LOADING: {
            return {...state, isLoading: true}
        }
        case UPDATE_BUSINESS_SUCCESS: {
            return {...state, business: action.payload, isLoading: false}
        }
        case UPDATE_BUSINESS_ERR: {
            return {...state, isLoading: false, error: action.payload?.message}
        }

        default:
            return state
    }
}

export default business