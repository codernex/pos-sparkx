import { Modal, Table, Upload } from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  deleteSupplier,
  getSupplier,
  updateSupplier,
} from "../../../redux/actions/supplier";
import { useAppDispatch, useTypedSelector } from "../../../redux/store";
import { CommonInput, Pagination, PrintAble } from "../../components";
import { useSettingContext } from "../../context/SettingProver";
import { DraggerProps } from "antd/es/upload";
import { toast } from "react-toastify";
import { handleExcel, handlePrint } from "../../utils/helper";
import { Form, Formik } from "formik";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import ConfirmationModal from "../../components/ConfirmationModal";
import { baseURL } from "../../../api";

const Supplier = () => {
  const { isLoading, suppliers } = useTypedSelector((state) => state.supplier);
  const { page, pageSize, setPage, setPageSize } = useSettingContext();

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getSupplier());
  }, [dispatch]);
  const cRef = useRef(null);

  const [showImportModal, setShowImportModal] = useState(false);
  const [editableSupplier, setEditableSupplier] = useState<Supplier | null>();
  const [editModal, setEditableModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);

  const { Dragger } = Upload;

  const uploaderProps: DraggerProps = {
    name: "file",
    multiple: false,
    action: `${baseURL}/supplier/import`,
    method: "POST",
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
    // iconRender: (file, _listType) => {
    //   return <FaFileExcel className='text-green-600' />;
    // }
  };

  return (
    <PrintAble
      title={"Suppliers"}
      showPDF={false}
      handlePrint={() =>
        handlePrint(suppliers, [
          "supplierName",
          {
            field: "contactPersonName",
            displayName: "Contact Name",
          },
          {
            field: "contactPersonNumber",
            displayName: "Contact Number",
          },
          {
            field: "altContactNumber",
            displayName: "Alt Number",
          },
          "supplierEmail",
          "supplierAddress",
        ])
      }
      btnText={"Import Supplier"}
      handleClick={() => setShowImportModal(true)}
      handleExcel={() => handleExcel(suppliers)}
    >
      <Modal
        footer={false}
        open={showImportModal}
        onCancel={() => setShowImportModal(false)}
      >
        <Dragger {...uploaderProps}>
          <p className="text-lg font-semibold">
            Click or drag file to this area to upload
          </p>
        </Dragger>
      </Modal>

      <Modal
        footer={false}
        open={editModal}
        onCancel={() => setEditableModal(false)}
      >
        <Formik
          initialValues={{
            supplierName: editableSupplier?.supplierName,
            supplierEmail: editableSupplier?.supplierEmail,
            altContactNumber: editableSupplier?.altContactNumber,
            supplierAddress: editableSupplier?.supplierAddress,
            contactPersonName: editableSupplier?.contactPersonName,
            contactPersonNumber: editableSupplier?.contactPersonNumber,
            extraInfo: editableSupplier?.extraInfo,
          }}
          enableReinitialize={true}
          onSubmit={async (values) => {
            editableSupplier &&
              (await dispatch(updateSupplier(editableSupplier.id, values)));
          }}
        >
          {({ handleSubmit }) => (
            <Form
              className={"flex flex-col items-center gap-y-2"}
              method={"POST"}
              onSubmit={(e) => {
                e.preventDefault();
                setConfirmationModal(true);
              }}
            >
              <ConfirmationModal
                open={confirmationModal}
                setOpen={setConfirmationModal}
                execute={async () => handleSubmit()}
              />
              <CommonInput label={"Supplier Name"} name={"supplierName"} />
              <CommonInput
                label={"Contact Number"}
                name={"contactPersonNumber"}
              />
              <CommonInput
                label={"Alternative Number"}
                name={"altContactNumber"}
              />
              <CommonInput label={"Email"} name={"supplierEmail"} />
              <CommonInput label={"Address"} name={"supplierAddress"} />
              <CommonInput
                label={"Contact Person Name"}
                name={"contactPersonName"}
              />
              <CommonInput label={"Extra Info"} name={"extraInfo"} />
              <button className={"btn__common"}>Update</button>
            </Form>
          )}
        </Formik>
      </Modal>
      <Table
        dataSource={suppliers}
        id="supplierData"
        ref={cRef}
        loading={isLoading}
        rowKey={(object) => object.supplierName}
        rowClassName={
          "dark:bg-slate-700 dark:text-white dark:hover:text-primaryColor-900"
        }
        pagination={{
          current: page,
          total: suppliers.length,
          pageSize: pageSize,
          onChange: (page, size) => {
            setPage(page);
            setPageSize(size);
          },
          style: {
            display: "none",
          },
        }}
      >
        <Table.Column
          title="Supplier Name"
          dataIndex={"supplierName"}
          key="supplierName"
        />
        <Table.Column
          title="Contact Person"
          dataIndex={"contactPersonName"}
          key="contactPersonName"
        />
        <Table.Column
          title="Contact Number"
          dataIndex={"contactPersonNumber"}
          key="contactPersonNumber"
        />
        <Table.Column
          title="Alt Number"
          dataIndex={"altContactNumber"}
          key={"altContactNumber"}
        />
        <Table.Column
          title="Supplier Email"
          dataIndex={"supplierEmail"}
          key="supplierEmail"
        />
        <Table.Column
          title="Supplier Adress"
          dataIndex={"supplierAddress"}
          key="supplierAddress"
        />
        <Table.Column
          title="Supplier Actions"
          dataIndex={"id"}
          key={"id"}
          render={(_: any, record: Supplier) => {
            return (
              <div className={"text-xl flex gap-x-3"}>
                <AiOutlineEdit
                  cursor={"pointer"}
                  onClick={() => {
                    setEditableModal(true);
                    setEditableSupplier(record);
                  }}
                />
                <ConfirmationModal
                  open={deleteConfirmationModal}
                  setOpen={setDeleteConfirmationModal}
                  execute={async () => {
                    itemToDelete &&
                      (await dispatch(deleteSupplier(itemToDelete)));
                  }}
                />
                <AiOutlineDelete
                  cursor={"pointer"}
                  onClick={() => {
                    setItemToDelete(record.id);
                    setDeleteConfirmationModal(true);
                  }}
                />
              </div>
            );
          }}
        />
      </Table>

      <Pagination
        currentPage={page}
        total={suppliers.length}
        onChange={(page, size) => {
          setPage(page);
          setPageSize(size);
        }}
        pageSize={pageSize}
      />
    </PrintAble>
  );
};

export default Supplier;
