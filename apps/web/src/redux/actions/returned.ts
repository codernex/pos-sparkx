import { Dispatch } from "@reduxjs/toolkit";
import { ReturnedActionType } from "../reducer/returned";
import api from "../../api";

export const fetchReturned =
  () => async (dispatch: Dispatch<ReturnedActionType>) => {
    dispatch({ type: "FETCH_RETURNED_LOADING" });
    api
      .get("/invoice/return")
      .then((res) => {
        dispatch({ type: "FETCH_RETURNED_SUCCESS", payload: res.data });
      })
      .catch((err) => {
        dispatch({ type: "FETCH_RETURNED_ERR" });
      });
  };
