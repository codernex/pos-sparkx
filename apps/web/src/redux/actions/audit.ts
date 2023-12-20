import { Dispatch } from "@reduxjs/toolkit";
import { AuditAction } from "../reducer/audit";
import api from "../../api";
import { AxiosError } from "axios";
import { ApiError } from "../types";
import { toast } from "react-toastify";

export const fetchAudit =
  (showroomName: string, supplierName: string = "All", productGroup: string) =>
  async (dispatch: Dispatch<AuditAction>) => {
    dispatch({ type: "FETCH_AUDIT_LOADING" });
    api
      .get(
        `/audit?showroomName=${showroomName}&supplierName=${supplierName}&productGroup=${productGroup}`
      )
      .then((res) => {
        dispatch({ type: "FETCH_AUDIT_SUCCESS", payload: res.data });
        console.log(res);
      })
      .catch((err: AxiosError<ApiError>) => {
        dispatch({ type: "FETCH_AUDIT_FAILURE" });
        toast.error(err.response?.data.message);
      });
  };
