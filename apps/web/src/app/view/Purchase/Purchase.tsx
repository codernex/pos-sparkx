import { Table } from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import { fetchPurchase } from "../../../redux/actions/purchase";
import { useAppDispatch, useTypedSelector } from "../../../redux/store";
import PrintAbleLayout from "../../components/PrintAbleLayout";

interface PurchaseProps {}

const Purchase: React.FC<PurchaseProps> = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    (async () => {
      await dispatch(fetchPurchase());
    })();
  }, [dispatch]);
  const { purchases, isLoading } = useTypedSelector((state) => state.purchase);

  return (
    <PrintAbleLayout
      title={"Purchases"}
      showPrint={false}
      showPDF={false}
      showExcel={false}
    >
      <Table
        dataSource={purchases.filter((p) => p.invoiceNo)}
        loading={isLoading}
        rowClassName={
          "dark:bg-slate-700 dark:text-white dark:hover:text-primaryColor-900"
        }
      >
        <Table.Column
          title="SL"
          render={(_, rec: Purchase, index) => index + 1}
        />
        <Table.Column title="Invoice No" dataIndex={"invoiceNo"} />
        <Table.Column title="Supplier" dataIndex={"supplierName"} />
        <Table.Column title="Amount" dataIndex={"purchaseAmount"} />
        <Table.Column title="Status" dataIndex={"purchaseStatus"} />
        <Table.Column title="QTY" dataIndex={"quantity"} />
        <Table.Column
          title="Date"
          render={(_, rec: Purchase) =>
            moment(rec.createdAt).format("DD-MM-YYYY")
          }
        />
      </Table>
    </PrintAbleLayout>
  );
};

export default Purchase;
