import { combineReducers } from "@reduxjs/toolkit";
import audit from "./audit";
import barcode from "./barcode";
import brand from "./brand";
import business from "./business";
import category from "./category";
import customer from "./customer";
import { employee } from "./employee";
import invoice from "./invoice";
import productGroup from "./productGroup";
import products from "./products";
import purchase from "./purchase";
import showroom from "./showroom";
import supplier from "./supplier";
import tax from "./tax";
import transferred from "./transfered";
import user from "./user";
import warehouse from "./warehouse";
import returned from "./returned";
import { hold } from "./holdInvoice";

const reducers = combineReducers({
  products,
  supplier,
  category,
  showroom,
  warehouse,
  productGroup,
  barcode,
  user,
  invoice,
  customer,
  employee,
  business,
  tax,
  transferred,
  brand,
  audit,
  purchase,
  returned,
  hold,
});

export default reducers;
