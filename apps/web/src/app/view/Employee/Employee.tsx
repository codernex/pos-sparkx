import React, { useEffect, useState } from "react";
import { useAppDispatch, useTypedSelector } from "../../../redux/store";
import { Modal, Table } from "antd";
import PrintAbleLayout from "../../components/PrintAbleLayout";
import { Form, Formik } from "formik";
import { Button, CommonInput, SelectInput } from "../../components";
import {
  createEmployee,
  deleteEmployee,
  fetchEmployee,
  updateEmployee,
} from "../../../redux/actions/employee";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye } from "react-icons/ai";
import ConfirmationModal from "../../components/ConfirmationModal";
import { handleExcel, handlePrint } from "../../utils/helper";
import moment from "moment";
import { useSettingContext } from "../../context/SettingProver";

interface EmployeeProps {}

const Employee: React.FC<EmployeeProps> = () => {
  const dispatch = useAppDispatch();

  const {
    employee: { isLoading },
    showroom,
  } = useTypedSelector((state) => state);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [editAble, setEditAble] = React.useState<IEmployee | null>(null);
  const [confirmationModal, setConfirmationModal] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState(0);
  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [employee, setEmployee] = React.useState<IEmployee | null>(null);
  const { currentUser } = useSettingContext();

  const [employees, setEmployees] = useState<IEmployee[]>([]);

  return (
    <div>
      {/*Add Employee Modal*/}
      <Modal footer={false} open={openAdd} onCancel={() => setOpenAdd(false)}>
        <Formik
          initialValues={{
            empName: "",
            empPhone: "",
            designation: "",
            empAddress: "",
            empEmail: "",
            empSalary: 0,
            showroomCode: "",
          }}
          onSubmit={async (values, { resetForm }) => {
            dispatch(createEmployee(values));
            setOpenAdd(false);
            resetForm();
          }}
        >
          <Form>
            <CommonInput
              label={"Name *"}
              name={"empName"}
              placeholder={"Employee Name "}
              required={true}
            />
            <CommonInput
              label={"Email"}
              name={"empEmail"}
              placeholder={"Employee Email"}
              required={false}
            />
            <CommonInput
              label={"Emp ID *"}
              name={"empPhone"}
              placeholder={"Employee ID"}
              required={true}
            />
            <CommonInput
              label={"Address"}
              name={"empAddress"}
              placeholder={"Employee Address"}
              required={false}
            />
            <CommonInput
              label={"Salary Amount"}
              type={"number"}
              name={"empSalary"}
              placeholder={"Employee Salary"}
              required={false}
            />
            <SelectInput
              required={true}
              name={"designation"}
              label={"Select Designation"}
            >
              <option value={"Manager"}>Manager</option>
              <option value={"SalesMan"}>SalesMan</option>
              <option value={"Other"}>Other</option>
            </SelectInput>

            {currentUser?.role === "SuperAdmin" ? (
              <SelectInput
                required={true}
                name={"showroomCode"}
                label={"Select Showroom Code"}
              >
                {showroom.showroom.map((sr) => {
                  return (
                    <option key={sr.id} value={sr.showroomCode}>
                      {sr.showroomName}
                    </option>
                  );
                })}
              </SelectInput>
            ) : (
              ""
            )}
            <Button type={"submit"}>Add Employee</Button>
          </Form>
        </Formik>
      </Modal>

      {/*Edit Employee Modal*/}

      <Modal footer={false} open={openEdit} onCancel={() => setOpenEdit(false)}>
        {editAble && (
          <Formik
            initialValues={{
              empName: editAble.empName,
              empPhone: editAble.empPhone,
              designation: editAble.designation,
              empAddress: editAble.empAddress,
              showroom: editAble.showroom,
              empEmail: editAble.empEmail,
              empSalary: editAble.empSalary,
            }}
            enableReinitialize={true}
            onSubmit={async (values) => {
              dispatch(updateEmployee(editAble.id, values));
              dispatch(fetchEmployee());
              setOpenAdd(false);
            }}
          >
            <Form>
              <CommonInput
                label={"Name *"}
                name={"empName"}
                placeholder={"Employee Name "}
                required={true}
              />
              <CommonInput
                label={"Email"}
                name={"empEmail"}
                placeholder={"Employee Email"}
                required={false}
              />
              <CommonInput
                label={"Phone *"}
                name={"empPhone"}
                placeholder={"Employee Phone"}
                required={true}
              />
              <CommonInput
                label={"Address"}
                name={"empAddress"}
                placeholder={"Employee Address"}
                required={false}
              />
              <CommonInput
                type={"number"}
                label={"Salary Amount"}
                name={"empSalary"}
                placeholder={"Employee Salary"}
                required={false}
              />
              <SelectInput
                required={true}
                name={"designation"}
                label={"Select Designation"}
              >
                <option value={"Manager"}>Manager</option>
                <option value={"SalesMan"}>SalesMan</option>
                <option value={"Other"}>Other</option>
              </SelectInput>

              <Button type={"submit"}>Update Employee</Button>
            </Form>
          </Formik>
        )}
      </Modal>
      {/*View Employee Modal*/}
      <Modal
        width={1000}
        footer={false}
        open={openViewModal}
        onCancel={() => setOpenViewModal(false)}
      >
        <div className={"text-[16px]  space-y-2"}>
          <table className={"customer__table"}>
            <thead>
              <tr>
                <th>Name</th>
                <th>EMP ID</th>
                <th>Email</th>
                <th>Designation</th>
                <th>Address</th>
                <th>Total Sales</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{employee?.empName}</td>
                <td>{employee?.empPhone}</td>
                <td>{employee?.empEmail}</td>
                <td>{employee?.designation}</td>
                <td>{employee?.empAddress}</td>
                <td> {employee?.sales?.length}</td>
              </tr>
            </tbody>
          </table>
          <div className={"mt-6"}>
            <h1
              className={
                "text-xl font-semibold font-inter text-primaryColor-900"
              }
            >
              Sales Table
            </h1>
            <Table dataSource={employee?.sales} rowKey={(obj) => obj.id}>
              <Table.Column title={"sl"} render={(_, rec, i) => i + 1} />
              <Table.Column
                title={"Item Code"}
                render={(_, rec: Product) => rec.itemCode}
              />
              <Table.Column
                title={"Sells Price"}
                render={(_, rec: Product) => rec.sellPriceAfterDiscount}
              />
              <Table.Column
                title={"Date"}
                filtered={true}
                render={(_, record: Invoice) =>
                  moment(record.updatedAt).format("DD-MMM-YYYY hh:mm:a")
                }
              />
            </Table>
          </div>

          <div className={"mt-6"}>
            <h1
              className={
                "text-xl font-semibold font-inter text-primaryColor-900"
              }
            >
              Sales Return Table
            </h1>
            <Table dataSource={employee?.returnSales} rowKey={(obj) => obj.id}>
              <Table.Column title={"sl"} render={(_, rec, i) => i + 1} />
              <Table.Column
                title={"Item Code"}
                render={(_, rec: Product) => rec.itemCode}
              />
              <Table.Column
                title={"Sells Price"}
                render={(_, rec: Product) => rec.sellPriceAfterDiscount}
              />
              <Table.Column
                title={"Date"}
                filtered={true}
                render={(_, record: Invoice) =>
                  moment(record.updatedAt).format("DD-MMM-YYYY hh:mm:a")
                }
              />
            </Table>
          </div>
        </div>
      </Modal>

      {/*Delete Employee Modal*/}
      <ConfirmationModal
        open={confirmationModal}
        setOpen={setConfirmationModal}
        execute={async () => {
          await dispatch(deleteEmployee(itemToDelete));
          setConfirmationModal(false);
        }}
      />
      {/*All Employees Table*/}
      <PrintAbleLayout
        title={"Employees"}
        handlePrint={() => {
          handlePrint(
            employees,
            [
              { field: "empName", displayName: "Name" },
              { field: "empPhone", displayName: "Emp ID" },
              { field: "designation", displayName: "Designation" },
              { field: "empAddress", displayName: "Address" },
              { field: "showroom.showroomName", displayName: "Showroom" },
              { field: "empEmail", displayName: "Email" },
            ],
            "Employee Data"
          );
        }}
        handleExcel={() =>
          employees.length && handleExcel(employees, "_", "Employee Data")
        }
        btnText={"Add Employee"}
        handleClick={() => setOpenAdd(true)}
        showPDF={false}
        employeeFilter={true}
        setEmpData={setEmployees}
      >
        <Table
          rowKey={(obj) => obj.id}
          id={"employee"}
          dataSource={employees}
          loading={isLoading}
          rowClassName={
            "dark:bg-slate-700 dark:text-white dark:hover:text-primaryColor-900"
          }
        >
          <Table.Column title="Name" dataIndex="empName" key="empName" />
          <Table.Column
            title="EMP ID"
            dataIndex={"empPhone"}
            key={"empPhone"}
          />
          <Table.Column title="Email" dataIndex={"empEmail"} key={"empEmail"} />
          <Table.Column
            title="Address"
            dataIndex={"empAddress"}
            key={"empAddress"}
          />
          <Table.Column
            title="Basic Salary"
            dataIndex={"empSalary"}
            key={"empSalary"}
          />
          <Table.Column
            title="Designation"
            dataIndex={"designation"}
            key={"designation"}
          />
          <Table.Column
            title="Sales Count"
            render={(_, record: IEmployee) => record.sales?.length}
            key={"sales"}
          />
          <Table.Column
            title="Showroom"
            render={(_, record: IEmployee) => record.showroom?.showroomName}
            key={"showroom"}
          />
          <Table.Column
            title={"Actions"}
            render={(_, record: IEmployee) => {
              return (
                <div className={"flex text-xl gap-x-2"}>
                  <AiOutlineEye
                    cursor={"pointer"}
                    onClick={() => {
                      setEmployee(record);
                      setOpenViewModal(true);
                    }}
                  />
                  <AiOutlineEdit
                    cursor={"pointer"}
                    onClick={() => {
                      setEditAble(record);
                      setOpenEdit(true);
                    }}
                  />
                  <AiOutlineDelete
                    cursor={"pointer"}
                    onClick={async () => {
                      setItemToDelete(record.id);
                      setConfirmationModal(true);
                    }}
                  />
                </div>
              );
            }}
          />
        </Table>
      </PrintAbleLayout>
    </div>
  );
};

export default Employee;
