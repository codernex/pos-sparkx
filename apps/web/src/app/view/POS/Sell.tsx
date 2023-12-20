import { Modal, Select, Table, Button as AntButton, Spin } from "antd";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BiReceipt, BiReset } from "react-icons/bi";
import { FaHandHolding, FaPlus, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { find } from "underscore";
import api from "../../../api";
import { fetchCustomer } from "../../../redux/actions/customer";
import { getInvoice } from "../../../redux/actions/invoice";
import { fetchProduct } from "../../../redux/actions/product";
import { useAppDispatch, useTypedSelector } from "../../../redux/store";
import { rejectedToast } from "../../utils/toaster";
import ConfirmationModal from "../../components/ConfirmationModal";
import { fetchEmployee } from "../../../redux/actions/employee";
import { ApiError } from "../../../redux/types";
import { AxiosError } from "axios";
import { PaymentMethod } from "../../../types";
import RecentInvoice from "./Components/RecentInvoice";
import HoldTransactions from "./Components/HoldTransactions";
import Invoice from "./Components/Invoice";
import Customer from "./Components/Customer";
import Tagless from "./Components/Tagless";
import SearchProduct from "./Components/SearchProduct";
import { Button } from "../../components";
import { createHold, fetchHold } from "../../../redux/actions/hold";
import ReturnModal from "./Components/ReturnModal";
const Sell = () => {
  const dispatch = useAppDispatch();
  const [confirmationModal, setConfirmationModal] = useState(false);

  //Invoice

  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState<Invoice | null>(null);
  const { invoices, isLoading } = useTypedSelector((state) => state.invoice);
  const [showRecentInvoice, setShowRecentInvoice] = useState(false);
  const [showHoldInvoice, setShowHoldInvoice] = useState(false);

  //Invoice ENd

  //Product
  const [filteredProducts, setFilteredProducts] = useState<Product[] | null>(
    null
  );
  const [cart, setCart] = useState<Product[]>([]);

  const removeFromCart = (itemCode: string) => {
    const removedCart = cart.filter((item) => item.itemCode !== itemCode);
    setCart(removedCart);
  };

  //Product End

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerPhone, setCustomerPhone] = useState<string | null>(null);
  //Customer

  const { customers } = useTypedSelector((state) => state.customer);
  //Customer End

  //Employee
  const { employees } = useTypedSelector((state) => state.employee);
  const [empPhone, setEmpPhone] = useState<string | null>(null);
  //Employee End

  const { business } = useTypedSelector((state) => state.business);

  function totalPrice(items: Product[]): number {
    let price: number = 0;
    if (items)
      for (let i = 0; i < items.length; i++) {
        price += items[i].sellPrice;
      }
    return price;
  }

  //
  const [showTaglessModal, setShowTaglessModal] = useState(false);

  //Multiple Payment Methods Modal
  const [showMultiplePayments, setShowMultiplePayments] = useState(false);

  // Hold Invoices
  const { holds, isLoading: holdLoading } = useTypedSelector(
    (state) => state.hold
  );

  // Return Product

  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnId, setReturnId] = useState<number | null>(null);
  const [returnLoading, setReturnLoading] = useState(false);
  const [returns, setReturns] = useState<IReturned[]>([]);
  const [filteredReturn, setFilteredReturn] = useState<IReturned | undefined>(
    undefined
  );

  useEffect(() => {
    const filteredR = returns.find((r) => r.id === returnId);
    setFilteredReturn(filteredR);
  }, [returnId, returns]);
  if (returnLoading) {
    return <Spin />;
  }

  return (
    <div
      className="bg-white min-h-[50vh] p-4 flex flex-col gap-y-6 rounded-md dark:bg-primaryColor-900"
      onClick={() => setFilteredProducts([])}
    >
      {returnId ? (
        <div>
          <h1 className="text-xl font-semibold text-center text-red-500">
            Please Exchange The Product{" "}
          </h1>
          <p className="text-center">
            Don't Refresh Before Completing The Excange
          </p>
        </div>
      ) : (
        ""
      )}

      <div className={"flex justify-end"}>
        <button
          className={"flex gap-x-2 items-center px-2 py-1 dark:text-white"}
          onClick={() => setShowRecentInvoice(true)}
        >
          <BiReceipt /> Recent Transactions
        </button>
        <button
          className={"flex gap-x-2 items-center px-2 py-1 dark:text-white"}
          onClick={async () => {
            dispatch(fetchHold()).then(() => {
              setShowHoldInvoice(true);
            });
          }}
        >
          <FaHandHolding /> Hold Transactions
        </button>
      </div>

      {/*Recent Transactions Modal*/}
      <RecentInvoice
        invoices={invoices}
        isLoading={isLoading}
        setShowrecentInvoice={setShowRecentInvoice}
        showRecentInvoice={showRecentInvoice}
      />

      {/*Hold Transactions Modal*/}

      <HoldTransactions
        holdInvoices={holds}
        isLoading={holdLoading}
        setShowHoldInvoice={setShowHoldInvoice}
        showHoldInvoice={showHoldInvoice}
        setCart={setCart}
        setCustomerPhone={setCustomerPhone}
        setEmpPhone={setEmpPhone}
      />

      {/**
       * Invoice Modal
       */}

      <Invoice
        invoiceData={invoiceData}
        setShowInvoice={setShowInvoice}
        showInvoice={showInvoice}
      />
      {/*
       *
       *
       *Invoice End
       *
       *
       */}

      {/*Add Customer Start*/}

      <Customer
        setCustomerPhone={setCustomerPhone}
        setShowCustomerModal={setShowCustomerModal}
        showCustomerModal={showCustomerModal}
      />

      {/*
       *
       *
       *Add Customer End
       *
       *
       */}
      <div className="flex w-full gap-x-10">
        {/* Search Customer */}
        <div className="flex relative w-[30%] items-center ">
          <div className={"flex w-full items-center"}>
            <div className="border h-[32px] w-[40px] justify-center border-r-0  border-slate-400 flex items-center dark:text-white">
              <FaUser className="text-slate-500 dark:text-white" />
            </div>
            <Select
              className="pl-4 border border-solid h-[32px] w-full border-slate-400 focus:outline-none"
              placeholder="Select a Customer..."
              options={customers.map((customer, i) => ({
                label: customer.customerName + " " + customer.customerPhone,
                value: customer.customerPhone,
                key: i,
              }))}
              value={customerPhone}
              onChange={(value) => {
                console.log(value);
                const searchedCustomer = find(customers, (element) =>
                  element.customerPhone.includes(value)
                );

                if (!searchedCustomer) {
                  return toast.error("Customer Not Found");
                }

                const employee = employees.find(
                  (emp) => emp.empPhone === searchedCustomer.crm
                );
                if (employee) {
                  setEmpPhone(employee.empPhone);
                } else {
                  setEmpPhone(null);
                }

                setCustomerPhone(value);
              }}
              showSearch
            />

            <div
              className={
                "border h-[32px] w-[40px] justify-center border-l-0  border-slate-400 flex items-center cursor-pointer dark:text-white"
              }
              onClick={() => setShowCustomerModal(true)}
            >
              <FaPlus />
            </div>
          </div>
        </div>

        {/**Tagless Product Modal */}
        <Tagless
          setCart={setCart}
          setShowTaglessModal={setShowTaglessModal}
          showTaglessModal={showTaglessModal}
        />

        {/* Search Product */}
        <SearchProduct
          cart={cart}
          setCart={setCart}
          filteredProducts={filteredProducts}
          setFilteredProducts={setFilteredProducts}
          setShowTaglessModal={setShowTaglessModal}
        />

        <div>
          <ReturnModal
            setReturns={setReturns}
            setReturnLoading={setReturnLoading}
            returnId={returnId}
            setReturnId={setReturnId}
            showReturnModal={showReturnModal}
            setShowReturnModal={setShowReturnModal}
          />
          <AntButton onClick={() => setShowReturnModal(true)}>Return</AntButton>
        </div>
        {/*
        *
        *
        *

        Search CRM

        */}
        <div className="flex w-[30%] items-center ">
          <Select
            className={"w-full"}
            filterOption={true}
            value={empPhone}
            onChange={(e) => setEmpPhone(e)}
            placeholder="Select a Employee"
            options={employees.map((item) => ({
              label: item.empName,
              value: item.empPhone,
            }))}
            showSearch={true}
          />
        </div>
      </div>

      {/**
       * Sells Area
       */}

      <Formik
        initialValues={{
          salesTime: "",
          discounts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          subtotal: totalPrice(cart),
          paidAmount: 0,
          items: cart,
          customerPhone: customerPhone,
          discountTk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          crmPhone: empPhone,
          vat: business?.defaultTax || 0,
          payable: cart.length
            ? cart.map((item) => item.sellPrice)
            : [0, 0, 0, 0],
          employees: [],
          paymentMethod: PaymentMethod.CASH,
          cash: 0,
          bkash: 0,
          cbl: 0,
          returnId: returnId,
        }}
        enableReinitialize={true}
        onSubmit={(values) => {
          console.log(values);
          if (!values.employees.length) {
            toast.error("Please Select Employee", {});
            return;
          } else {
            //Creating Invoice
            api
              .post("/invoice", values)
              .then(async (res) => {
                setInvoiceData(res.data);
                setShowInvoice(true);
                await dispatch(fetchProduct());
                await dispatch(getInvoice());
                await dispatch(fetchEmployee());
                await dispatch(fetchCustomer());

                setCart([]);
                setEmpPhone(null);
                setCustomerPhone(null);
                setReturnId(null);
              })
              .catch((err: AxiosError<ApiError>) => {
                rejectedToast(err);

                setCart([]);
                setEmpPhone(null);
                setCustomerPhone(null);
                setReturnId(null);
              });
          }
        }}
      >
        {({ values, handleSubmit, setFieldValue, handleChange, resetForm }) => {
          return (
            <Form
              method={"post"}
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <ConfirmationModal
                open={confirmationModal}
                setOpen={setConfirmationModal}
                execute={async () => {
                  handleSubmit();
                }}
              />

              {/**
               * Multiple payment methods Modal
               */}

              <Modal
                open={showMultiplePayments}
                onCancel={() => setShowMultiplePayments(false)}
                footer={false}
              >
                <h2 className="text-xl font-semibold mb-3 flex justify-between mt-4">
                  <span>
                    Total Payable :
                    {values.payable.reduce((a, b) => a + b) +
                      Math.floor((values.subtotal / 100) * values.vat)}
                  </span>
                  <span>
                    Customer Paying : {values.cash + values.bkash + values.cbl}
                  </span>
                </h2>
                <div className="flex space-x-1">
                  <div>
                    <label htmlFor="cash">Cash</label>
                    <Field
                      name="cash"
                      id="cash"
                      placeholder="Cash"
                      type="number"
                      className="h-[37px] w-full rounded border border-b-2 dark:bg-slate-700 dark:border-none border-b-slate-300 outline-none bg-transparent pl-3"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleChange(e);
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="bkash">Bkash</label>
                    <Field
                      name="bkash"
                      id="bkash"
                      placeholder="Bkash"
                      type="number"
                      className="h-[37px] w-full rounded border border-b-2 dark:bg-slate-700 dark:border-none border-b-slate-300 outline-none bg-transparent pl-3"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleChange(e);
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="cbl">Cbl</label>
                    <Field
                      name="cbl"
                      id="cbl"
                      placeholder="Cbl"
                      type="number"
                      className="h-[37px] w-full rounded border border-b-2 dark:bg-slate-700 dark:border-none border-b-slate-300 outline-none bg-transparent pl-3"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleChange(e);
                      }}
                    />
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setFieldValue(
                      "paidAmount",
                      values.bkash + values.cash + values.cbl
                    );
                    if (
                      values.payable.reduce((a, b) => a + b) +
                        Math.floor((values.subtotal / 100) * values.vat) <
                      values.cash + values.bkash + values.cbl
                    ) {
                      return toast.error(
                        "You are not able to pay more than payable amount in multiple payment method"
                      );
                    }
                    setConfirmationModal(true);
                    setShowMultiplePayments(false);
                  }}
                >
                  Pay
                </Button>
              </Modal>

              {/**
               * Main Sales Area
               */}
              <div className={"flex gap-x-5"}>
                <Table
                  dataSource={cart}
                  rowKey={(obj: Product) => obj.id + obj.itemCode}
                  className={"z-20 flex-1"}
                  pagination={false}
                  rowClassName={
                    "dark:bg-slate-700 dark:text-white dark:hover:text-primaryColor-900"
                  }
                >
                  <Table.Column
                    title={"#"}
                    render={(_text, _record, index) => index + 1}
                  />
                  <Table.Column
                    title={"Product Name, Code"}
                    render={(text, record: Product) => (
                      <span>
                        {record.itemCode} - {record.productGroup}
                      </span>
                    )}
                  />
                  <Table.Column
                    title={"Discount (%)"}
                    render={(text, record: Product, index) => {
                      return (
                        <>
                          <Field
                            className={
                              "text-white border-none focus:outline-none bg-black"
                            }
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              handleChange(e);
                              setFieldValue(
                                `payable[${index}]`,
                                cart[index].sellPrice -
                                  Math.round(
                                    (cart[index].sellPrice / 100) *
                                      Number(e.target.value)
                                  )
                              );
                              setFieldValue(
                                `discountTk[${index}]`,
                                Math.round(
                                  (cart[index].sellPrice / 100) *
                                    Number(e.target.value)
                                )
                              );
                            }}
                            name={`discounts[${index}]`}
                            type={"number"}
                            value={values.discounts[index]}
                          />
                        </>
                      );
                    }}
                  />

                  <Table.Column
                    title={"Employee"}
                    render={(_, _record, index) => {
                      return (
                        <Field
                          as="select"
                          name={`employees[${index}]`}
                          className={
                            "w-[140px] h-full py-1 rounded-md cursor-pointer"
                          }
                          children={
                            <>
                              <option>Select An Employee</option>
                              {employees.map((emp) => (
                                <option value={emp.empPhone} key={emp.empPhone}>
                                  {emp.empName}
                                </option>
                              ))}
                            </>
                          }
                          value={values.employees[index]}
                        />
                      );
                    }}
                  />
                  <Table.Column title={"QTY"} render={() => 1} />
                  <Table.Column title={"T.Price"} dataIndex={"sellPrice"} />
                  <Table.Column
                    title={"D.Price"}
                    render={(_, record: Product, index) => {
                      return record.sellPrice - values.discountTk[index];
                    }}
                  />
                  <Table.Column
                    title={<AiOutlineClose />}
                    render={(_text, record: Product, index) => (
                      <button
                        type="button"
                        onClick={() => removeFromCart(record.itemCode)}
                      >
                        X
                      </button>
                    )}
                  />
                </Table>

                {/**
                 * Right Side OF Actions
                 */}
                <div className={"w-80 flex flex-col space-y-5 dark:text-white"}>
                  <div
                    className={"text-[16px] font-black flex justify-between"}
                  >
                    Sales Time{" "}
                    <input
                      className="border pl-2 rounded-md focus:outline-none w-40"
                      type="date"
                      id="salesTime"
                      value={values.salesTime}
                      name="salesTime"
                      onChange={handleChange}
                    />
                  </div>
                  <div
                    className={"text-[16px] font-black flex justify-between"}
                  >
                    Subtotal{" "}
                    <input
                      value={
                        values.subtotal +
                        Math.round((values.subtotal / 100) * values.vat)
                      }
                      disabled
                      className="border pl-2 rounded-md w-40"
                    />
                  </div>
                  <div
                    className={"text-[16px] font-black flex justify-between"}
                  >
                    - Total Discount (tk)
                    <input
                      value={values.discountTk.reduce((a, b) => a + b)}
                      disabled
                      className="border pl-2 rounded-md w-40"
                    />
                  </div>

                  <div
                    className={"text-[16px] font-black flex justify-between"}
                  >
                    + Vat (%)
                    <Field
                      className="border pl-2 rounded-md w-40"
                      name={"vat"}
                      type={"number"}
                      disabled
                    />
                  </div>
                  <div
                    className={"text-[16px] font-black flex justify-between"}
                  >
                    Total {returnId ? "Returnable" : " Payable"}
                    <input
                      value={
                        filteredReturn?.amount
                          ? filteredReturn.amount -
                            values.payable.reduce((a, b) => a + b) +
                            Math.round((values.subtotal / 100) * values.vat)
                          : values.payable
                          ? values.payable.reduce((a, b) => a + b) +
                            Math.round((values.subtotal / 100) * values.vat)
                          : 0
                      }
                      disabled
                      className="border pl-2 rounded-md w-40"
                    />
                  </div>

                  <div
                    className={"text-[16px] font-black flex justify-between"}
                  >
                    Customer Paying
                    <Field
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleChange(e);
                        setFieldValue("paidAmount", Number(e.target.value));
                      }}
                      className="border pl-2 rounded-md w-40"
                      name={"paidAmount"}
                      type={"number"}
                    />
                  </div>

                  <div
                    className={"text-[16px] font-black flex justify-between"}
                  >
                    <span>
                      {values.paidAmount +
                        (filteredReturn?.amount ? filteredReturn.amount : 0) -
                        (values.payable.reduce((a, b) => a + b) +
                          Math.round((values.subtotal / 100) * values.vat)) <
                      0
                        ? "Due"
                        : returnId
                        ? "Return"
                        : "Change"}
                    </span>
                    <input
                      className="border pl-2 rounded-md w-40"
                      value={
                        values.paidAmount +
                        (filteredReturn?.amount ? filteredReturn.amount : 0) -
                        (values.payable.reduce((a, b) => a + b) +
                          Math.round((values.subtotal / 100) * values.vat))
                      }
                      disabled
                    />
                  </div>
                  <div
                    className={"text-[16px] font-black flex justify-between"}
                  >
                    Payment Method
                    <Field
                      className="border pl-2 rounded-md w-40"
                      as="select"
                      name="paymentMethod"
                      children={Object.keys(PaymentMethod).map((key) => (
                        <option value={key}>{key}</option>
                      ))}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleChange(e);
                        setFieldValue("cash", 0);
                        setFieldValue("bkash", 0);
                        setFieldValue("cbl", 0);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Sells Action */}

              <div className={"flex gap-x-10 items-center"}>
                <Link
                  className={
                    "flex items-center gap-x-2 bg-blue-600 px-2 py-1 rounded text-white w-[140px] justify-center"
                  }
                  target={"_blank"}
                  to={"/dashboard/pos"}
                >
                  <FaPlus /> Add New
                </Link>
                <button
                  type={"button"}
                  onClick={async () => {
                    if (returnId) {
                      toast.error(
                        "You are not allowed to hold when Exchanging"
                      );
                      return;
                    } else {
                      if (values.items.length) {
                        dispatch(createHold(values)).then(() => {
                          dispatch(fetchHold());
                          setCustomerPhone(null);
                          setCart([]);
                          setEmpPhone(null);
                        });
                      } else {
                        toast.error("No Product TO HOLD");
                      }
                    }
                  }}
                  className={
                    "flex items-center gap-x-2 bg-red-500 text-white w-auto px-2 py-1 rounded min-w-[140px] justify-center"
                  }
                  children={
                    <>
                      <FaHandHolding />
                      Hold
                    </>
                  }
                />
                <button
                  type={"button"}
                  onClick={() => {
                    resetForm();
                    setEmpPhone(null);
                    setCustomerPhone(null);
                    setCart([]);
                  }}
                  className={
                    "flex items-center gap-x-2 bg-red-500 px-2 py-1 rounded text-white w-[140px] justify-center"
                  }
                >
                  <BiReset />
                  Reset
                </button>
                <button
                  className={
                    "flex items-center gap-x-2 bg-green-500 text-white w-auto px-2 py-1 rounded min-w-[140px] justify-center"
                  }
                  type="button"
                  onClick={() => {
                    if (!customerPhone || !empPhone) {
                      toast.error("Sells Not Possible Without Customer Or CRM");
                      return;
                    }
                    if (values.paymentMethod === PaymentMethod.MULTIPLE) {
                      setShowMultiplePayments(true);
                    } else {
                      if (values.paymentMethod === PaymentMethod.BKASH) {
                        setFieldValue("bkash", values.paidAmount);
                      } else if (values.paymentMethod === PaymentMethod.CASH) {
                        setFieldValue("cash", values.paidAmount);
                      } else if (values.paymentMethod === PaymentMethod.CBL) {
                        setFieldValue("cbl", values.paidAmount);
                      }
                      setConfirmationModal(true);
                    }
                  }}
                >
                  Pay
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default Sell;
