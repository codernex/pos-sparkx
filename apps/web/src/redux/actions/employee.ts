import { AppDispatch } from "../store";
import api from "../../api";
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
  UPDATE_EMPLOYEE_SUCCESS,
} from "../constant";
import { AxiosError } from "axios";
import { ApiError } from "../types";
import { rejectedToast, successToast } from "../../app/utils/toaster";

export const createEmployee = (data: any) => (dispatch: AppDispatch) => {
  dispatch({ type: CREATE_EMPLOYEE_LOADING });
  api
    .post("/employee", data)
    .then((res) => {
      successToast("Employee created successfully");
      dispatch({ type: CREATE_EMPLOYEE_SUCCESS, payload: res.data });
    })
    .catch((err: AxiosError<ApiError>) => {
      rejectedToast(err);
      dispatch({ type: CREATE_EMPLOYEE_ERR, payload: err.response?.data });
    });
};

export const fetchEmployee = () => (dispatch: AppDispatch) => {
  dispatch({ type: FETCH_EMPLOYEE_LOADING });
  api
    .get("/employee")
    .then((res) =>
      dispatch({
        type: FETCH_EMPLOYEE_SUCCESS,
        payload: res.data,
      })
    )
    .catch((err: AxiosError<ApiError>) => {
      dispatch({ type: FETCH_EMPLOYEE_ERR, payload: err.response?.data });
    });
};

export const updateEmployee =
  (id: number, data: any) => async (dispatch: AppDispatch) => {
    dispatch({ type: UPDATE_EMPLOYEE_LOADING });
    api
      .patch(`/employee/${id}`, data)
      .then((res) => {
        successToast("Employee updated successfully");
        dispatch({
          type: UPDATE_EMPLOYEE_SUCCESS,
          payload: res.data,
        });
      })
      .catch((err: AxiosError<ApiError>) => {
        rejectedToast(err);
        dispatch({ type: UPDATE_EMPLOYEE_ERR, payload: err.response?.data });
      });
  };

export const deleteEmployee = (id: number) => async (dispatch: AppDispatch) => {
  dispatch({ type: REMOVE_EMPLOYEE_LOADING });
  api
    .delete(`/employee/${id}`)
    .then((res) => {
      successToast("Employee Deleted successfully");
      dispatch({
        type: REMOVE_EMPLOYEE_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err: AxiosError<ApiError>) => {
      rejectedToast(err);
      dispatch({ type: REMOVE_EMPLOYEE_ERR, payload: err.response?.data });
    });
};
