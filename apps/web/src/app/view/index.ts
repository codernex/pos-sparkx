import React from "react";

const Login = React.lazy(() => import("./Auth/Login"));
const Dashboard = React.lazy(() => import("./Dashboard/Dashboard"));
const DBLayout = React.lazy(() => import("./Dashboard/Layout"));
const NotFound = React.lazy(() => import("./NotFound"));
const MultipleProduct = React.lazy(() => import("./Product/AddMultiple"));
const SingleProduct = React.lazy(() => import("./Product/AddSingle"));
const Products = React.lazy(() => import("./Product/AllProducts"));
const ProductGroup = React.lazy(() => import("./Product/ProductGroup"));
const Barcode = React.lazy(() => import("./Barcode/Barcode"));
const BarcodeSetting = React.lazy(() => import("./Barcode/BarcodeSetting"));

const ShowRoom = React.lazy(() => import("./ShowRoom/ShowRoom"));
const AddShowRoom = React.lazy(() => import("./ShowRoom/AddSR"));

const Categories = React.lazy(() => import("./Categories/Categories"));
const AddCat = React.lazy(() => import("./Categories/AddCat"));

const Supplier = React.lazy(() => import("./Supplier/Supplier"));
const AddSupplier = React.lazy(() => import("./Supplier/AddSupplier"));

const AddProductGroup = React.lazy(() => import("./Product/AddProductGroup"));

const ImportProducts = React.lazy(() => import("./Product/ImportProducts"));

const Sell = React.lazy(() => import("./POS/Sell"));
const Invoice = React.lazy(() => import("./POS/Invoice"));

const User = React.lazy(() => import("./User/User"));

const Customer = React.lazy(() => import("./Customer/Customer"));

const AddCustomer = React.lazy(() => import("./Customer/AddCustomer"));

const Employee = React.lazy(() => import("./Employee/Employee"));

const TransferProduct = React.lazy(() => import("./Product/TransferProduct"));

const Tax = React.lazy(() => import("./Setting/Tax"));

const Brand = React.lazy(() => import("./Brand/Brand"));

const Audit = React.lazy(() => import("./Audit/Audit"));

const Marketing = React.lazy(() => import("./Marketing/Marketing"));

const SystemSetting = React.lazy(() => import("./Setting/System"));

const Purchase = React.lazy(() => import("./Purchase/Purchase"));
const CustomerDetails = React.lazy(() => import("./Customer/CustomerDetails"));

//Reports
const SalesReport = React.lazy(() => import("./Reports/Sales"));
const EmpMOM_YOY = React.lazy(() => import("./Reports/EmployeeSales"));
const CustomerQTY = React.lazy(() => import("./Reports/CustomerQTY"));
const InventoryReport = React.lazy(() => import("./Reports/InventoryReport"));

const LostProduct = React.lazy(() => import("./Product/LostProduct"));

const DamagedProduct = React.lazy(() => import("./Product/DamagedProduct"));

const ReturnReport = React.lazy(() => import("./Reports/ReturnReport"));

export {
  AddCat,
  AddCustomer,
  AddProductGroup,
  AddShowRoom,
  AddSupplier,
  Audit,
  Barcode,
  BarcodeSetting,
  Brand,
  Categories,
  Customer,
  CustomerDetails,
  CustomerQTY,
  DBLayout,
  Dashboard,
  EmpMOM_YOY,
  Employee,
  ImportProducts,
  Invoice,
  Login,
  Marketing,
  MultipleProduct,
  NotFound,
  ProductGroup,
  Products,
  Purchase,
  SalesReport,
  Sell,
  ShowRoom,
  SingleProduct,
  Supplier,
  SystemSetting,
  Tax,
  TransferProduct,
  User,
  InventoryReport,
  LostProduct,
  DamagedProduct,
  ReturnReport,
};
