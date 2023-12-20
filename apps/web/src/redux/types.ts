import { NavigateFunction } from "react-router-dom";
import {
  ADD_CUSTOMER_ERR,
  ADD_CUSTOMER_LOADING,
  ADD_CUSTOMER_SUCCESS,
  ADD_INVOICE_ERR,
  ADD_INVOICE_LOADING,
  ADD_INVOICE_SUCCESS,
  ADD_MULTIPLE_PRODUCT_ERR,
  ADD_MULTIPLE_PRODUCT_LOADING,
  ADD_MULTIPLE_PRODUCT_SUCCESS,
  ADD_PRODUCT_GROUP_ERR,
  ADD_PRODUCT_GROUP_LOADING,
  ADD_PRODUCT_GROUP_SUCCESS,
  ADD_SHOWROOM_ERR,
  ADD_SHOWROOM_LOADING,
  ADD_SHOWROOM_SUCCESS,
  ADD_SINGLE_PRODUCT_ERR,
  ADD_SINGLE_PRODUCT_LOADING,
  ADD_SINGLE_PRODUCT_SUCCESS,
  ADD_SUPPLIER_ERR,
  ADD_SUPPLIER_LOADING,
  ADD_SUPPLIER_SUCCESS,
  ADD_WAREHOUSE_ERR,
  ADD_WAREHOUSE_LOADING,
  ADD_WAREHOUSE_SUCCESS,
  CREATE_CATEGORY_ERR,
  CREATE_CATEGORY_LOADING,
  CREATE_CATEGORY_SUCCESS,
  CREATE_USER_ERR,
  CREATE_USER_LOADING,
  CREATE_USER_SUCCESS,
  DELETE_SHOWROOM_ERR,
  DELETE_SHOWROOM_LOADING,
  DELETE_SHOWROOM_SUCCESS,
  FETCH_CATEGORY_ERR,
  FETCH_CATEGORY_LOADING,
  FETCH_CATEGORY_SUCCESS,
  FETCH_CUSTOMER_ERR,
  FETCH_CUSTOMER_LOADING,
  FETCH_CUSTOMER_SUCCESS,
  FETCH_INVOICE_ERR,
  FETCH_INVOICE_LOADING,
  FETCH_INVOICE_SUCCESS,
  FETCH_PRODUCT_ERR,
  FETCH_PRODUCT_GROUP_ERR,
  FETCH_PRODUCT_GROUP_LOADING,
  FETCH_PRODUCT_GROUP_SUCCESS,
  FETCH_PRODUCT_LOADING,
  FETCH_PRODUCT_SUCCESS,
  FETCH_SHOWROOM_ERR,
  FETCH_SHOWROOM_LOADING,
  FETCH_SHOWROOM_SUCCESS,
  FETCH_SUPPLIER_ERR,
  FETCH_SUPPLIER_LOADING,
  FETCH_SUPPLIER_SUCCESS,
  FETCH_USER_ERR,
  FETCH_USER_LOADING,
  FETCH_USER_SUCCESS,
  FETCH_WAREHOUSE_ERR,
  FETCH_WAREHOUSE_LOADING,
  FETCH_WAREHOUSE_SUCCESS,
  REMOVE_CUSTOMER_ERR,
  REMOVE_CUSTOMER_LOADING,
  REMOVE_CUSTOMER_SUCCESS,
  REMOVE_INVOICE_ERR,
  REMOVE_INVOICE_LOADING,
  REMOVE_INVOICE_SUCCESS,
  REMOVE_WAREHOUSE_ERR,
  REMOVE_WAREHOUSE_LOADING,
  REMOVE_WAREHOUSE_SUCCESS,
  TRANSFER_PRODUCT_ERR,
  TRANSFER_PRODUCT_LOADING,
  TRANSFER_PRODUCT_SUCCESS,
  UPDATE_CUSTOMER_ERR,
  UPDATE_CUSTOMER_LOADING,
  UPDATE_CUSTOMER_SUCCESS,
  UPDATE_PRODUCT_ERR,
  UPDATE_PRODUCT_LOADING,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_SHOWROOM_ERR,
  UPDATE_SHOWROOM_LOADING,
  UPDATE_SHOWROOM_SUCCESS,
  UPDATE_WAREHOUSE_ERR,
  UPDATE_WAREHOUSE_LOADING,
  UPDATE_WAREHOUSE_SUCCESS,
} from "./constant";
import { AppDispatch } from "./store";
import Invoice from "../app/view/POS/Invoice";

