import React, { useEffect, useState } from "react";
import ReportLayout from "../../components/ReportLayout";
import api from "../../../api";
import { rejectedToast } from "../../utils/toaster";
import { formatPrice, handleExcel } from "../../utils";
import printJS from "print-js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useTypedSelector } from "../../../redux/store";
import { useSettingContext } from "../../context/SettingProver";
import { UserRole } from "../../../types";
import { find } from "underscore";

interface ReturnReportProps {}

interface ReturnReportData {
  day: string;
  date: string;
  id: number;
  tagPrice: number[];
  finalPrice: number[];
  invoiceNo: string;
  seller: { empName: string; empPhone: string }[];
  check: string;
  customer: string;
  products: { itemCode: string; productName: string }[];
}

const ReturnReport: React.FC<ReturnReportProps> = ({}) => {
  const [reportData, setReportData] = useState<ReturnReportData[]>([]);
  const { showroom, isLoading } = useTypedSelector((state) => state.showroom);
  const [srCode, setSrCode] = useState("");

  const { currentUser } = useSettingContext();
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
  return (
    <ReportLayout
      handleGenerate={() => {
        api
          .get("/reports/return", {
            params: {
              showroomCode: srCode,
            },
          })
          .then((res) => setReportData(res.data))
          .catch((err) => rejectedToast(err));
      }}
      srCode={srCode}
      setSrCode={setSrCode}
      excelTitle="Return Report"
      handleExcel={() =>
        reportData.length &&
        handleExcel(
          reportData.map((item) => ({
            ...item,
            products: item.products
              .map((p) => p.itemCode + " " + p.productName)
              .join(", \n"),
            seller: item.seller
              .map((e) => e.empPhone + " " + e.empName)
              .join(", \n"),
            finalPrice: item.finalPrice.map((pr) => pr).join(", \n"),
            tagPrice: item.tagPrice.map((pr) => pr).join(", \n"),
          })),
          "Return Report",
          "return_report"
        )
      }
      handlePdf={() => {
        const doc = new jsPDF("landscape");
        doc.text(
          `Return Report
          `,
          150,
          10,
          { align: "center" }
        );
        autoTable(doc, {
          html: "#returnReport",
          startY: 20,
        });
        doc.save("return.pdf");
      }}
      handlePrint={() => {
        printJS({
          printable: "returnReport",
          type: "html",
          targetStyles: ["*"],
        });
      }}
    >
      <h1 className="text-xl font-semibold">Return Reports</h1>
      <table id="returnReport" className="return__table">
        <thead>
          <tr>
            <th className="text-left">SL</th>
            <th className="text-left">DAY</th>
            <th className="text-left">DATE</th>
            <th className="text-left">CODE</th>
            <th className="text-right">TAG PRICE</th>
            <th className="text-right">FINAL PRICE</th>
            <th className="text-left">INVOICE</th>
            <th className="text-left">PRODUCT NAME</th>
            <th className="text-left">SELLER</th>
            <th className="text-left">%CHECK</th>
          </tr>
        </thead>
        <tbody>
          {reportData?.map((r, i) => {
            if (r !== null)
              return (
                <tr key={i}>
                  <td className="text-left">{i + 1}</td>
                  <td className="text-left">{r?.day}</td>
                  <td className="text-left">{r?.date}</td>
                  <td className="text-left">
                    {r?.products?.map((p, i) => (
                      <tr key={i}>
                        <td>{p.itemCode}</td>
                      </tr>
                    ))}
                  </td>
                  <td>
                    {r?.tagPrice?.map((p, i) => (
                      <tr className="flex flex-col items-end w-[100%]" key={i}>
                        <td>{formatPrice(p)}</td>
                      </tr>
                    ))}
                  </td>
                  <td>
                    {r?.finalPrice?.map((p, i) => (
                      <tr className="flex flex-col items-end w-[100%]" key={i}>
                        <td>{formatPrice(p)}</td>
                      </tr>
                    ))}
                  </td>
                  <td className="text-left">{r?.invoiceNo}</td>
                  <td className="text-left">
                    {r?.products?.map((p, i) => (
                      <tr key={i}>
                        <td>{p.productName}</td>
                      </tr>
                    ))}
                  </td>
                  <td className="text-left">
                    {r?.seller?.map((p, i) => {
                      return (
                        <tr key={i}>
                          <td>{p?.empName}</td>
                        </tr>
                      );
                    })}
                  </td>
                  <td className="text-left">{r?.check}</td>
                </tr>
              );
            else return "";
          })}
        </tbody>
      </table>
    </ReportLayout>
  );
};
export default ReturnReport;
