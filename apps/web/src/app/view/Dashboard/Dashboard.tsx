import { Col, DatePicker, Row, Table } from "antd";
import {
  FaFileInvoice,
  FaPeopleArrows,
  FaProductHunt,
  FaRetweet,
  FaUser,
} from "react-icons/fa";
import styled from "styled-components";
import { useAppDispatch, useTypedSelector } from "../../../redux/store";
import { Stats } from "../../components";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../../api";
import SalesQtyChart from "./SalesQtyChart";
import SalesAmountChart from "./SalesAmountChart";
import { Link } from "react-router-dom";
import { filter } from "underscore";
import moment from "moment";
import millify from "millify";
import { SiCashapp } from "react-icons/si";
import { fetchReturned } from "../../../redux/actions/returned";
import { groupedProducts } from "../../utils/helper";
import { useFilteredSoldProduct } from "../../hooks";
import { useAuthUser } from "react-auth-kit";

const Wrapper = styled.div`
  margin-top: 20px;
  width: 100%;
  height: 100vh;
`;

const Dashboard = () => {
  const dispatch = useAppDispatch();

  const user = useAuthUser();

  useEffect(() => {
    dispatch(fetchReturned());
  }, [dispatch]);

  const { products, supplier, invoice, customer } = useTypedSelector(
    (state) => state
  );

  const [date, setDate] = useState<string[]>([]);
  const [sellsReport, setSellsReport] = useState<{ y: number; x: string }[]>(
    []
  );
  const [sellsAmount, setSellsAmount] = useState<{ y: number; x: string }[]>(
    []
  );
  const [topCustomers, setTopCustomers] = useState<
    { customerName: string; quantity: number; showroomName: string }[]
  >([]);

  const soldProducts = useMemo(
    () => products.products.filter((p) => p.sellingStatus === "Sold"),
    [products]
  );

  const filteredProducts = useFilteredSoldProduct(
    soldProducts,
    moment().startOf("month").format("YYYY-MM-DD"),
    moment().endOf("month").format("YYYY-MM-DD")
  );

  const bestProduct = useMemo(
    () =>
      groupedProducts(filteredProducts).sort((a, b) => b.quantity - a.quantity),
    [filteredProducts]
  );

  const currentUser = useMemo(() => user(), [user]) as IUser;

  const fetchData = useCallback(async () => {
    const [reportQty, reportAmount, topCustomers] = await Promise.all([
      api.get("/reports/sales/qty", {
        params: {
          from_date: date[0],
          to_date: date[1],
        },
      }),
      api.get("/reports/sales/amount", {
        params: {
          from_date: date[0],
          to_date: date[1],
        },
      }),
      api.get("/reports/top/customer"),
    ]);

    setSellsReport(reportQty.data);
    setSellsAmount(reportAmount.data);
    setTopCustomers(topCustomers.data);
  }, [date]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [returns, setReturns] = useState<IReturned[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get("/invoice/return")
      .then((res) => {
        setReturns(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  return (
    <Wrapper>
      <h1
        className={
          "mb-4 font-semibold font-inter text-xl text-primaryColor-900"
        }
      >
        Welcome, To Spark X Lifestyle
      </h1>
      <div
        className={
          "grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 lg:grid-cols-3  gap-x-3 gap-y-4 flex-wrap"
        }
      >
        <Stats
          title="Products"
          value={products.products.length}
          isLoading={products.isLoading}
          icon={<FaProductHunt />}
        />
        <Stats
          title="Suppliers"
          value={supplier.suppliers.length}
          isLoading={supplier.isLoading}
          icon={<FaUser />}
        />
        <Stats
          title="Invoice"
          value={invoice.invoices.length}
          isLoading={invoice.isLoading}
          icon={<FaFileInvoice />}
        />
        <Stats
          title="Today Sales"
          value={invoice.invoices
            .filter(
              (iv) =>
                moment(iv.createdAt).format("YYYY-MM-DD") ===
                moment().format("YYYY-MM-DD")
            )
            .reduce((acc, iv) => acc + iv.invoiceAmount, 0)}
          isLoading={invoice.isLoading}
          icon={<SiCashapp />}
        />
        <Stats
          title="This Month Sales"
          value={invoice.invoices
            .filter(
              (iv) =>
                moment(iv.createdAt).format("YYYY-MM") ===
                moment().format("YYYY-MM")
            )
            .reduce((acc, iv) => acc + iv.invoiceAmount, 0)}
          isLoading={invoice.isLoading}
          icon={<SiCashapp />}
        />
        <Stats
          title="Customer"
          value={customer.customers.length}
          isLoading={customer.isLoading}
          icon={<FaPeopleArrows />}
        />
        <Stats
          title="Total Sales Return"
          value={returns.reduce((acc, iv) => acc + iv.amount, 0)}
          isLoading={loading}
          icon={<FaRetweet />}
        />
      </div>

      {/*Sales Cound Card*/}
      <div className={"mt-10"}>
        <h1
          className={
            "mb-4 font-semibold font-inter text-2xl text-primaryColor-500"
          }
        >
          Sales Count
        </h1>
        <div className={"flex gap-x-5 "}>
          <div className={"card dark:bg-primaryColor-700 dark:text-white"}>
            <h1 className={"card__title "}>Today Sales</h1>
            <p className={"card__subtitle"}>
              {millify(
                filter(
                  invoice.invoices,
                  (iv) =>
                    moment(iv.createdAt).format("YYYY-MM-DD") ===
                    moment().format("YYYY-MM-DD")
                ).length
              )}
            </p>
          </div>
          <div className={"card dark:bg-primaryColor-700 dark:text-white"}>
            <h1 className={"card__title text-green-500"}>This Month Sales</h1>
            <p className={"card__subtitle"}>
              {millify(
                filter(
                  invoice.invoices,
                  (iv) =>
                    moment(iv.createdAt).format("YYYY-MM") ===
                    moment().format("YYYY-MM")
                ).length
              )}
            </p>
          </div>
          <div className={"card dark:bg-primaryColor-700 dark:text-white"}>
            <h1 className={"card__title text-fuchsia-500"}>This Year Sales</h1>
            <p className={"card__subtitle"}>
              {millify(
                filter(
                  invoice.invoices,
                  (iv) =>
                    moment(iv.createdAt).format("YYYY") ===
                    moment().format("YYYY")
                ).length
              )}
            </p>
          </div>
        </div>
      </div>

      {/*Recent Sales*/}
      <div className={"mt-10 flex gap-x-5 "}>
        <div className={"w-2/3"}>
          <h1
            className={"text-xl font-semibold font-inter mb-2 text-green-500"}
          >
            Recent Sales
          </h1>
          <Table
            loading={invoice.isLoading}
            className={
              "text-center dark:bg-primaryColor-800 rounded-md min-h-590"
            }
            dataSource={invoice.invoices
              .sort((a, b) => b.id - a.id)
              .slice(0, 6)}
            rowKey={(obj: Invoice) => obj.id}
            pagination={false}
            rowClassName={
              "dark:bg-slate-700 dark:text-white dark:hover:text-primaryColor-900"
            }
          >
            <Table.Column
              title={"#"}
              render={(text, record, index) => index + 1}
            />
            <Table.Column
              title={"Invoice No"}
              dataIndex={"showroomInvoiceCode"}
            />
            <Table.Column
              title={"Invoice Amount"}
              dataIndex="invoiceAmount"
              render={(text) => `${text}৳`}
            />
            <Table.Column
              title={"Invoice Status"}
              dataIndex={"invoiceStatus"}
              render={(text) => (
                <p
                  className={`${
                    text === "Paid" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {text}
                </p>
              )}
            />
            <Table.Column
              title={"Customer"}
              render={(_, record: Invoice) => {
                const c = customer.customers.find(
                  (c) => c.customerPhone === record.customerMobile
                );
                return (
                  <Link to={`/dashboard/customer/${c?.id}`}>
                    {record.customerName}
                  </Link>
                );
              }}
            />
            <Table.Column
              title={"Created"}
              render={(text, record: Invoice) => {
                return new Date(record.createdAt).toLocaleTimeString();
              }}
            />
          </Table>
        </div>
        <div className={"w-1/3"}>
          <h1 className={"text-xl font-semibold font-inter mb-2 text-pink-600"}>
            Top 5 Customer Of {moment().format("MMMM_YYYY")}
          </h1>
          <Table
            rowKey={(obj) => obj.customerName}
            dataSource={topCustomers.filter((customer) => {
              if (currentUser.role !== "SuperAdmin") {
                return customer.showroomName.includes(
                  currentUser.assignedShowroom
                );
              } else {
                return customer;
              }
            })}
            pagination={false}
            rowClassName={
              "dark:bg-slate-700 dark:text-white dark:hover:text-primaryColor-900"
            }
          >
            <Table.Column title={"SL"} render={(_, record, index) => ++index} />
            <Table.Column title={"Customer Name"} dataIndex={"customerName"} />
            <Table.Column
              title={"Customer Phone"}
              dataIndex={"customerPhone"}
            />
            <Table.Column title={"Showroom Name"} dataIndex={"showroomName"} />
            <Table.Column title={"Purchase Quantity"} dataIndex={"quantity"} />
          </Table>
          <h1
            className={
              "text-xl font-semibold font-inter mb-2 mt-6 text-amber-600"
            }
          >
            Top 5 Best Selling Product Of {moment().format("MMMM_YYYY")}
          </h1>
          <Table
            dataSource={bestProduct.slice(0, 5)}
            rowKey={(obj: Product) => obj.id}
            pagination={false}
          >
            <Table.Column title="SL" render={(_, p, i) => i + 1} />
            <Table.Column title="Product Name" dataIndex={"productGroup"} />
            <Table.Column title="Quantity" dataIndex={"quantity"} />
          </Table>
        </div>
      </div>

      {/*Sales Chart*/}

      <div
        className={
          "bg-white w-full flex justify-end p-4 rounded shadow-md mt-10 dark:bg-slate-700"
        }
      >
        <DatePicker.RangePicker onChange={(_, value) => setDate(value)} />
      </div>
      <Row className={" mt-4"} gutter={16}>
        <Col sm={24} lg={12} md={12}>
          <SalesQtyChart sellsQty={sellsReport} />
        </Col>
        <Col sm={12} lg={12} md={12}>
          <SalesAmountChart data={sellsAmount} />
        </Col>
      </Row>
    </Wrapper>
  );
};

export default Dashboard;
