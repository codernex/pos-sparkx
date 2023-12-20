import React from "react";

interface exampleProps {}

const example: React.FC<exampleProps> = () => {
  return (
    <div>
      {/*<div className={"flex justify-between w-full"}>*/}
      {/*    <h1 className={"text-[12px] font-semibold"}>*/}
      {/*        DATE:{" "}*/}
      {/*        {invoiceData?.createdAt &&*/}
      {/*            moment(invoiceData.createdAt).format("DD-MM-YYYY")}*/}
      {/*    </h1>*/}
      {/*    <h1 className={"text-[12px] font-semibold"}>*/}
      {/*        Invoice: {invoiceData?.showroomInvoiceCode}*/}
      {/*    </h1>*/}
      {/*</div>*/}
      {/*<div className={"flex justify-between w-full]"}>*/}
      {/*    <h1 className={"text-[12px] font-semibold"}>*/}
      {/*        Customer: {invoiceData?.customerName}*/}
      {/*    </h1>*/}
      {/*    <h1 className={"text-[12px] font-semibold"}>*/}
      {/*        MOBILE:{invoiceData?.customerMobile}*/}
      {/*    </h1>*/}
      {/*</div>*/}

      {/*<div className={"text-[12px]"}>*/}
      {/*    <div className={"flex justify-between"}>*/}
      {/*        <h1>Invoice No :</h1>*/}
      {/*        <h1>{invoiceData?.showroomInvoiceCode}</h1>*/}
      {/*    </div>*/}
      {/*    <div className={"flex justify-between"}>*/}
      {/*        <h1>Date :</h1>*/}
      {/*        <h1>*/}
      {/*            {invoiceData?.createdAt &&*/}
      {/*                new Date(invoiceData.createdAt).toDateString()}*/}
      {/*        </h1>*/}
      {/*    </div>*/}
      {/*    <div className={"flex justify-between"}>*/}
      {/*        <h1>Customer :</h1>*/}
      {/*        <h1>{invoiceData?.customerName}</h1>*/}
      {/*    </div>*/}
      {/*    <div className={"flex justify-between"}>*/}
      {/*        <h1>Mobile :</h1>*/}
      {/*        <h1>{invoiceData?.customerMobile}</h1>*/}
      {/*    </div>*/}
      {/*</div>*/}

      {/*<footer className={'w-full '}>*/}
      {/*    <div*/}
      {/*        className={'flex flex-col items-end pb-2 mt-2 border-b border-dashed border-slate-400'}>*/}
      {/*        <h1 className={'text-[12px] font-semibold'}>Subtotal*/}
      {/*            /!*- Math.round((invoiceData ? invoiceData?.invoiceAmount / 100 * invoiceData.vat : 0))*!/*/}
      {/*            /!*+ invoiceData?.discountAmount*!/*/}
      {/*            : {invoiceData && invoiceData?.invoiceAmount - Math.round((invoiceData ? invoiceData?.invoiceAmount / 100 * invoiceData.vat : 0))}৳</h1>*/}
      {/*        /!*<h1 className={'text-[12px] font-semibold'}>Discount (-)*!/*/}
      {/*        /!*    : {invoiceData?.discountAmount || 0}৳</h1>*!/*/}
      {/*        <h1 className={'text-[12px] font-semibold'}>Tax({invoiceData?.vat}%)*/}
      {/*            :{Math.round(invoiceData ? invoiceData?.invoiceAmount / 100 * invoiceData.vat : 0)} ৳</h1>*/}

      {/*    </div>*/}
      {/*    <div className={'flex mb-2 mt-2 justify-between font-semibold'}>*/}
      {/*        <h1>Qty: {invoiceData?.products.length}</h1>*/}
      {/*        <h1>T. Payable: {invoiceData?.invoiceAmount}৳</h1>*/}
    </div>
  );
};

export default example;
