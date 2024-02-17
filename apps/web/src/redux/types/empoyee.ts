import {
    CREATE_EMPLOYEE_ERR,
    CREATE_EMPLOYEE_LOADING,
    CREATE_EMPLOYEE_SUCCESS,
    FETCH_EMPLOYEE_ERR,
    FETCH_EMPLOYEE_LOADING,
    FETCH_EMPLOYEE_SUCCESS,
    REMOVE_EMPLOYEE_ERR,
    REMOVE_EMPLOYEE_LOADING,
    REMOVE_EMPLOYEE_SUCCESS,
    UPDATE_EMPLOYEE_ERR,
    UPDATE_EMPLOYEE_LOADING,
    UPDATE_EMPLOYEE_SUCCESS
} from "../constant";
import {ApiError} from "../types";

export interface IEmployeeState {
    employees: IEmployee[]
    isLoading: boolean

    error: string
}

interface CreateEmployeeLoading {
    type: typeof CREATE_EMPLOYEE_LOADING
}

interface CreateEmployeeSuccess {
    type: typeof CREATE_EMPLOYEE_SUCCESS
    payload: IEmployee
}

interface CreateEmployeeError {
    type: typeof CREATE_EMPLOYEE_ERR
    payload: ApiError
}

interface FetchEmployeesLoading {
    type: typeof FETCH_EMPLOYEE_LOADING
}

interface FetchEmployeesSuccess {
    type: typeof FETCH_EMPLOYEE_SUCCESS
    payload: IEmployee[]
}

interface FetchEmployeesError {
    type: typeof FETCH_EMPLOYEE_ERR
    payload: ApiError
}

interface UpdateEmployeeLoading {
    type: typeof UPDATE_EMPLOYEE_LOADING
}

interface UpdateEmployeeSuccess {
    type: typeof UPDATE_EMPLOYEE_SUCCESS
    payload: IEmployee
}


interface UpdateEmployeeError {
    type: typeof UPDATE_EMPLOYEE_ERR
    payload: ApiError
}

interface RemoveEmployeeLoading {
    type: typeof REMOVE_EMPLOYEE_LOADING

}

interface RemoveEmployeeSuccess {
    type: typeof REMOVE_EMPLOYEE_SUCCESS
    payload: IEmployee[]
}

interface RemoveEmployeeError {
    type: typeof REMOVE_EMPLOYEE_ERR
    payload: ApiError
}


export type EmployeeAction =
    CreateEmployeeLoading
    | CreateEmployeeSuccess
    | CreateEmployeeError
    | FetchEmployeesLoading
    | FetchEmployeesSuccess
    | FetchEmployeesError
    | UpdateEmployeeLoading
    | UpdateEmployeeSuccess
    | UpdateEmployeeError
    | RemoveEmployeeLoading
    | RemoveEmployeeSuccess
    | RemoveEmployeeError