//Product Group
export interface ProductGroup {
  id?: number;
  productName: string;
  productCode: string;
  productCategory: string;
}

export interface IProductGState {
  productGroup: ProductGroup[];
  isLoading: boolean;
}

interface CreatePorductGroupLoading {
  type: typeof ADD_PRODUCT_GROUP_LOADING;
}

interface CreatePorductGroupSuccess {
  type: typeof ADD_PRODUCT_GROUP_SUCCESS;
  payload: ProductGroup;
}

interface CreatePorductGroupErr {
  type: typeof ADD_PRODUCT_GROUP_ERR;
}

interface FetchProductGroupLoading {
  type: typeof FETCH_PRODUCT_GROUP_LOADING;
}

interface FetchProductGroupSuccess {
  type: typeof FETCH_PRODUCT_GROUP_SUCCESS;
  payload: ProductGroup[];
}

interface FetchProductGroupErr {
  type: typeof FETCH_PRODUCT_GROUP_ERR;
}

export type ProductGroupAction =
  | CreatePorductGroupLoading
  | CreatePorductGroupSuccess
  | CreatePorductGroupErr
  | FetchProductGroupLoading
  | FetchProductGroupSuccess
  | FetchProductGroupErr;

//Product Types
export interface IProductSate {
  products: Product[];
  isLoading: boolean;
  hasMore: boolean;
}

interface CreateSingleProductLoading {
  type: typeof ADD_SINGLE_PRODUCT_LOADING;
}

interface CreateSingleProductSuccess {
  type: typeof ADD_SINGLE_PRODUCT_SUCCESS;
  payload: Product[];
}

interface CreateSingleProductErr {
  type: typeof ADD_SINGLE_PRODUCT_ERR;
}

interface CreateMultiProductLoading {
  type: typeof ADD_MULTIPLE_PRODUCT_LOADING;
}

interface CreateMultiProductSuccess {
  type: typeof ADD_MULTIPLE_PRODUCT_SUCCESS;
  payload: Product[];
}

interface CreateMultiProductErr {
  type: typeof ADD_MULTIPLE_PRODUCT_ERR;
}

interface FetchProductLoading {
  type: typeof FETCH_PRODUCT_LOADING;
}

interface FetchProductSuccess {
  type: typeof FETCH_PRODUCT_SUCCESS;
  payload: { hasMore: boolean; product: Product[] };
}

interface FetchProductErr {
  type: typeof FETCH_PRODUCT_ERR;
}

interface TransferProductLoading {
  type: typeof TRANSFER_PRODUCT_LOADING;
}

interface TransferPrdouctSuccess {
  type: typeof TRANSFER_PRODUCT_SUCCESS;
  payload: Product[];
}

interface TransferProductErr {
  type: typeof TRANSFER_PRODUCT_ERR;
}

interface UpdateProductLoading {
  type: typeof UPDATE_PRODUCT_LOADING;
}

interface UpdateProductSuccess {
  type: typeof UPDATE_PRODUCT_SUCCESS;
  payload: Product;
}
interface UpdateProductFailuer {
  type: typeof UPDATE_PRODUCT_ERR;
}

export type ProductActionType =
  | CreateSingleProductLoading
  | CreateSingleProductSuccess
  | CreateMultiProductLoading
  | CreateMultiProductSuccess
  | CreateMultiProductErr
  | CreateSingleProductErr
  | FetchProductLoading
  | FetchProductSuccess
  | FetchProductErr
  | TransferProductLoading
  | TransferPrdouctSuccess
  | TransferProductErr
  | UpdateProductLoading
  | UpdateProductSuccess
  | UpdateProductFailuer;

//Supplier Types

export interface ISupplierState {
  suppliers: Supplier[];
  isLoading: boolean;
  error: string | null;
}

interface CreateSupplierLoading {
  type: typeof ADD_SUPPLIER_LOADING;
}

