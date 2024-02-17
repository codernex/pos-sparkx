import { Button, Modal, Table, Upload } from "antd";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useTypedSelector } from "../../../redux/store";
import {
  CommonInput,
  Pagination,
  PrintAble,
  SelectInput,
} from "../../components";
import { useSettingContext } from "../../context/SettingProver";
import { formatPrice, handleExcel } from "../../utils/helper";
import JsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AiOutlineEdit } from "react-icons/ai";
import { Form, Formik } from "formik";
import ConfirmationModal from "../../components/ConfirmationModal";
import { fetchProduct, updateProduct } from "../../../redux/actions/product";
import { filter } from "underscore";
import { baseURL } from "../../../api";
import { toast } from "react-toastify";
import { DraggerProps } from "antd/es/upload";

const AllProducts = () => {
  const tableComponent = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const { page, pageSize, setPage, setPageSize } = useSettingContext();

  const { products, isLoading } = useTypedSelector((state) => state.products);
  const { showroom } = useTypedSelector((state) => state.showroom);
  const [product, setProduct] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [dataTable, setDataTable] = useState<Product[]>([]);

  function handleClass(text: string) {
    switch (text) {
      case "Unsold":
        return "bg-red-400";
      case "Sold":
        return "bg-green-600";
      case "Final Damaged":
        return "bg-red-400";

      case "Return To Supplier":
        return "bg-red-500";
      case "Lost":
        return "bg-red-700";
    }
  }

  useEffect(() => {
    setDataTable(products);
  }, [products]);

  const handleFilter = (data: string) => {
    setDataTable(() => filter(products, (item) => item.itemCode === data));
  };

  // Update Bulk Product
  const { Dragger } = Upload;
  const [updateBulkModal, setUpdateBulkModal] = useState(false);

  const uploaderProps: DraggerProps = {
    name: "file",
    multiple: false,
    action: `${baseURL}/product/update`,
    onChange(info: any) {
      const { status, response } = info.file;
      if (status === "done") {
        toast.success(
          `Data Updating On Background, Please Reload After Some Time`
        );
        setUpdateBulkModal(false);
        dispatch(fetchProduct());
      } else if (status === "error") {
        toast.error(`${info.file.name} ${response?.message}`);
      }
    },
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    withCredentials: true,
    accept: ".xlsx",
    // iconRender: (file, _listType) => {
    //   return <FaFileExcel className='text-green-600' />;
    // }
  };

  return (
    <PrintAble
      title={"Products"}
      showPrint={false}
      handleExcel={() => handleExcel(products)}
      handleSearch={handleFilter}
      resetSearch={() => {
        setDataTable(products);
      }}
      handlePdf={async () => {
        const doc = new JsPDF();
        doc.text("Products", 10, 10);
        autoTable(doc, {
          startY: 20,
          head: [
            [
              "Product Name",
              "Item C.",
              "P. Code",
              "Lot Number",
              "Sell Price",
              "Status",
              "GP",
              "GM",
            ],
          ],
          body: products.map(
            ({
              productGroup,
              itemCode,
              productCode,
              lotNumber,
              sellPrice,
              sellingStatus,
              grossProfit,
              grossMargin,
            }) => [
              productGroup,
              itemCode,
              productCode,
              lotNumber,
              sellPrice,
              sellingStatus,
              grossProfit,
              Math.round(Number(grossMargin)),
            ]
          ),
          styles: { fontStyle: "bold", fontSize: 10 },
        });

        doc.save("products.pdf");
      }}
    >
      <div className="w-full">
        <Button
          className="mb-2 w-70 bg-white"
          onClick={() => setUpdateBulkModal(true)}
        >
          Update Bulk Product
        </Button>
        <Modal
          open={updateBulkModal}
          onCancel={() => setUpdateBulkModal(false)}
          footer={false}
        >
          <Dragger className="mt-3" {...uploaderProps}>
            <p className="text-lg font-semibold dark:text-white">
              Click or drag file to this area to upload
            </p>
          </Dragger>
        </Modal>
      </div>
      {/*Product Update Modal*/}
      <Modal open={open} onCancel={() => setOpen(false)} footer={false}>
        {product ? (
          <>
            <h1>
              {product.productGroup} - {product.itemCode}
            </h1>
            <Formik
              initialValues={{
                sellPrice: product.sellPrice,
                unitCost: product.unitCost,
                size: product.size ? product.size : "",
                sellingStatus: product.sellingStatus,
              }}
              onSubmit={async (values) => {
                if (product) {
                  await dispatch(updateProduct(product.id, values));
                }
                setOpen(false);
              }}
              enableReinitialize={true}
            >
              {({ handleSubmit, values, handleChange }) => (
                <>
                  <ConfirmationModal
                    open={confirmationModal}
                    setOpen={setConfirmationModal}
                    execute={async () => handleSubmit()}
                  />
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setConfirmationModal(true);
                    }}
                    className={"space-y-2"}
                  >
                    <CommonInput
                      label={"Size"}
                      name={"size"}
                      placeholder={"EX: 42,45,M,S"}
                      value={values.size}
                      onChange={handleChange}
                    />
                    <CommonInput
                      label={"Sell Price"}
                      name={"sellPrice"}
                      placeholder={"EX: 200tk"}
                      value={values.sellPrice}
                      onChange={handleChange}
                    />
                    <CommonInput
                      label={"Unit Cost"}
                      name={"unitCost"}
                      placeholder={"EX: 200tk"}
                      value={values.unitCost}
                      onChange={handleChange}
                    />
                    <SelectInput
                      label={"Product Status"}
                      name={"sellingStatus"}
                      value={values.sellingStatus}
                      onChange={handleChange}
                      children={[
                        "Lost",
                        "Final Damaged",
                        "Unsold",
                        "Return To Supplier",
                      ].map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    />
                    <button className={"btn__common"} type={"submit"}>
                      Update Product
                    </button>
                  </Form>
                </>
              )}
            </Formik>
          </>
        ) : null}
      </Modal>
      {/*All Product Data*/}
      <Table
        dataSource={dataTable}
        id="productData"
        ref={tableComponent}
        rowKey={(obj) => obj.itemCode}
        loading={isLoading}
        pagination={{
          total: products.length,
          pageSize: pageSize,
          current: page,
          onChange: (page, size) => {
            setPage(page);
            setPageSize(size);
          },
          style: {
            display: "none",
          },
        }}
        bordered
        rowClassName={
          "dark:bg-slate-700 dark:text-white dark:hover:text-primaryColor-900"
        }
      >
        <Table.Column
          title="Item Code"
          dataIndex={"itemCode"}
          sorter={(a: Product, b: Product) =>
            a.itemCode.localeCompare(b.itemCode)
          }
        />
        <Table.Column title="Product Code" dataIndex={"productCode"} />
        <Table.Column title="Product Name" dataIndex={"productGroup"} />
        <Table.Column title={"Lot Number"} dataIndex={"lotNumber"} />
        <Table.Column
          title={"Size"}
          render={(_, record: Product) => {
            return record.size ? record.size : "-";
          }}
        />
        {/* <Table.Column title="Current Location" dataIndex={"whName"} /> */}
        <Table.Column
          title="Current Location"
          dataIndex={"showroomName"}
          filters={showroom.map((item) => ({
            text: item.showroomName,
            value: item.showroomName,
          }))}
          filtered={true}
          onFilter={(value, record: Product) => record.showroomName === value}
        />
        <Table.Column
          title="Price"
          dataIndex={"sellPrice"}
          render={(_, obj: Product) => formatPrice(obj.sellPrice)}
        />
        <Table.Column
          title="Selling Status"
          dataIndex={"sellingStatus"}
          render={(text, record: Product) => {
            return (
              <button
                className={` text-slate-100 rounded px-2 py-1 ${handleClass(
                  text
                )}`}
              >
                {record.sellingStatus}
              </button>
            );
          }}
          filters={[
            { text: "Unsold", value: "Unsold" },
            { text: "Sold", value: "Sold" },
            { text: "Lost", value: "Lost" },
            { text: "Final Damaged", value: "Final Damaged" },
            { text: "Return To Supplier", value: "Return To Supplier" },
          ]}
          onFilter={(value, record) => record.sellingStatus === value}
        />
        <Table.Column
          title={"Returned"}
          render={(_, record: Product) => {
            return record.returnStatus ? (
              <span className={"text-red-700"}>Returned</span>
            ) : (
              "-"
            );
          }}
        />
        <Table.Column
          title={"Action"}
          render={(_, record: Product) => {
            return (
              <AiOutlineEdit
                cursor={"pointer"}
                fontSize={18}
                onClick={() => {
                  setOpen(true);
                  setProduct(record);
                }}
              />
            );
          }}
        />
      </Table>
      <Pagination
        currentPage={page}
        pageSize={pageSize}
        total={products.length}
        onChange={(page, size) => {
          setPage(page);
          setPageSize(size);
        }}
      />
    </PrintAble>
  );
};

export default AllProducts;
