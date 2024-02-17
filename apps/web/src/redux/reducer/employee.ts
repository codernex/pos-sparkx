import {Reducer} from "@reduxjs/toolkit";
import {EmployeeAction, IEmployeeState} from "../types/empoyee";
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

export const employee: Reducer<IEmployeeState, EmployeeAction> = (state = {
    isLoading: false,
    employees: [],
    error: ''
}, action) => {

    switch (action.type) {
        case CREATE_EMPLOYEE_LOADING: {
            return {...state, isLoading: true}
        }

        case CREATE_EMPLOYEE_SUCCESS: {
            return {...state, isLoading: false, employees: [...state.employees, action.payload]}
        }

        case CREATE_EMPLOYEE_ERR: {
            return {...state, isLoading: false, error: action.payload.message}
        }

        case FETCH_EMPLOYEE_LOADING: {
            return {...state, isLoading: true}
        }
        case FETCH_EMPLOYEE_SUCCESS: {
            return {...state, isLoading: false, employees: action.payload}
        }
        case FETCH_EMPLOYEE_ERR: {
            return {...state, isLoading: false, error: action.payload?.message}
        }

        case UPDATE_EMPLOYEE_LOADING: {
            return {...state, isLoading: true}
        }

        case UPDATE_EMPLOYEE_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                employees: state.employees.map(employee => employee.id === action.payload.id ? action.payload : employee)
            }
        }
        case UPDATE_EMPLOYEE_ERR: {
            return {...state, isLoading: false, error: action.payload?.message}
        }

        case REMOVE_EMPLOYEE_LOADING: {
            return {...state, isLoading: true}
        }

        case REMOVE_EMPLOYEE_SUCCESS: {
            return {...state, isLoading: false, employees: action.payload}
        }

        case REMOVE_EMPLOYEE_ERR: {
            return {...state, isLoading: false, error: action.payload?.message}
        }

        default:
            return state
    }

}