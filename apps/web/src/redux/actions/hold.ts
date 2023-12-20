import { Dispatch } from "@reduxjs/toolkit";
import { IHoldInvoiceActions } from "../reducer/holdInvoice";
import api from "../../api";
import { AxiosResponse } from "axios";
import { rejectedToast } from "../../app/utils/toaster";
import { toast } from "react-toastify";

export const createHold =
  (data: any) => async (dispatch: Dispatch<IHoldInvoiceActions>) => {
    dispatch({ type: "CREATE_HOLD_LOADING" });
    api
      .post("/invoice/hold", data)
      .then((res: AxiosResponse<HoldInvoice>) => {
        toast.success("Invoice Added To Hold");
        dispatch({ type: "CREATE_HOLD_SUCCESS", payload: res.data });
      })
      .catch((err) => {
        rejectedToast(err);
        dispatch({ type: "CREATE_HOLD_ERR" });
      });
  };

export const fetchHold =
  () => async (dispatch: Dispatch<IHoldInvoiceActions>) => {
    dispatch({ type: "FETCH_HOLD_LOADING" });
    api
      .get("/invoice/hold")
      .then((res: AxiosResponse<HoldInvoice[]>) => {
        dispatch({ type: "FETCH_HOLD_SUCCESS", payload: res.data });
      })
      .catch((err) => {
        dispatch({ type: "FETCH_HOLD_ERR" });
      });
  };
export const removeHold =
  (id: number) => async (dispatch: Dispatch<IHoldInvoiceActions>) => {
    dispatch({ type: "REMOVE_HOLD_LOADING" });
    api
      .delete(`/invoice/hold/${id}`)
      .then((res: AxiosResponse<HoldInvoice[]>) => {
        dispatch({ type: "REMOVE_HOLD_SUCCESS", payload: res.data });
      })
      .catch((err) => {
        rejectedToast(err);
        dispatch({ type: "REMOVE_HOLD_ERR" });
      });
  };
