import React, { useEffect, useState } from "react";
import { Button } from "antd";
import api from "../../../api";
import printJS from "print-js";
import { Loader, ReportLayout } from "../../components";
import JsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AxiosError } from "axios";
import { ApiError } from "../../../redux/types";
import { rejectedToast } from "../../utils/toaster";
import { useSettingContext } from "../../context/SettingProver";
import { useTypedSelector } from "../../../redux/store";
import { UserRole } from "../../../types";
import { find } from "underscore";
import { formatPrice } from "../../utils";

interface CustomerQTYProps {}

interface Customerqty {
  date: string;
  quantity: number;
  year: number;
  customerPhone: string;
  customerName: string;
  createdAt: string;
  showroom: string;
  crm: string;
}

interface CustomerAmount {
  date: string;
  amount: number;
  year: number;
  customerPhone: string;
  customerName: string;
  createdAt: string;
  showroom: string;
  crm: string;
}

const CustomerQTY: React.FC<CustomerQTYProps> = () => {
  const year = [2022, 2023, 2024, 2025];
  const [customerQty, setCustomerQty] = useState<Customerqty[]>([]);
  const [customerAmount, setCustomerAmount] = useState<CustomerAmount[]>([]);
  const [showCustomerQty, setShowCustomerQty] = useState(true);
  const [showCustomerAmount, setShowCustomerAmount] = useState(false);
  const [srCode, setSrCode] = useState("");
  const [loading, setLoading] = useState(false);

  const { currentUser } = useSettingContext();
  const { showroom, isLoading } = useTypedSelector((sr) => sr.showroom);
  //Setting Showroom Code For Current User
  useEffect(() => {
    if (currentUser?.role === UserRole[0]) {
      if (setSrCode) {
        setSrCode(showroom[0]?.showroomCode);
      }
    } else {
      const srCode = find(showroom, {
        showroomCode: currentUser?.assignedShowroom,
      });
      if (srCode) {
        if (setSrCode) {
          setSrCode(srCode.showroomCode);
        }
      }
    }
  }, [currentUser?.assignedShowroom, currentUser?.role, showroom]);

  if (isLoading) {
    return <Loader />;
  }
  const CustomerQTYRender = () => {
    return (
      <ReportLayout
        handleGenerate={() => {
          setLoading(true);
          api
            .get("/reports/sales/customer/qty", {
              params: {
                showroomCode: srCode,
              },
            })
            .then((res) => {
              setLoading(false);
              setCustomerQty(res.data);
            })
            .catch((err: AxiosError<ApiError>) => {
              setLoading(false);
              rejectedToast(err);
            });
        }}
        handlePdf={() => {
          const doc = new JsPDF();
          doc.text(
            `Customer Database QTY Report Of ${customerQty[0].showroom}`,
            110,
            10,
            { align: "center" }
          );
          autoTable(doc, {
            html: "#pdfQty",
            startY: 20,
          });
          doc.save("customer_qty.pdf");
        }}
        handlePrint={() => {
          printJS({
            printable: "printQty",
            type: "html",
            targetStyles: ["*"],
          });
        }}
        srCode={srCode}
        setSrCode={setSrCode}
        excelTableId={"pdfQty"}
        excelTitle={"Customer Database QTY Report of " + srCode}
      >
        <div id={"printQty"}>
          <h1 className={"text-center my-2 text-xl font-semibold"}>
            Customer Database Qty Report
          </h1>
          <table className={"customer__table"} id={"pdfQty"}>
            <thead>
              <tr>
                <th className="text-left">SL</th>
                <th className="text-left">DATE</th>
                <th className="text-left">MOBILE NUMBER</th>
                <th className="text-left">NICK NAME</th>
                <th className="text-left">CRM</th>
                {year.map((y) => (
                  <th className="text-right" key={y}>
                    {y}
                  </th>
                ))}
                <th className="text-right">GAP</th>
              </tr>
            </thead>
            <tbody>
              {customerQty.map((c, i) => {
                return (
                  <tr key={i}>
                    <td className="text-left">{i + 1}</td>
                    <td className="text-left">{c.createdAt}</td>
                    <td className="text-left">{c.customerPhone}</td>
                    <td className="text-left">{c.customerName}</td>
                    <td className="text-left">{c.crm}</td>
                    {year.map((y) => {
                      return c.year === y ? (
                        <td className="text-right">{c.quantity}</td>
                      ) : (
                        <td className="text-right">-</td>
                      );
                    })}
                    <td className="text-right">0</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className={"print__footer"}>
            <h2>NOTE:</h2>
            <h2>1. YOY CUSTOMER PURCHES QUANTITY.</h2>
            <h2>2. EVERY UNIQUE NUMBER CUSTOMER NAME & CRM MUST BE SAME.</h2>
            <h2>3. QTY CALCULATION EXCLUDING RETURN QTY.</h2>
          </div>
        </div>
      </ReportLayout>
    );
  };

  const CustomerAmount = () => {
    return (
      <ReportLayout
        handleGenerate={() => {
          setLoading(true);
          api
            .get("/reports/sales/customer/amount", {
              params: {
                showroomCode: srCode,
              },
            })
            .then((res) => {
              setCustomerAmount(res.data);
              setLoading(false);
            })
            .catch((err: AxiosError<ApiError>) => {
              setLoading(false);
              rejectedToast(err);
            });
        }}
        handlePdf={() => {
          const doc = new JsPDF();
          doc.text(
            `Customer Database QTY Report Of ${customerAmount[0].showroom}`,
            110,
            10,
            { align: "center" }
          );
          autoTable(doc, {
            html: "#pdfAmount",
            startY: 20,
          });
          doc.save("customer_amount.pdf");
        }}
        handlePrint={() => {
          printJS({
            printable: "printAmount",
            type: "html",
            targetStyles: ["*"],
          });
        }}
        srCode={srCode}
        setSrCode={setSrCode}
        excelTableId={"pdfAmount"}
        excelTitle={"Customer Database Amount Report of " + srCode}
      >
        <div id={"printAmount"}>
          <h1 className={"text-center font-semibold text-xl my-2"}>
            Customer Database Amount Report
          </h1>
          <table className={"customer__table"} id={"pdfAmount"}>
            <thead>
              <tr>
                <th className="text-left">SL</th>
                <th className="text-left">DATE</th>
                <th className="text-left">MOBILE NUMBER</th>
                <th className="text-left">NICK NAME</th>
                <th className="text-left">CRM</th>
                {year.map((y) => (
                  <th className="text-right" key={y}>
                    {y}
                  </th>
                ))}
                <th className="text-right">GAP</th>
              </tr>
            </thead>
            <tbody>
              {customerAmount.map((c, i) => {
                return (
                  <tr key={i}>
                    <td className="text-left">{i + 1}</td>
                    <td className="text-left"> {c.createdAt}</td>
                    <td className="text-left">{c.customerPhone}</td>
                    <td className="text-left">{c.customerName}</td>
                    <td className="text-left">{c.crm}</td>
                    {year.map((y) => {
                      return c.year === y ? (
                        <td className="text-right">{formatPrice(c.amount)}</td>
                      ) : (
                        <td className="text-right"> -</td>
                      );
                    })}
                    <td className="text-right">0</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className={"print__footer"}>
            <h2>NOTE:</h2>
            <h2>1. YOY CUSTOMER PURCHASE AMOUNT.</h2>
            <h2>2. EVERY UNIQUE NUMBER CUSTOMER NAME & CRM MUST BE SAME.</h2>
            <h2>3. QTY CALCULATION EXCLUDING RETURN AMOUNT.</h2>
          </div>
        </div>
      </ReportLayout>
    );
  };

  return (
    <div>
      <div className={"flex bg-white py-4 gap-x-5 py-2 px-5 rounded mb-4"}>
        <Button
          className={showCustomerQty ? "btn__active" : ""}
          onClick={() => {
            setShowCustomerQty(true);
            setShowCustomerAmount(false);
          }}
        >
          Customer QTY
        </Button>
        <Button
          className={showCustomerAmount ? "btn__active" : ""}
          onClick={() => {
            setShowCustomerAmount(true);
            setShowCustomerQty(false);
          }}
        >
          Customer Amount
        </Button>
      </div>
      {loading && <Loader />}
      {showCustomerQty ? <CustomerQTYRender /> : null}
      {showCustomerAmount ? <CustomerAmount /> : null}
    </div>
  );
};

export default CustomerQTY;
