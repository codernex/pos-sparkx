import {
    FETCH_BUSINESS_ERR,
    FETCH_BUSINESS_LOADING,
    FETCH_BUSINESS_SUCCESS,
    UPDATE_BUSINESS_ERR,
    UPDATE_BUSINESS_LOADING,
    UPDATE_BUSINESS_SUCCESS
} from "../constant";
import {ApiError} from "../types";

export interface IBusinessState {
    business: IBusiness | null;
    isLoading: boolean;
    error: string | undefined
}

interface FetchBusinessLoading {
    type: typeof FETCH_BUSINESS_LOADING

}

interface FetchBusinessSuccess {
    type: typeof FETCH_BUSINESS_SUCCESS
    payload: IBusiness
}

interface FetchBusinessErr {
    type: typeof FETCH_BUSINESS_ERR
    payload: ApiError | undefined
}

interface UpdateBusinessLoading {
    type: typeof UPDATE_BUSINESS_LOADING
}

interface UpdateBusinessSuccess {
    type: typeof UPDATE_BUSINESS_SUCCESS
    payload: IBusiness
}

interface UpdateBusinessErr {
    type: typeof UPDATE_BUSINESS_ERR
    payload: ApiError | undefined
}

export type BusinessAction =
    FetchBusinessErr
    | FetchBusinessLoading
    | FetchBusinessSuccess
    | UpdateBusinessErr
    | UpdateBusinessSuccess
    | UpdateBusinessLoading