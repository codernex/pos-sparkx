import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { Loader, ReportLayout } from "../../components";
import api from "../../../api";
import printJS from "print-js";
import JsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { rejectedToast } from "../../utils/toaster";
import { useSettingContext } from "../../context/SettingProver";
import { UserRole } from "../../../types";
import { useTypedSelector } from "../../../redux/store";
import { find } from "underscore";

interface SizeData {
  showroomName: string;
  showroomProducts: {
    productGroup: string;
    quantity: number;
    size: string;
  }[];
}

const InventoryReport: React.FC = () => {
  const [showSoldUnsold, setShowSoldUnsold] = useState(true);
  const [showSize, setShowSize] = useState(false);
  const [supplier, setSupplier] = useState("");
  const [soldUnsoldData, setSoldUnsoldData] = useState<
    {
      key: string;
      total: number;
      showroomName: string;
      productGroup: string;
      sold: number;
      unsold: number;
      rating: number;
    }[]
  >([]);
  const [productGroup, setProductGroup] = useState("");
  const [loading, setLoading] = useState(false);
  const [sellingStatus, setSellingStatus] = useState("");
  const [sizeData, setSizeData] = useState<SizeData[]>([]);
  const sizes = [
    "Pend",
    "N/A",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
  ];

  //Size Wise Total Qunantity
  const sizeWiseTotal = (sizeData: SizeData[], size: string) => {
    const productData: {
      productGroup: string;
      quantity: number;
      size: string;
    }[] = [];
    sizeData.forEach((item) => {
      productData.push(
        ...item.showroomProducts.filter((item) => item.size === size)
      );
    });

    return productData.reduce((a, b) => a + Number(b.quantity), 0);
  };

  //Total Quantity
  const totalQty = (sizeData: SizeData[]) => {
    const productData: {
      productGroup: string;
      quantity: number;
      size: string;
    }[] = [];
    sizeData.forEach((item) => productData.push(...item.showroomProducts));

    return productData.reduce((a, b) => a + Number(b.quantity), 0);
  };
  const SoldUnsold = () => {
    return (
      <ReportLayout
        handlePdf={() => {
          const doc = new JsPDF();
          doc.text(
            `SOLD UNSOLD REPORT ${supplier ? supplier : "All Supplier"} _ ${
              soldUnsoldData[0]?.productGroup
            }`,
            110,
            10,
            { align: "center" }
          );
          autoTable(doc, {
            html: "#pdfSoldUnsold",
            startY: 10,
          });
          doc.save("sold_unsold.pdf");
        }}
        handlePrint={() => {
          printJS({
            printable: "printSoldUnsold",
            type: "html",
            targetStyles: ["*"],
          });
        }}
        handleGenerate={() => {
          setLoading(true);
          api
            .get("/reports/inventory/selling-status", {
              params: { supplierName: supplier, productGroup },
            })
            .then((res) => {
              setSoldUnsoldData(res.data);
              setLoading(false);
            })
            .catch((err) => {
              rejectedToast(err);
              setLoading(false);
            });
        }}
        supplierName={supplier}
        setSupplierName={setSupplier}
        productGroup={productGroup}
        setProductGroup={setProductGroup}
        excelTableId={"pdfSoldUnsold"}
        excelTitle={"Sold Unsold Report"}
      >
        <div id={"printSoldUnsold"}>
          <h1 className={"mt-10 text-center text-xl font-semibold"}>
            Sold Unsold Report
          </h1>
          <table className={"common__table mt-4"} id={"pdfSoldUnsold"}>
            <thead>
              <tr>
                <th>{supplier ? supplier : "All Supplier"}</th>
                <th>{productGroup ? productGroup : "Product Group"}</th>
              </tr>
              <tr>
                <th>Showroom Name</th>
                <th></th>
                <th>Total</th>
                <th>Sold</th>
                <th>Unsold</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {soldUnsoldData.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.showroomName}</td>
                    <td></td>
                    <td>{item.total ? item.total : "-"}</td>
                    <td>{item.sold ? item.sold : "-"}</td>
                    <td>{item.unsold ? item.unsold : "-"}</td>
                    <td>{Math.fround(item.rating)}%</td>
                  </tr>
                );
              })}
              <tr>
                <td></td>
                <td></td>
                <td>
                  {soldUnsoldData.reduce((a, item) => a + item.total, 0)
                    ? soldUnsoldData.reduce((a, item) => a + item.total, 0)
                    : "-"}
                </td>
                <td>
                  {soldUnsoldData.reduce((a, item) => a + item.sold, 0)
                    ? soldUnsoldData.reduce((a, item) => a + item.sold, 0)
                    : "-"}
                </td>
                <td>
                  {soldUnsoldData.reduce((a, item) => a + item.unsold, 0)
                    ? soldUnsoldData.reduce((a, item) => a + item.unsold, 0)
                    : "-"}
                </td>
                <td>
                  {(soldUnsoldData.reduce((a, item) => a + item.sold, 0) /
                    soldUnsoldData.reduce((a, item) => a + item.total, 0)) *
                  100
                    ? Math.floor(
                        (soldUnsoldData.reduce((a, item) => a + item.sold, 0) /
                          soldUnsoldData.reduce(
                            (a, item) => a + item.total,
                            0
                          )) *
                          100
                      )
                    : "-"}
                  %
                </td>
              </tr>
            </tbody>
          </table>
          <div className={"print__footer"}>
            <h2>Note:</h2>
            <h2>1. single product single supplier sold & unsold report</h2>
            <h2>2. all product single supplier sold & unsold report</h2>
          </div>
        </div>
      </ReportLayout>
    );
  };

  const Size = () => {
    return (
      <ReportLayout
        handlePdf={async () => {
          const doc = new JsPDF("landscape");
          doc.text(
            `SOLD UNSOLD REPORT ${supplier ? supplier : "All Supplier"} _ ${
              sizeData[0]?.showroomProducts[0].productGroup
            }`,
            110,
            10,
            { align: "center" }
          );
          autoTable(doc, {
            startY: 20,
            html: "#pdfSize",
            includeHiddenHtml: true,
          });
          await doc.save("size_report.pdf", { returnPromise: true });
        }}
        handlePrint={() => {
          printJS({
            printable: "printSize",
            type: "html",
            targetStyles: ["*"],
          });
        }}
        handleGenerate={() => {
          setLoading(true);
          api
            .get("/reports/inventory/size", {
              params: {
                supplierName: supplier,
                productGroup,
                sellingStatus,
              },
            })
            .then((res) => {
              setLoading(false);
              setSizeData(res.data);
            })
            .catch((err) => {
              rejectedToast(err);
              setLoading(false);
            });
        }}
        supplierName={supplier}
        setSupplierName={setSupplier}
        productGroup={productGroup}
        setProductGroup={setProductGroup}
        sellingStatus={sellingStatus}
        setSellingStatus={setSellingStatus}
        excelTableId={"pdfSize"}
        excelTitle={"Sold Unsold Report"}
      >
        <div id={"printSize"}>
          <h1 className={"text-center text-xl font-semibold my-4"}>
            Inventory Size Wise Data
          </h1>
          <table className="common__table" id={"pdfSize"}>
            <thead>
              <tr>
                <th>Supplier Name</th>
                <th>{supplier ? supplier : "All Supplier"}</th>
              </tr>
              <tr>
                <th>Product Name</th>
                <th>{productGroup}</th>
              </tr>
              <tr>
                <th>Size</th>
                <th></th>
                <th>Total</th>
                {sizes.map((size) => (
                  <th key={size}>{size}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sizeData.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.showroomName}</td>
                    <td></td>
                    <td>
                      {item.showroomProducts.reduce(
                        (a, b) => a + Number(b.quantity),
                        0
                      )}
                    </td>
                    {sizes.map((size) => {
                      const product = item.showroomProducts.find(
                        (p) => p.size === size
                      );
                      if (product) {
                        return <td key={size}>{product.quantity}</td>;
                      } else {
                        return <td key={size}>-</td>;
                      }
                    })}
                  </tr>
                );
              })}
              <tr>
                <td></td>
                <td></td>
                <td>{totalQty(sizeData)}</td>
                {sizes.map((size) => {
                  const itemSizes = sizeWiseTotal(sizeData, size);
                  return <td key={size}>{itemSizes ? itemSizes : "-"}</td>;
                })}
              </tr>
            </tbody>
          </table>
          <div className={"print__footer"}>
            <h2>Note:</h2>
            <h2>
              1. showroom, supplier & product basis size wisesales, stock &
              purchase report
            </h2>
          </div>
        </div>
      </ReportLayout>
    );
  };
  return (
    <div>
      <div className={"flex bg-white py-4 gap-x-5 py-2 px-5 rounded mb-4"}>
        <Button
          className={showSoldUnsold ? "btn__active" : ""}
          onClick={() => {
            setShowSize(false);
            setShowSoldUnsold(true);
          }}
        >
          Sold Unsold
        </Button>
        <Button
          className={showSize ? "btn__active" : ""}
          onClick={() => {
            setShowSoldUnsold(false);
            setShowSize(true);
          }}
        >
          Inventory Size
        </Button>
      </div>

      <div className={"duration-300 transition-all"}>
        {loading ? <Loader /> : null}
        {showSoldUnsold ? <SoldUnsold /> : null}
        {showSize ? <Size /> : null}
      </div>
    </div>
  );
};

export default InventoryReport;