interface CreateSupplierSuccess {
  type: typeof ADD_SUPPLIER_SUCCESS;
  payload: Supplier;
}

interface CreateSupplierErr {
  type: typeof ADD_SUPPLIER_ERR;
  payload: string;
}

export type CreateSupplierAction =
  | CreateSupplierLoading
  | CreateSupplierErr
  | CreateSupplierSuccess;

export interface FetchSupplierLoading {
  type: typeof FETCH_SUPPLIER_LOADING;
}

export interface FetchSupplierSuccess {
  type: typeof FETCH_SUPPLIER_SUCCESS;
  payload: Supplier[];
}

export interface FetchSupplierErr {
  type: typeof FETCH_SUPPLIER_ERR;
  payload: string;
}

interface UpdateSupplierLoading {
  type: "UPDATE_SUPPLIER_LOADING";
}
interface UpdateSupplierSuccess {
  type: "UPDATE_SUPPLIER_SUCCESS";
  payload: Supplier;
}
interface UpdateSupplierErr {
  type: "UPDATE_SUPPLIER_ERR";
}
interface DeleteSupplierLoading {
  type: "DELETE_SUPPLIER_LOADING";
}
interface DeleteSupplierSuccess {
  type: "DELETE_SUPPLIER_SUCCESS";
  payload: Supplier[];
}
interface DeleteSupplierErr {
  type: "DELETE_SUPPLIER_ERR";
}

export type FetchSupplierAction =
  | FetchSupplierErr
  | FetchSupplierLoading
  | FetchSupplierSuccess;

export type SupplierActionType =
  | CreateSupplierAction
  | FetchSupplierAction
  | UpdateSupplierLoading
  | UpdateSupplierSuccess
  | UpdateSupplierErr
  | DeleteSupplierLoading
  | DeleteSupplierSuccess
  | DeleteSupplierErr;

//Category Types

export interface Category {
  id?: number;
  categoryName: string;
}

interface CreateCatLoading {
  type: typeof CREATE_CATEGORY_LOADING;
}

interface CreateCatSuccess {
  type: typeof CREATE_CATEGORY_SUCCESS;
  payload: Category;
}

interface CreateCatErr {
  type: typeof CREATE_CATEGORY_ERR;
}

interface FetchCatLoading {
  type: typeof FETCH_CATEGORY_LOADING;
}

interface FetchCatSuccess {
  type: typeof FETCH_CATEGORY_SUCCESS;
  payload: Category[];
}

interface FetchCatErr {
  type: typeof FETCH_CATEGORY_ERR;
}

export interface ICatState {
  categories: Category[];
  isLoading: boolean;
}

type CreateCatActionType = CreateCatErr | CreateCatLoading | CreateCatSuccess;
type FetchCatActionType = FetchCatLoading | FetchCatErr | FetchCatSuccess;

export type CatActionType = CreateCatActionType | FetchCatActionType;

//Shoroom
export interface Showroom {
  id?: number;
  showroomName: string;
  showroomAddress: string;
  showroomCode: string;
  showroomMobile?: string;
}

export interface IShoroomState {
  showroom: Showroom[];
  isLoading: boolean;
}

interface CreateShoroomLoading {
  type: typeof ADD_SHOWROOM_LOADING;
}

interface CreateShoroomSuccess {
  type: typeof ADD_SHOWROOM_SUCCESS;
  payload: Showroom;
}

interface CreateShoroomErr {
  type: typeof ADD_SHOWROOM_ERR;
}

interface FetchShoroomLoading {
  type: typeof FETCH_SHOWROOM_LOADING;
}

interface FetchShoroomSuccess {
  type: typeof FETCH_SHOWROOM_SUCCESS;
  payload: Showroom[];
}

interface FetchShoroomErr {
  type: typeof FETCH_SHOWROOM_ERR;
}

interface DeleteShoroomLoading {
  type: typeof DELETE_SHOWROOM_LOADING;
}

interface DeleteShoroomSuccess {
  type: typeof DELETE_SHOWROOM_SUCCESS;
  payload: Showroom[];
}

interface DeleteShoroomErr {
  type: typeof DELETE_SHOWROOM_ERR;
}

