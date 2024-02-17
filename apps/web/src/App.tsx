import { Suspense, useEffect, useMemo } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Loader from "./app/components/Loader";
import {
  AddCat,
  AddCustomer,
  AddProductGroup,
  AddShowRoom,
  AddSupplier,
  Audit,
  Barcode,
  BarcodeSetting,
  Categories,
  Customer,
  CustomerDetails,
  CustomerQTY,
  Dashboard,
  DBLayout,
  Employee,
  EmpMOM_YOY,
  ImportProducts,
  InventoryReport,
  Invoice,
  Login,
  LostProduct,
  Marketing,
  NotFound,
  ProductGroup,
  Products,
  Purchase,
  ReturnReport,
  SalesReport,
  Sell,
  ShowRoom,
  Supplier,
  SystemSetting,
  Tax,
  TransferProduct,
  User,
} from "./app/view";
import AddMultiple from "./app/view/Product/AddMultiple";
import AddSingle from "./app/view/Product/AddSingle";
import { useAppDispatch } from "./redux/store";
import { fetchProduct } from "./redux/actions/product";
import { getSupplier } from "./redux/actions/supplier";
import { getShowroom } from "./redux/actions/showroom";
import { fetchCustomer } from "./redux/actions/customer";
import { fetchEmployee } from "./redux/actions/employee";
import { fetchBusiness } from "./redux/actions/business";
import { fetchTax } from "./redux/actions/tax";
import { getProductGroup } from "./redux/actions/productGroup";
import { getInvoice } from "./redux/actions/invoice";
import { useSettingContext } from "./app/context/SettingProver";
import DamagedProducts from "./app/view/Product/DamagedProduct";
import BestProducts from "./app/view/Product/BestProducts";
import BestCustomer from "./app/view/Customer/BestCustomer";
import { useAuthUser } from "react-auth-kit";
interface DispatchActions {
  (): void;
}

function App() {
  const dispatch = useAppDispatch();
  const isUser = useAuthUser();

  const dispatchActions: DispatchActions[] = useMemo(() => {
    return [
      () => dispatch(fetchProduct()),
      () => dispatch(getSupplier()),
      () => dispatch(getShowroom()),
      () => dispatch(fetchCustomer()),
      () => dispatch(fetchEmployee()),
      () => dispatch(fetchBusiness()),
      () => dispatch(fetchTax()),
      () => dispatch(getProductGroup()),
      () => dispatch(getInvoice()),
    ];
  }, [dispatch]);

  useEffect(() => {
    if (isUser()) {
      dispatchActions.forEach((action) => action());
    }
  }, [dispatchActions]);
  const { mode } = useSettingContext();

  useEffect(() => {
    const invoiceData: ILocalHoldInvoice = { invoices: [] };

    const invoices = localStorage.getItem("invoice");

    if (!invoices?.length)
      localStorage.setItem("invoice", JSON.stringify(invoiceData));
  }, []);

  return (
    <div className={mode === "dark" ? "dark" : ""}>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DBLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products">
              <Route index element={<Products />} />
              <Route path="add-single" element={<AddSingle />} />
              <Route path="add-multiple" element={<AddMultiple />} />
              <Route path="import" element={<ImportProducts />} />
              <Route path="transfer" element={<TransferProduct />} />
              <Route path="lost" element={<LostProduct />} />
              <Route path="damaged" element={<DamagedProducts />} />
              <Route path="best-products" element={<BestProducts />} />
            </Route>
            <Route path="product-group">
              <Route index element={<ProductGroup />} />
              <Route path="add" element={<AddProductGroup />} />
            </Route>
            <Route path="barcode" element={<Outlet />}>
              <Route index element={<Barcode />} />
              <Route path="setting" element={<BarcodeSetting />} />
            </Route>
            <Route path="showroom" element={<Outlet />}>
              <Route index element={<ShowRoom />} />
              <Route path="add" element={<AddShowRoom />} />
            </Route>

            <Route path="categories">
              <Route index element={<Categories />} />
              <Route path="add" element={<AddCat />} />
            </Route>
            <Route path="supplier">
              <Route index element={<Supplier />} />
              <Route path="add" element={<AddSupplier />} />
            </Route>
            <Route path="pos">
              <Route index element={<Sell />} />
              <Route path="invoice" element={<Invoice />} />
              {/* <Route path='return/prev' element={<PrevReturned />} /> */}
            </Route>
            <Route path="setting">
              <Route index element={<div>Settings</div>} />
              <Route path="user" element={<User />} />
              <Route path={"vat"} element={<Tax />} />
              <Route path={"system"} element={<SystemSetting />} />
            </Route>
            <Route path={"customer"}>
              <Route index element={<Customer />} />
              <Route path=":id" element={<CustomerDetails />} />
              <Route path="add" element={<AddCustomer />} />
              <Route path="best" element={<BestCustomer />} />
            </Route>
            <Route path={"employee"}>
              <Route index element={<Employee />} />
            </Route>
            {/* <Route path={"brands"} element={<Brand />} /> */}
            <Route path={"audit"} element={<Audit />} />
            <Route path={"marketing"} element={<Marketing />} />
            <Route path={"purchase"} element={<Purchase />} />
            <Route path={"reports"}>
              <Route path={"sales"} element={<SalesReport />} />
              <Route path={"employee"} element={<EmpMOM_YOY />} />
              <Route path={"customer"} element={<CustomerQTY />} />
              <Route path={"inventory"} element={<InventoryReport />} />
              <Route path={"return"} element={<ReturnReport />} />
            </Route>
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
