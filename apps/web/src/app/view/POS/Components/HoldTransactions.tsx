import { Modal, Table } from "antd";
import React, { SetStateAction, useState } from "react";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { AiOutlineEdit } from "react-icons/ai";
import { BiReset } from "react-icons/bi";
import moment from "moment";
import { useAppDispatch } from "../../../../redux/store";
import { fetchHold, removeHold } from "../../../../redux/actions/hold";

interface HoldTransactionsProps {
  showHoldInvoice: boolean;
  setShowHoldInvoice: React.Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  setCart: React.Dispatch<SetStateAction<Product[]>>;
  setEmpPhone: React.Dispatch<SetStateAction<string | null>>;
  setCustomerPhone: React.Dispatch<SetStateAction<string | null>>;
  holdInvoices: HoldInvoice[];
}

const HoldTransactions: React.FC<HoldTransactionsProps> = React.memo(
  ({
    showHoldInvoice,
    setShowHoldInvoice,
    isLoading,
    setCart,
    setEmpPhone,
    setCustomerPhone,
    holdInvoices,
  }) => {
    const [holdReset, setHoldReset] = useState(false);

    const dispatch = useAppDispatch();

    return (
      <Modal
        open={showHoldInvoice}
        onCancel={() => setShowHoldInvoice(false)}
        footer={false}
        width={"90vw"}
      >
        <div>
          <Table
            loading={isLoading}
            className={"text-center"}
            dataSource={holdInvoices}
            rowKey={(obj: HoldInvoice, idx) => obj.id + obj.invoiceNo}
            pagination={{ defaultPageSize: 30 }}
            rowClassName={
              "dark:bg-slate-700 dark:text-white dark:hover:text-primaryColor-900"
            }
          >
            <Table.Column
              title={"#"}
              render={(text, record, index) => index + 1}
            />
            <Table.Column title={"Invoice No"} dataIndex={"invoiceNo"} />
            <Table.Column
              title={"Invoice Status"}
              dataIndex={"invoiceStatus"}
              render={(text) => "Hold"}
            />
            <Table.Column title={"Customer"} dataIndex={"customerPhone"} />
            <Table.Column
              title="Product Count"
              render={(_, rec: HoldInvoice) => rec.items.length}
            />

            <Table.Column
              title={"Actions"}
              dataIndex={"invoiceNo"}
              render={(text, record: HoldInvoice, index) => {
                return (
                  <div className={"flex gap-x-3"}>
                    <ConfirmationModal
                      open={holdReset}
                      setOpen={setHoldReset}
                      execute={async () => {}}
                    />
                    <button
                      onClick={async () => {
                        setCart((prev) => [...prev, ...record.items]);
                        setEmpPhone(record.crmPhone);
                        setCustomerPhone(record.customerPhone);
                        dispatch(removeHold(record.id)).then(async () => {
                          await dispatch(fetchHold());
                        });
                        setShowHoldInvoice(false);
                      }}
                      className={"report__btn bg-green-500 text-white"}
                    >
                      <AiOutlineEdit />
                    </button>
                    <button
                      className={"report__btn bg-red-500 text-white"}
                      onClick={async () => {
                        await dispatch(removeHold(record.id));
                        await dispatch(fetchHold());
                      }}
                    >
                      <BiReset />
                    </button>
                  </div>
                );
              }}
            />
            <Table.Column
              title={"Created"}
              render={(text, record: HoldInvoice) => {
                return moment(record.createdAt).format("DD-MMM-YYYY");
              }}
            />
          </Table>
        </div>
      </Modal>
    );
  }
);
export default HoldTransactions;
