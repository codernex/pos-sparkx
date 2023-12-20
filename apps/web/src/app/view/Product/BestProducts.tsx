import React, { useMemo, useState } from "react";
import PrintAbleLayout from "../../components/PrintAbleLayout";
import { Table } from "antd";
import { useTypedSelector } from "../../../redux/store";
import { groupedProducts } from "../../utils";
import DateFilter from "../../components/DateFilter";
import { useFilteredSoldProduct } from "../../hooks";

const BestProducts: React.FC = () => {
  const { products } = useTypedSelector((state) => state.products);
  const [date, setDate] = useState<string[]>([]);
  const soldProducts = useMemo(
    () => products.filter((p) => p.sellingStatus === "Sold"),
    [products]
  );
  const [reset, setReset] = useState(false);

  const filteredProducts = useFilteredSoldProduct(
    soldProducts,
    date[0],
    date[1]
  );

  const bestProducts = useMemo(
    () =>
      groupedProducts(filteredProducts).sort((a, b) => b.quantity - a.quantity),
    [filteredProducts]
  );

  return (
    <PrintAbleLayout
      title="Best Products"
      showExcel={false}
      showPDF={false}
      showPrint={false}
    >
      <DateFilter onChange={setDate} />
      <Table
        dataSource={bestProducts}
        rowKey={(obj: Product) => obj.id}
        pagination={false}
      >
        <Table.Column title="SL" render={(_, p, i) => i + 1} />
        <Table.Column title="Product Name" dataIndex={"productGroup"} />
        <Table.Column
          title="Total Sold Amount"
          render={(_, p: Product) => p.sellPriceAfterDiscount * p.quantity}
        />
        <Table.Column title="Sold Qty" dataIndex={"quantity"} />
      </Table>
    </PrintAbleLayout>
  );
};
export default BestProducts;
