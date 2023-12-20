import React, { useState } from "react";
import { Button, Select, Table } from "antd";
import { useAppDispatch, useTypedSelector } from "../../../redux/store";
import { fetchAudit } from "../../../redux/actions/audit";
import { handleExcel } from "../../utils/helper";
import printJS from "print-js";
import JsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface AuditProps {}

const Audit: React.FC<AuditProps> = () => {
  const dispatch = useAppDispatch();
  const { showroom } = useTypedSelector((state) => state.showroom);
  const { suppliers } = useTypedSelector((state) => state.supplier);
  const { productGroup } = useTypedSelector((state) => state.productGroup);
  const { products, isLoading } = useTypedSelector((state) => state.audit);
  const [showroomName, setShowroomName] = useState<string>("");
  const [supplierName, setSupplierName] = useState<string>("");
  const [productGroupName, setProductGroupName] = useState<string>("");

  return (
    <div className={"mt-4"}>
      <h1 className={"text-xl font-semibold"}>Audit</h1>
      <div
        className={
          "h-80 bg-white rounded flex items-center justify-center space-x-5 mt-4"
        }
      >
        <div className={"flex flex-col"}>
          <span>Select Showroom</span>
          <Select
            showSearch={true}
            showArrow={true}
            style={{ width: "200px" }}
            value={showroomName}
            onChange={(value) => setShowroomName(value)}
            options={showroom.map((item) => ({
              label: item.showroomName,
              value: item.showroomName,
            }))}
          />
        </div>
        <div className={"flex flex-col"}>
          <span>Select Supplier (Default: All)</span>
          <Select
            showSearch={true}
            showArrow={true}
            placeholder={"Select Supplier"}
            style={{ width: "200px" }}
            value={supplierName}
            onChange={(value) => setSupplierName(value)}
            options={suppliers.map((item) => ({
              label: item.supplierName,
              value: item.supplierName,
            }))}
          />
        </div>
        <div className={"flex flex-col"}>
          <span>Select Product Group (Default: All)</span>
          <Select
            showSearch={true}
            showArrow={true}
            placeholder={"Product Group"}
            style={{ width: "200px" }}
            value={productGroupName}
            onChange={(value) => setProductGroupName(value)}
            options={productGroup.map((item) => ({
              label: item.productName,
              value: item.productName,
            }))}
          />
        </div>
        <Button
          className={"mt-5"}
          onClick={async () => {
            await dispatch(
              fetchAudit(showroomName, supplierName, productGroupName)
            );
          }}
        >
          Show
        </Button>
        <Button
          className={"mt-5"}
          onClick={() => {
            setSupplierName("");
            setProductGroupName("");
            setShowroomName("");
          }}
        >
          Clear
        </Button>
      </div>
      <Table
        dataSource={products}
        style={{ marginTop: "20px" }}
        bordered={true}
        loading={isLoading}
        rowClassName={
          "dark:bg-slate-700 dark:text-white dark:hover:text-primaryColor-900"
        }
        id={"auditData"}
      >
        <Table.Column title={"SL"} render={(_, record, index) => index + 1} />
        <Table.Column title={"Product Group"} dataIndex={"productGroup"} />
        <Table.Column title={"Product Code"} dataIndex={"itemCode"} />
        <Table.Column title={"Supplier Name"} dataIndex={"supplierName"} />
        <Table.Column title={"Product Group"} dataIndex={"productGroup"} />
        <Table.Column title={"Tag Price"} dataIndex={"sellPrice"} />
        <Table.Column title={"Remark"} dataIndex={"sellingStatus"} />
      </Table>
      <div className={"space-x-2"}>
        <Button
          type={"primary"}
          className={"bg-blue-600 text-white"}
          onClick={() => {
            printJS({
              printable: products.map((item) => ({
                htmlCode:
                  '<div style="text-align:center"><input type="checkbox"></div>',
                htmlRemark: "<span></span>",
                htmlProductGroup: `
                <div style="display:flex;flex-direction:column;align-items:center">
                <p style="margin: 0;">${item.productGroup}</p>
                <p style="margin: 0;display:flex;justify-content:flex-start">${item.itemCode}</p></div>
                `,
                sellPrice: `<p style="text-align:center;padding:10px 0;">${item.sellPrice}</p`,
                supplierName: `<p style="text-align:center;padding:10px 0;">${item.supplierName}</p`,
                productGroup: `<p style="text-align:center;padding:10px 0;">${item.productGroup}</p`,
              })),
              properties: [
                { field: "htmlCode", displayName: "CB" },
                { field: "htmlProductGroup", displayName: "Product" },
                { field: "supplierName", displayName: "Supplier" },
                { field: "productGroup", displayName: "Product Group" },
                {
                  field: "sellPrice",
                  displayName: "Tag Price",
                },
                {
                  field: "htmlRemark",
                  displayName: "Remark",
                },
              ],
              header: `<div style="margin-bottom:20px">
              <h3 style="margin: 0;padding: 0;text-align: center">Audit Data (${
                products[0].showroomName
              })</h3> <p style="margin: 0;padding: 0;text-align: center">${new Date(
                Date.now()
              ).toLocaleTimeString("en", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}</p>
              </div>`,
              type: "json",
              gridStyle:
                "width:fit-content;font-size: 12px;font-family: sans-serif;border: 1px solid #ccc",
              targetStyle: ["border,text-align: center"],
              showModal: true,
              gridHeaderStyle:
                "font-size: 12px;font-family: sans-serif;border: 1px solid #ccc;width:fit-content",
            });
          }}
        >
          <span className={"text-white"}>Print</span>
        </Button>
        <Button
          className={"bg-green-500 text-white"}
          type={"primary"}
          onClick={() => {
            products.length &&
              handleExcel(products, "Audit Data", "Audit Data");
          }}
        >
          <span className={"text-white"}>Excel</span>
        </Button>
        <Button
          className={"bg-red-900 text-white"}
          type={"primary"}
          onClick={() => {
            const doc = new JsPDF();
            autoTable(doc, {
              html: "auditData",
              startY: 20,
            });
            doc.save("audit.pdf");
          }}
        >
          <span className={"text-white"}>PDF </span>
        </Button>
      </div>
    </div>
  );
};

export default Audit;
