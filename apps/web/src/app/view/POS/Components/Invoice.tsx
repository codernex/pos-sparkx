import { Modal } from "antd";
import React, { SetStateAction, useRef } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { useReactToPrint } from "react-to-print";
import { InvoiceBody } from "./InvoiceBody";

interface InvoiceProps {
  showInvoice: boolean;
  setShowInvoice: React.Dispatch<SetStateAction<boolean>>;
  invoiceData: Invoice | null;
}

const Invoice: React.FC<InvoiceProps> = React.memo(
  ({ setShowInvoice, showInvoice, invoiceData }) => {
    const invoiceRef = useRef<HTMLDivElement | null>(null);
    const handlePrint = useReactToPrint({
      content: () => invoiceRef.current,
    });

    let productsLength =
      invoiceData && invoiceData.products ? invoiceData.products.length : 0;
    let returnProductsLength =
      invoiceData && invoiceData?.returned?.returnProducts
        ? invoiceData.returned.returnProducts.length
        : 0;

    let difference = productsLength - returnProductsLength;
    return (
      <Modal
        open={showInvoice}
        closable={true}
        destroyOnClose={true}
        footer={false}
        closeIcon={<AiFillCloseCircle />}
        onCancel={() => setShowInvoice(false)}
      >
        <div className={"w-full overflow-x-hidden"} ref={invoiceRef}>
          {Array.from({ length: 2 }).map((it, id) => {
            return (
              invoiceData && (
                <InvoiceBody
                  key={id}
                  invoiceData={invoiceData}
                  difference={difference}
                />
              )
            );
          })}
        </div>

        <button
          className={"bg-green-500 text-white px-3 py-1 rounded"}
          onClick={() => {
            handlePrint();
            setShowInvoice(false);
          }}
        >
          Print
        </button>
      </Modal>
    );
  }
);
export default Invoice;
