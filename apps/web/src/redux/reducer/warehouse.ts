import {
  ADD_WAREHOUSE_ERR,
  ADD_WAREHOUSE_LOADING,
  ADD_WAREHOUSE_SUCCESS,
  FETCH_WAREHOUSE_ERR,
  FETCH_WAREHOUSE_LOADING,
  FETCH_WAREHOUSE_SUCCESS,
  REMOVE_WAREHOUSE_ERR,
  REMOVE_WAREHOUSE_LOADING,
  REMOVE_WAREHOUSE_SUCCESS,
  UPDATE_WAREHOUSE_ERR,
  UPDATE_WAREHOUSE_LOADING,
  UPDATE_WAREHOUSE_SUCCESS,
} from "../constant";
import { IWareHouseState, WarehouseActionType } from "../types";

export default function warehouse(
  state: IWareHouseState = { isLoading: false, warehouses: [] },
  action: WarehouseActionType
) {
  switch (action.type) {
    case ADD_WAREHOUSE_LOADING: {
      return { ...state, isLoading: true };
    }
    case ADD_WAREHOUSE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        warehouses: [...state.warehouses, action.payload],
      };
    }

    case ADD_WAREHOUSE_ERR: {
      return { ...state, isLoading: false };
    }

    case FETCH_WAREHOUSE_LOADING: {
      return { ...state, isLoading: true };
    }

    case FETCH_WAREHOUSE_SUCCESS: {
      return { ...state, isLoading: false, warehouses: action.payload };
    }
    case FETCH_WAREHOUSE_ERR: {
      return { ...state, isLoading: false };
    }
    case UPDATE_WAREHOUSE_LOADING: {
      return { ...state, isLoading: true };
    }
    case UPDATE_WAREHOUSE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        warehouses: state.warehouses.map((item) =>
          item.whId === action.payload.whId ? action.payload : item
        ),
      };

    case UPDATE_WAREHOUSE_ERR: {
      return { ...state, isLoading: false };
    }
    case REMOVE_WAREHOUSE_LOADING: {
      return { ...state, isLoading: true };
    }
    case REMOVE_WAREHOUSE_SUCCESS: {
      return { ...state, isLoading: false, warehouses: action.payload };
    }
    case REMOVE_WAREHOUSE_ERR: {
      return { ...state, isLoading: false };
    }

    default:
      return state;
  }
}
