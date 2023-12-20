import { Modal } from "antd";
import React, { SetStateAction, useRef } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { useReactToPrint } from "react-to-print";
import InvoiceBody from "./InvoiceBody";

interface SingleInvoiceProps {
  showInvoice: boolean;
  setShowInvoice: React.Dispatch<SetStateAction<boolean>>;
  invoiceData: Invoice | null;
}

const SingleInvoice: React.FC<SingleInvoiceProps> = React.memo(
  ({ showInvoice, setShowInvoice, invoiceData }) => {
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
        width={350}
      >
        {invoiceData ? (
          <>
            <div className={"w-full overflow-x-hidden"} ref={invoiceRef}>
              {/*Invoice Start*/}

              <InvoiceBody invoiceData={invoiceData} difference={difference} />
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
          </>
        ) : null}
      </Modal>
    );
  }
);
export default SingleInvoice;
