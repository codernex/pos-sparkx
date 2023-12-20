import { useEffect, useState } from "react";
import { Button, DatePicker, Modal, Select, Table } from "antd";
import { AiOutlineEye } from "react-icons/ai";
import { useAppDispatch, useTypedSelector } from "../../../redux/store";
import { filterInvoice } from "../../../redux/actions/invoice";
import { useSettingContext } from "../../context/SettingProver";
import { UserRole } from "../../../types";
import { Button as CustomButton } from "../../components";
import { Link } from "react-router-dom";
import { FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx";
import SingleInvoice from "./Components/SingleInvoice";
import moment from "moment";
import { formatPrice } from "../../utils";

const Invoice = () => {
  const [showInvoice, setShowInvoice] = useState<boolean>(false);
  const [invoiceData, setInvoiceData] = useState<Invoice | null>(null);
  const dispatch = useAppDispatch();
  const { currentUser } = useSettingContext();
  const [showroomName, setShowroomName] = useState<string>("");
  const { customers } = useTypedSelector((state) => state.customer);
  const { invoices, isLoading } = useTypedSelector((state) => state.invoice);
  const { showroom } = useTypedSelector((state) => state.showroom);
  const [date, setDate] = useState<string[]>([]);
  const { RangePicker } = DatePicker;
  const [filtered, setFiltered] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const filtered = searchTerm
      ? invoices.filter((iv) => iv.showroomInvoiceCode.includes(searchTerm))
      : invoices;

    if (filtered) {
      setFiltered(filtered);
    }
  }, [invoices, searchTerm]);

  return (
    <div>
      {/**
       * Single Invocie
       */}
      <SingleInvoice
        invoiceData={invoiceData}
        showInvoice={showInvoice}
        setShowInvoice={setShowInvoice}
      />

      <div className={"flex justify-end my-4 space-x-2"}>
        <button
          className={"report__btn text-white bg-green-500"}
          onClick={() => {
            // Create a new workbook
            const workbook = XLSX.utils.book_new();

            // Create a new worksheet for the product data
            const productsWorksheet = XLSX.utils.json_to_sheet(
              filtered.flatMap(
                ({
                  showroomInvoiceCode,
                  customerName,
                  customerMobile: customerPhone,
                  products,
                  createdAt,
                }) =>
                  products.map(
                    ({
                      productGroup,
                      sellPriceAfterDiscount,
                      sellPrice,
                      itemCode,
                      employee,
                    }) => ({
                      Date: new Date(createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                      }),
                      Invoice_Code: showroomInvoiceCode,
                      Customer_Name: customerName,
                      Customer_Mobile: customerPhone,
                      Product_Name: productGroup,
                      Product_Code: itemCode,
                      EMP_NAME: employee?.empName,
                      Discount_Price: formatPrice(sellPriceAfterDiscount),
                      Tag_Price: formatPrice(sellPrice),
                    })
                  )
              )
            );

            // Add the product worksheet to the workbook
            XLSX.utils.book_append_sheet(
              workbook,
              productsWorksheet,
              "Invoices"
            );

            // Write the workbook to a file
            XLSX.writeFile(workbook, "invoice.xlsx");
          }}
        >
          <FaFileExcel />
          Excel
        </button>
        <input
          type="text"
          placeholder="Search"
          className="focus:outline-none rounded-md w-250 pl-2"
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {currentUser?.role === "SuperAdmin" ? (
          <>
            <Select
              className={"w-[200px]"}
              placeholder={"Select Showroom"}
              onChange={(e) => {
                setShowroomName(e);
              }}
              options={showroom.map((sr) => ({
                value: sr.showroomName,
                label: sr.showroomName,
              }))}
            />
          </>
        ) : (
          ""
        )}
        <RangePicker
          onChange={(_, values) => {
            setDate(values);
          }}
        />
        <CustomButton
          onClick={async () => {
            await dispatch(filterInvoice(date[0], date[1], showroomName));
          }}
        >
          Filter
        </CustomButton>
      </div>
      <Table
        loading={isLoading}
        className={"text-center"}
        dataSource={filtered}
        rowKey={(obj: Invoice) => obj.id}
        pagination={{ defaultPageSize: 30 }}
        rowClassName={
          "dark:bg-slate-700 dark:text-white dark:hover:text-primaryColor-900"
        }
      >
        <Table.Column title={"#"} render={(text, record, index) => index + 1} />
        <Table.Column title={"Invoice No"} dataIndex={"showroomInvoiceCode"} />
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
          title="Payment Method"
          render={(_, obj: Invoice) => {
            return obj?.paymentMethod?.paymentMethod;
          }}
        />
        <Table.Column
          title={"Customer"}
          render={(_, record: Invoice) => {
            const customer = customers.find(
              (c) => c.customerPhone === record.customerMobile
            );
            return (
              <Link to={`/dashboard/customer/${customer?.id}`}>
                {record.customerName}
              </Link>
            );
          }}
        />

        {currentUser?.role.includes(UserRole[0]) ? (
          <Table.Column
            title={"Showroom"}
            dataIndex={"showroomName"}
            filters={invoices.map((iv) => ({
              text: iv.showroomName,
              value: iv.showroomName,
            }))}
          />
        ) : null}

        <Table.Column
          title={"Actions"}
          dataIndex={"invoiceNo"}
          render={(text, record: Invoice, index) => {
            return (
              <div className={"flex"}>
                <Button
                  onClick={() => {
                    setShowInvoice(true);
                    setInvoiceData(record);
                  }}
                >
                  <AiOutlineEye />
                </Button>
                {/*<Button onClick={() => {}}>*/}
                {/*  <AiOutlineEdit />*/}
                {/*</Button>*/}
              </div>
            );
          }}
        />
        <Table.Column
          title={"Created"}
          render={(text, record: Invoice) => {
            return moment(record.createdAt).format("DD-MMM-YYYY");
          }}
        />
      </Table>
    </div>
  );
};

export default Invoice;
