import React, { useEffect, useState } from "react";
import PrintAbleLayout from "../../components/PrintAbleLayout";
import { useTypedSelector } from "../../../redux/store";
import { filter } from "underscore";
import { Table } from "antd";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { handleExcel, handlePrint } from "../../utils";

type Props = {};

const LostProduct = (props: Props) => {
  const { products } = useTypedSelector((state) => state.products);

  const [lostProducts, setLostProducts] = useState<Product[]>([]);

  useEffect(() => {
    setLostProducts(filter(products, (pr) => pr.sellingStatus === "Lost"));
  }, [products]);
  return (
    <PrintAbleLayout
      title="Lost Products"
      handlePdf={() => {
        const doc = new jsPDF();
        doc.text("Lost Products", 10, 10);
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
              "Showroom Name",
            ],
          ],
          body: lostProducts.map(
            ({
              productGroup,
              itemCode,
              productCode,
              lotNumber,
              sellPrice,
              sellingStatus,
              showroomName,
            }) => [
              productGroup,
              itemCode,
              productCode,
              lotNumber,
              sellPrice,
              sellingStatus,
              showroomName,
            ]
          ),
          styles: { fontStyle: "bold", fontSize: 10 },
        });

        doc.save("products.pdf");
      }}
      handleExcel={() =>
        handleExcel(lostProducts, "Lost Products", "Lost Products")
      }
      handlePrint={() =>
        handlePrint(
          lostProducts,
          [
            { field: "itemCode", displayName: "Item Code" },
            { field: "productGroup", displayName: "Product Group" },
            { field: "sellPrice", displayName: "Sell Price" },
            { field: "sellingStatus", displayName: "Status" },
            { field: "showroomName", displayName: "Showroom Name" },
          ],
          "Lost Products"
        )
      }
    >
      <Table
        dataSource={lostProducts}
        rowKey={(obj: Product) => obj.id}
        pagination={{
          pageSize: 50,
        }}
      >
        <Table.Column title="Item Code" dataIndex={"itemCode"} />
        <Table.Column title="Product Name" dataIndex={"productGroup"} />
        <Table.Column title="Product Status" dataIndex={"sellingStatus"} />
        <Table.Column title="Sell Price" dataIndex={"sellPrice"} />
        <Table.Column title="Showroom Name" dataIndex={"showroomName"} />
      </Table>
    </PrintAbleLayout>
  );
};

export default LostProduct;