interface UpdateShoroomLoading {
  type: typeof UPDATE_SHOWROOM_LOADING;
}

interface UpdateShoroomSuccess {
  type: typeof UPDATE_SHOWROOM_SUCCESS;
  payload: Showroom;
}

interface UpdateShoroomErr {
  type: typeof UPDATE_SHOWROOM_ERR;
}

export type ShoroomActionType =
  | CreateShoroomLoading
  | CreateShoroomSuccess
  | CreateShoroomErr
  | FetchShoroomErr
  | FetchShoroomLoading
  | FetchShoroomSuccess
  | UpdateShoroomLoading
  | UpdateShoroomSuccess
  | UpdateShoroomErr
  | DeleteShoroomErr
  | DeleteShoroomLoading
  | DeleteShoroomSuccess;

//WareHouse

export interface Warehouse {
  whId: number;
  whName: string;
  whLocation: string;
  whMobile?: string;
  whCode: string;
}

export interface IWareHouseState {
  warehouses: Warehouse[];
  isLoading: boolean;
}

interface CreateWarehouseLoading {
  type: typeof ADD_WAREHOUSE_LOADING;
}

interface CreateWarehouseSuccess {
  type: typeof ADD_WAREHOUSE_SUCCESS;
  payload: Warehouse;
}

interface CreateWarehouseErr {
  type: typeof ADD_WAREHOUSE_ERR;
}

interface FetchWarehouseLoading {
  type: typeof FETCH_WAREHOUSE_LOADING;
}

interface FetchWarehouseSuccess {
  type: typeof FETCH_WAREHOUSE_SUCCESS;
  payload: Warehouse[];
}

interface FetchWarehouseErr {
  type: typeof FETCH_WAREHOUSE_ERR;
}

interface UpdateWarehouseLoading {
  type: typeof UPDATE_WAREHOUSE_LOADING;
}

interface UpdateWarehouseSuccess {
  type: typeof UPDATE_WAREHOUSE_SUCCESS;
  payload: Warehouse;
}

interface UpdateWarehouseErr {
  type: typeof UPDATE_WAREHOUSE_ERR;
}

interface DeletedWarehouseLoading {
  type: typeof REMOVE_WAREHOUSE_LOADING;
}

interface DeletedWarehouseSuccess {
  type: typeof REMOVE_WAREHOUSE_SUCCESS;
  payload: Warehouse[];
}

interface DeletedWarehouseErr {
  type: typeof REMOVE_WAREHOUSE_ERR;
}

export type WarehouseActionType =
  | CreateWarehouseLoading
  | CreateWarehouseErr
  | CreateWarehouseSuccess
  | FetchWarehouseErr
  | FetchWarehouseLoading
  | FetchWarehouseSuccess
  | DeletedWarehouseLoading
  | DeletedWarehouseSuccess
  | DeletedWarehouseErr
  | UpdateWarehouseLoading
  | UpdateWarehouseSuccess
  | UpdateWarehouseErr;

//Create Function
export type CreateFN<T> = (
  data: T,
  reset: Function,
  navigate?: NavigateFunction
) => (dispatch: AppDispatch) => Promise<any>;

export interface ApiError {
  success: boolean;
  message: string;
}

//USer

export interface IUserState {
  user: IUser[];
  isLoading: boolean;

  isError: string;
}

interface CreateUserLoading {
  type: typeof CREATE_USER_LOADING;
}

interface CreateUserSuccess {
  type: typeof CREATE_USER_SUCCESS;
  payload: IUser;
}

interface CreateUserErr {
  type: typeof CREATE_USER_ERR;
  payload: ApiError;
}

interface FetchUserLoading {
  type: typeof FETCH_USER_LOADING;
}

interface FetchUserSuccess {
  type: typeof FETCH_USER_SUCCESS;
  payload: IUser[];
}

interface FetchUserErr {
  type: typeof FETCH_USER_ERR;
  payload: ApiError;
}
interface UpdateUserLoading {
  type: "UPDATE_USER_LOADING";
}
interface UpdateUserSuccess {
  type: "UPDATE_USER_SUCCESS";
  payload: IUser;
}

