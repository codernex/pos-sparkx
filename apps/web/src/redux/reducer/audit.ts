import { Reducer } from "@reduxjs/toolkit";

interface IAudit {
  products: Product[];
  isLoading: boolean;
}

interface FetchAuditLoading {
  type: "FETCH_AUDIT_LOADING";
}

interface FetchAuditSuccess {
  type: "FETCH_AUDIT_SUCCESS";
  payload: Product[];
}

interface FetchAuditFailure {
  type: "FETCH_AUDIT_FAILURE";
}

export type AuditAction =
  | FetchAuditLoading
  | FetchAuditSuccess
  | FetchAuditFailure;
const audit: Reducer<IAudit, AuditAction> = (
  state = { products: [], isLoading: false },
  action
) => {
  switch (action.type) {
    case "FETCH_AUDIT_LOADING":
      return { ...state, isLoading: true };
    case "FETCH_AUDIT_SUCCESS":
      return { ...state, isLoading: false, products: action.payload };
    case "FETCH_AUDIT_FAILURE":
      return { ...state, isLoading: false };
    default:
      return state;
  }
};
export default audit;
