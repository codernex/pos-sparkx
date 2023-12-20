import { Modal, Table, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { getProductGroup } from "../../../redux/actions/productGroup";
import { useAppDispatch, useTypedSelector } from "../../../redux/store";
import { Pagination, PrintAble } from "../../components";
import { useSettingContext } from "../../context/SettingProver";
import { DraggerProps } from "antd/es/upload";
import { baseURL } from "../../../api";
import { toast } from "react-toastify";

const ProductGroup = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getProductGroup());
  }, [dispatch]);

  const { isLoading, productGroup } = useTypedSelector(
    (state) => state.productGroup
  );
  const { page, setPage, pageSize, setPageSize } = useSettingContext();

  const [showImportModal, setShowImportModal] = useState(false);

  const { Dragger } = Upload;

  const uploaderProps: DraggerProps = {
    name: "file",
    multiple: false,
    action: `${baseURL}/product/group/import`,
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
      title={"Product Groups"}
      handlePrint={() => {}}
      showPrint={false}
      showPDF={false}
      showExcel={false}
      btnText={"Import Group"}
      handleClick={() => setShowImportModal(true)}
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
      <Table
        id="productGroup"
        dataSource={productGroup}
        rowKey={(obj) => obj.productName}
        pagination={false}
        loading={isLoading}
        rowClassName={
          "dark:bg-slate-700 dark:text-white dark:hover:text-primaryColor-900"
        }
      >
        <Table.Column
          title="Product Name"
          dataIndex="productName"
          key="productName"
        />
        <Table.Column
          title="Product Code"
          dataIndex="productCode"
          key="productCode"
        />
        <Table.Column
          title="Category"
          dataIndex="productCategory"
          key="productCategory"
        />
      </Table>
      <Pagination
        currentPage={page}
        total={productGroup.length}
        onChange={(page, size) => {
          setPage(page);
          setPageSize(size);
        }}
        pageSize={pageSize}
      />
    </PrintAble>
  );
};

export default ProductGroup;