interface UpdateUserError {
  type: "UPDATE_USER_ERR";
}
interface DeleteUserLoading {
  type: "DELETE_USER_LOADING";
}
interface DeleteUserSuccess {
  type: "DELETE_USER_SUCCESS";
  payload: IUser[];
}
interface DeleteUserErr {
  type: "DELETE_USER_ERR";
}

export type UserActionType =
  | CreateUserLoading
  | CreateUserErr
  | CreateUserSuccess
  | FetchUserLoading
  | FetchUserErr
  | FetchUserSuccess
  | UpdateUserLoading
  | UpdateUserSuccess
  | UpdateUserError
  | DeleteUserLoading
  | DeleteUserSuccess
  | DeleteUserErr;

// Invoice

export interface InvoiceState {
  isLoading: boolean;
  invoices: Invoice[];

  error: string;
}

interface FetchInvoiceLoading {
  type: typeof FETCH_INVOICE_LOADING;
}

interface FetchInvoiceSuccess {
  type: typeof FETCH_INVOICE_SUCCESS;
  payload: Invoice[];
}

interface FetchInvoiceErr {
  type: typeof FETCH_INVOICE_ERR;
  payload: ApiError;
}

interface AddInvoiceLoading {
  type: typeof ADD_INVOICE_LOADING;
}

interface AddInvoiceSuccess {
  type: typeof ADD_INVOICE_SUCCESS;
  payload: Invoice;
}

interface AddInvoiceErr {
  type: typeof ADD_INVOICE_ERR;
  payload: ApiError;
}

interface RemoveInvoiceLoading {
  type: typeof REMOVE_INVOICE_LOADING;
}

interface RemoveInvoiceSuccess {
  type: typeof REMOVE_INVOICE_SUCCESS;
  payload: Invoice[];
}

interface RemoveInvoiceErr {
  type: typeof REMOVE_INVOICE_ERR;
  payload: ApiError;
}

export type InvoiceActionType =
  | FetchInvoiceLoading
  | FetchInvoiceSuccess
  | FetchInvoiceErr
  | AddInvoiceLoading
  | AddInvoiceSuccess
  | AddInvoiceErr
  | RemoveInvoiceLoading
  | RemoveInvoiceSuccess
  | RemoveInvoiceErr;

//Customer

export interface ICustomerState {
  customers: ICustomer[];
  isLoading: boolean;
  error: string;
}

interface FetchCustomerLoading {
  type: typeof FETCH_CUSTOMER_LOADING;
}

interface FetchCustomerSuccess {
  type: typeof FETCH_CUSTOMER_SUCCESS;
  payload: ICustomer[];
}

interface FetchCustomerErr {
  type: typeof FETCH_CUSTOMER_ERR;
  payload: ApiError;
}

interface AddCustomerLoading {
  type: typeof ADD_CUSTOMER_LOADING;
}

interface AddCustomerSuccess {
  type: typeof ADD_CUSTOMER_SUCCESS;
  payload: ICustomer;
}

interface AddCustomerErr {
  type: typeof ADD_CUSTOMER_ERR;
  payload: ApiError;
}

interface DeleteCustomerLoading {
  type: typeof REMOVE_CUSTOMER_LOADING;
}

interface DeleteCustomerSuccess {
  type: typeof REMOVE_CUSTOMER_SUCCESS;
  payload: ICustomer[];
}

interface DeleteCustomerErr {
  type: typeof REMOVE_CUSTOMER_ERR;
  payload: ApiError;
}

interface UpdateCustomerLoading {
  type: typeof UPDATE_CUSTOMER_LOADING;
}

interface UpdateCustomerSuccess {
  type: typeof UPDATE_CUSTOMER_SUCCESS;
  payload: ICustomer;
}

interface UpdateCustomerErr {
  type: typeof UPDATE_CUSTOMER_ERR;
  payload: ApiError;
}

export type CustomerAction =
  | FetchCustomerLoading
  | FetchCustomerSuccess
  | FetchCustomerErr
  | AddCustomerLoading
  | AddCustomerSuccess
  | AddCustomerErr
  | DeleteCustomerLoading
  | DeleteCustomerErr
  | DeleteCustomerSuccess
  | UpdateCustomerLoading
  | UpdateCustomerSuccess
  | UpdateCustomerErr;
