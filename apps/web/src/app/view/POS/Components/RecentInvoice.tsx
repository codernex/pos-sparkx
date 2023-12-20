import { Modal, Table } from "antd";
import React, { SetStateAction } from "react";

interface RecentInvoiceProps {
  isLoading: boolean;
  invoices: Invoice[];
  showRecentInvoice: boolean;
  setShowrecentInvoice: React.Dispatch<SetStateAction<boolean>>;
}

const RecentInvoice: React.FC<RecentInvoiceProps> = React.memo(
  ({ isLoading, invoices, showRecentInvoice, setShowrecentInvoice }) => {
    return (
      <Modal
        open={showRecentInvoice}
        onCancel={() => setShowrecentInvoice(false)}
        footer={false}
        width={"90vw"}
      >
        <Table
          loading={isLoading}
          className={"text-center"}
          dataSource={invoices}
          rowKey={(obj: Invoice, idx) => obj.id}
          pagination={{ defaultPageSize: 30 }}
          rowClassName={
            "dark:bg-slate-700 dark:text-white dark:hover:text-primaryColor-900"
          }
        >
          <Table.Column
            title={"#"}
            render={(text, record, index) => index + 1}
          />
          <Table.Column
            title={"Invoice No"}
            dataIndex={"showroomInvoiceCode"}
          />
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
          <Table.Column title={"Customer"} dataIndex={"customerName"} />

          <Table.Column
            title={"Created"}
            render={(text, record: Invoice) => {
              return new Date(record.createdAt).toDateString();
            }}
          />
        </Table>
      </Modal>
    );
  }
);
export default RecentInvoice;
