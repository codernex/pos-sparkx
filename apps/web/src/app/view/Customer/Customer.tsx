import React, { useEffect, useState } from "react";
import { Modal, Select, Table, Upload } from "antd";
import { useAppDispatch, useTypedSelector } from "../../../redux/store";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Form, Formik } from "formik";
import { Button, CommonInput } from "../../components";
import {
  deleteCustomer,
  fetchCustomer,
  updateCustomer,
} from "../../../redux/actions/customer";
import { Link } from "react-router-dom";
import { FaFileExcel, FaPlus, FaPrint } from "react-icons/fa";
import { DraggerProps } from "antd/es/upload";
import { baseURL } from "../../../api";
import { toast } from "react-toastify";
import { useSettingContext } from "../../context/SettingProver";
import { handleExcel, handlePrint } from "../../utils";

interface CustomerProps {}

const Customer: React.FC<CustomerProps> = () => {
  const dispatch = useAppDispatch();
  const { customers, isLoading } = useTypedSelector((state) => state.customer);
  const { showroom } = useTypedSelector((state) => state.showroom);

  const [editAbleCustomer, setEditAbleCustomer] =
    React.useState<ICustomer | null>(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [openImportModal, setImportModal] = React.useState(false);
  const { currentUser } = useSettingContext();
  const uploaderProps: DraggerProps = {
    name: "file",
    multiple: false,
    action: `${baseURL}/customer/import`,
    onChange(info: any) {
      const { status, response } = info.file;
      if (status === "done") {
        toast.success(
          `Data Importing On Background, Please Reload After Some Time`
        );
      } else if (status === "error") {
        toast.error(`${info.file.name} ${response?.message}`);
      }
    },
    withCredentials: true,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    accept: ".xlsx",
  };

  // FIltering customers

  const [filtered, setFiltered] = useState<ICustomer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showroomCode, setShowroomCode] = useState<string>("");

  useEffect(() => {
    let filteredCustomers = showroomCode
      ? customers.filter(
          (customer) => customer.showroom.showroomCode === showroomCode
        )
      : customers;

    if (searchTerm) {
      filteredCustomers = filteredCustomers.filter((c) =>
        c.customerPhone.includes(searchTerm)
      );
    }
    setFiltered(filteredCustomers);
  }, [showroomCode, customers, searchTerm]);

  useEffect(() => {
    dispatch(fetchCustomer());
  }, [dispatch]);
  return (
    <div className={"mt-10"}>
      <div className={"mb-4 flex space-x-5 bg-white py-3 px-1 rounded-md"}>
        <Link
          className={
            "border border-slate-400 flex w-[140px] items-center justify-center py-1 gap-x-2 dark:text-white"
          }
          to={"add"}
        >
          Customer <FaPlus />
        </Link>
        <input
          type="text"
          placeholder="Customer Mobile Number"
          className="focus:outline-none rounded-md w-250 pl-2 border"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {currentUser?.role === "SuperAdmin" ? (
          <Select
            value={showroomCode ? showroomCode : undefined}
            options={showroom.map((c) => ({
              label: c.showroomName,
              value: c.showroomCode,
            }))}
            className="w-32"
            placeholder="Select Showroom Code"
            onChange={(e: string) => setShowroomCode(e)}
          />
        ) : (
          ""
        )}
        <Button onClick={() => setImportModal(true)}>Import Customer</Button>

        <button
          onClick={() => handleExcel(filtered)}
          className="bg-green-600 text-white w-40 rounded-md flex items-center justify-center gap-x-2"
        >
          <FaFileExcel />
          Export
        </button>
        <button
          onClick={() => {
            handlePrint(
              filtered,
              [
                { field: "customerName", displayName: "Name" },
                { field: "customerPhone", displayName: "Phone" },
                // {
                //   field: `customerEmail`,
                //   displayName: 'Email'
                // },
                // {
                //   field: 'customerAddress',
                //   displayName: 'Address'
                // },
                { field: "showroom.showroomName", displayName: "Showroom" },
                { field: "paid", displayName: "Paid" },
                {
                  field: "purchasedProducts.length",
                  displayName: "Purchase QTY",
                },
                {
                  field: "crm",
                  displayName: "CRM",
                },
              ],
              "Employee Data"
            );
          }}
          className="bg-red-500 text-white w-40 rounded-md flex items-center justify-center gap-x-2"
        >
          <FaPrint />
          Print
        </button>
      </div>
      {editAbleCustomer && openModal ? (
        <Modal
          open={openModal}
          onCancel={() => {
            setOpenModal(false);
            setEditAbleCustomer(null);
          }}
          footer={false}
        >
          <Formik
            initialValues={editAbleCustomer}
            onSubmit={async (values) => {
              await dispatch(updateCustomer(values));
            }}
          >
            {() => (
              <Form className="space-y-2">
                <CommonInput label={"Customer Name"} name={"customerName"} />
                <CommonInput label={"Customer Phone"} name={"customerPhone"} />
                <CommonInput label={"Customer Email"} name={"customerEmail"} />
                <CommonInput
                  label={"Customer Address"}
                  name={"customerAddress"}
                />
                <Button type={"submit"} loading={isLoading}>
                  Update
                </Button>
              </Form>
            )}
          </Formik>
        </Modal>
      ) : null}
      <Modal
        open={openImportModal}
        onCancel={() => setImportModal(false)}
        footer={false}
      >
        <Upload.Dragger {...uploaderProps}>
          <p className="text-lg font-semibold">
            Click or drag file to this area to upload
          </p>
        </Upload.Dragger>
      </Modal>
      <Table
        dataSource={filtered}
        loading={isLoading}
        rowKey={(obj: ICustomer, i) => obj.id + "usx"}
        rowClassName={
          "dark:bg-slate-700 dark:text-white dark:hover:text-primaryColor-900"
        }
      >
        <Table.Column
          title="Name"
          render={(_, record: ICustomer) => {
            return (
              <Link
                to={`/dashboard/customer/${record.id}`}
                className={"text-blue-600"}
              >
                {record.customerName}
              </Link>
            );
          }}
        />
        <Table.Column title={"Contact No"} dataIndex={"customerPhone"} />
        <Table.Column title={"Email"} dataIndex={"customerEmail"} />
        <Table.Column title={"Address"} dataIndex={"customerAddress"} />
        <Table.Column
          title={"Showroom"}
          render={(value: ICustomer) => {
            return value?.showroom?.showroomName;
          }}
        />
        <Table.Column title={"Lifetime Paid"} dataIndex={"paid"} />
        <Table.Column
          title={"Actions"}
          render={(text, record: ICustomer, index) => {
            return (
              <div className={"flex text-2xl gap-x-2"}>
                <AiOutlineEdit
                  cursor={"pointer"}
                  onClick={() => {
                    setOpenModal(true);
                    setEditAbleCustomer(record);
                  }}
                />
                <AiOutlineDelete
                  cursor={"pointer"}
                  onClick={async () => {
                    if (!record.id) return;
                    await dispatch(deleteCustomer(record.id));
                  }}
                />
              </div>
            );
          }}
        />
      </Table>
    </div>
  );
};

export default Customer;
