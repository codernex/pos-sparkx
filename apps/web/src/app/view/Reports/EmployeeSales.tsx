import React, { useEffect, useState } from "react";
import { Button } from "antd";
import api from "../../../api";
import moment from "moment";
import printJS from "print-js";
import { useTypedSelector } from "../../../redux/store";
import ReportLayout from "../../components/ReportLayout";
import JsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useSettingContext } from "../../context/SettingProver";
import { UserRole } from "../../../types";
import { find } from "underscore";
import { Loader } from "../../components";
import { AxiosError } from "axios";
import { ApiError } from "../../../redux/types";
import { rejectedToast } from "../../utils/toaster";
import { formatPrice } from "../../utils";

interface EmployeeSalesProps {}

interface QtyData {
  empName: string;
  monthlySales: { month: string; quantity: number; date: string }[];
}

interface AmountData {
  empName: string;
  monthlySales: { month: string; amount: number; date: string }[];
}

interface EmpQtyData {
  currentYearData: QtyData[];
  prevYearData: QtyData[];
}

interface EmpAmountData {
  currentYearData: AmountData[];
  prevYearData: AmountData[];
}

const EmployeeSales: React.FC<EmployeeSalesProps> = () => {
  const [empData, setEmpData] = useState<EmpQtyData>();
  const [year, setYear] = useState(new Date().getFullYear());
  const [showMOMqty, setShowMOMqty] = useState(true);
  const [showMOMAmount, setShowMOMAmount] = useState(false);
  const months = Array.apply(0, Array(12)).map(function (_, i) {
    return moment().month(i).year(year).format("MMM-YYYY");
  });

  const prevYearMonth = Array.apply(0, Array(12)).map(function (_, i) {
    return moment()
      .month(i)
      .year(year - 1)
      .format("MMM-YYYY");
  });
  const { showroom, isLoading } = useTypedSelector((state) => state.showroom);
  const [srCode, setSrCode] = useState("");
  const [empAmountData, setEmpAmountData] = useState<EmpAmountData>();
  const [loading, setLoading] = useState(false);

  const { currentUser } = useSettingContext();
  //Setting Showroom Code For Current User
  useEffect(() => {
    if (currentUser?.role === UserRole[0]) {
      if (setSrCode) {
        setSrCode(showroom[0]?.showroomCode);
      }
    } else {
      const srCode = find(showroom, {
        showroomName: currentUser?.assignedShowroom,
      });
      if (srCode) {
        if (setSrCode) {
          setSrCode(srCode.showroomCode);
        }
      }
    }
  }, [currentUser?.assignedShowroom, currentUser?.role, showroom]);
  const totalQty = function (month: string, qtyData: QtyData[] | undefined) {
    let total = 0;
    if (!qtyData) return 0;
    qtyData.forEach((employee) => {
      const salesForMonth = employee.monthlySales.find(
        (sale) => sale.date === month
      );
      if (salesForMonth) {
        total += salesForMonth.quantity;
      }
    });
    return total;
  };

  const totalAmount = function (
    month: string,
    amountData: AmountData[] | undefined
  ) {
    let total = 0;
    if (!amountData) return 0;
    amountData.forEach((employee) => {
      const salesForMonth = employee.monthlySales.find(
        (sale) => sale.date === month
      );
      if (salesForMonth) {
        total += salesForMonth?.amount;
      }
    });
    return total;
  };
  const qty = function (month: string, emp: string, empData: QtyData[]) {
    let total = 0;
    empData.forEach((employee) => {
      const salesForMonth = employee.monthlySales.find(
        (sale) => sale.date === month
      );
      if (salesForMonth && emp === employee.empName) {
        total = salesForMonth.quantity;
      }
    });
    return total;
  };

  const amount = function (
    month: string,
    emp: string,
    amountData: AmountData[]
  ) {
    let total = 0;
    amountData.forEach((employee) => {
      const salesForMonth = employee.monthlySales.find(
        (sale) => sale.date === month
      );
      if (salesForMonth && emp === employee.empName) {
        total = salesForMonth.amount;
      }
    });
    return total;
  };
  const totalQtyArr = function (
    months: string[],
    emp: string,
    qtyData: QtyData[]
  ) {
    let total: number[] = [];
    months.forEach((month) => {
      qtyData.forEach((employee) => {
        const salesForMonth = employee.monthlySales.find(
          (sale) => sale.date === month
        );
        if (salesForMonth && emp === employee.empName) {
          total.push(salesForMonth.quantity);
        } else total.push(0);
      });
    });
    return total;
  };
  const totalAmountArr = function (
    months: string[],
    emp: string,
    amountData: AmountData[]
  ) {
    let total: number[] = [];
    months.forEach((month) => {
      amountData.forEach((employee) => {
        const salesForMonth = employee.monthlySales.find(
          (sale) => sale.date === month
        );
        if (salesForMonth && emp === employee.empName) {
          total.push(salesForMonth.amount);
        } else total.push(0);
      });
    });
    return total;
  };
  const totalAmountByMonth = function (
    months: string[],
    amountData: AmountData[] | undefined
  ) {
    let total: number[] = [];

    if (!amountData) return total;
    months.forEach((month) => {
      amountData.forEach((employee) => {
        const salesForMonth = employee.monthlySales.find(
          (sale) => sale.date === month
        );
        if (salesForMonth) {
          total.push(salesForMonth.amount);
        } else total.push(0);
      });
    });
    return total;
  };
  const totalQtyByMonth = function (
    months: string[],
    qtyData: QtyData[] | undefined
  ) {
    let total: number[] = [];
    if (!qtyData) return total;
    months.forEach((month) => {
      qtyData.forEach((employee) => {
        const salesForMonth = employee.monthlySales.find(
          (sale) => sale.date === month
        );
        if (salesForMonth) {
          total.push(salesForMonth.quantity);
        } else total.push(0);
      });
    });
    return total;
  };

  const handleMomAmountPDF = () => {
    const doc = new JsPDF("landscape");
    doc.text(
      `MOM Employee Sales Amount \nFor The Year ${year} Of ${
        showroom.find((sr) => sr.showroomCode === srCode)?.showroomName
      }`,
      150,
      10,
      { align: "center" }
    );

    autoTable(doc, {
      startY: 20,
      html: "#pdfAmount",

      styles: {
        cellWidth: "auto",
      },
    });

    doc.save("emp_mom_amount.pdf");
  };

  const handleMOMQty = () => {
    const doc = new JsPDF("landscape");

    doc.text(
      `MOM Employee Sales QTY \nFor The Year ${year} Of ${
        showroom.find((sr) => sr.showroomCode === srCode)?.showroomName
      }`,
      150,
      10,
      { align: "center" }
    );
    autoTable(doc, {
      startY: 20,
      html: "#pdfQty",
      styles: {
        cellWidth: "auto",
      },
    });

    doc.save("emp_mom_qty.pdf");
  };

  if (isLoading) {
    return <Loader />;
  }

  const MOMAmount = () => {
    return (
      <ReportLayout
        handleGenerate={() => {
          setLoading(true);
          api
            .get("/reports/sales/mom/amount", {
              params: {
                showroom: srCode,
                year,
              },
            })
            .then((res) => {
              setEmpAmountData(res.data);
              setLoading(false);
            })
            .catch((err: AxiosError<ApiError>) => {
              rejectedToast(err);
              setLoading(false);
            });
        }}
        handlePdf={handleMomAmountPDF}
        handlePrint={() =>
          printJS({
            printable: "printAble",
            type: "html",
            targetStyles: ["*"],
          })
        }
        setSrCode={setSrCode}
        srCode={srCode}
        year={year}
        setYear={setYear}
        excelTableId={"pdfAmount"}
        excelTitle={
          "Employee MOM Amount OF" +
          showroom.find((sr) => sr.showroomCode === srCode)?.showroomName
        }
      >
        <div className={"text-center font-semibold"} id={"printAble"}>
          <div className={"report__info"}>
            <h1>mom employee sales Amount </h1>
            <h2>
              for the year {year} Of{" "}
              {showroom.find((sr) => sr.showroomCode === srCode)?.showroomName}
            </h2>
          </div>

          {/**
           * Current Year Data
           */}
          <table className={"mom__sales-table"} id={"pdfAmount"}>
            <thead>
              <tr>
                <th className="text-left">SL</th>
                <th className="text-left">Employee</th>
                {months.map((employee) => (
                  <th className="text-right" key={employee}>
                    {employee}
                  </th>
                ))}
                <th className="text-right">Total</th>
                <th className="text-right">%</th>
              </tr>
            </thead>
            <tbody>
              {empAmountData?.currentYearData.map((employee, index, arr) => {
                return (
                  <tr key={employee.empName}>
                    <td className="text-left">{index + 1}</td>
                    <td className="text-left">{employee.empName}</td>
                    {months.map((month, index) => (
                      <td className="text-right" key={month}>
                        {formatPrice(amount(month, employee.empName, arr))}
                      </td>
                    ))}
                    <td className="text-right">
                      {formatPrice(
                        totalAmountArr(months, employee.empName, arr).reduce(
                          (a, b) => a + b,
                          0
                        )
                      )}
                    </td>
                    <td className="text-right">
                      {Math.round(
                        (totalAmountArr(months, employee.empName, arr).reduce(
                          (a, b) => a + b,
                          0
                        ) /
                          totalAmountByMonth(
                            months,
                            empAmountData?.currentYearData
                          ).reduce((a, b) => a + b, 0)) *
                          100
                      )
                        ? Math.round(
                            (totalAmountArr(
                              months,
                              employee.empName,
                              arr
                            ).reduce((a, b) => a + b, 0) /
                              totalAmountByMonth(
                                months,
                                empAmountData?.currentYearData
                              ).reduce((a, b) => a + b, 0)) *
                              100
                          )
                        : 0}
                      %
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td></td>
                <td></td>
                {months.map((month, index) => (
                  <td key={index} className="text-right">
                    {formatPrice(
                      totalAmount(month, empAmountData?.currentYearData)
                    )}
                  </td>
                ))}
                <td className="text-right">
                  {formatPrice(
                    totalAmountByMonth(
                      months,
                      empAmountData?.currentYearData
                    ).reduce((a, b) => a + b, 0)
                  )}
                </td>
                <td className="text-right">
                  {totalAmountByMonth(
                    months,
                    empAmountData?.currentYearData
                  ).reduce((a, b) => a + b, 0)
                    ? (totalAmountByMonth(
                        months,
                        empAmountData?.currentYearData
                      ).reduce((a, b) => a + b, 0) /
                        totalAmountByMonth(
                          months,
                          empAmountData?.currentYearData
                        ).reduce((a, b) => a + b, 0)) *
                      100
                    : 0}
                  %
                </td>
              </tr>
              <tr>
                <td></td>
                <td>Growth</td>
                {months.map((month, index) => (
                  <td className="text-right" key={index}>
                    {Number(
                      ((totalAmount(month, empAmountData?.currentYearData) -
                        totalAmount(
                          prevYearMonth[index],
                          empAmountData?.prevYearData
                        )) /
                        100) *
                        100
                    ).toFixed(0)}
                    %
                  </td>
                ))}
                <td className="text-right">
                  {Number(
                    ((totalAmountByMonth(
                      months,
                      empAmountData?.currentYearData
                    ).reduce((a, b) => a + b, 0) -
                      totalAmountByMonth(
                        prevYearMonth,
                        empAmountData?.prevYearData
                      ).reduce((a, b) => a + b, 0)) /
                      100) *
                      100
                  ).toFixed(0)}
                  %
                </td>
              </tr>
            </tbody>
          </table>

          {/**
           * Prev Year Data
           */}
          <table className={"mom__sales-table mt-20"} id={"pdfAmount"}>
            <thead>
              <tr>
                <th className="text-left">SL</th>
                <th className="text-left">Employee</th>
                {prevYearMonth.map((m) => (
                  <th className="text-right" key={m}>
                    {m}
                  </th>
                ))}
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {empAmountData?.prevYearData.map((employee, index, arr) => {
                return (
                  <tr key={employee.empName}>
                    <td className="text-left">{index + 1}</td>
                    <td className="text-left">{employee.empName}</td>
                    {prevYearMonth.map((month, index) => (
                      <td className="text-right" key={month}>
                        {formatPrice(amount(month, employee.empName, arr))}
                      </td>
                    ))}
                    <td className="text-right">
                      {formatPrice(
                        totalAmountArr(
                          prevYearMonth,
                          employee.empName,
                          arr
                        ).reduce((a, b) => a + b, 0)
                      )}
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td></td>
                <td></td>
                {prevYearMonth.map((month, index) => (
                  <td key={index} className="text-right">
                    {formatPrice(
                      totalAmount(month, empAmountData?.prevYearData)
                    )}
                  </td>
                ))}
                <td className="text-right">
                  {formatPrice(
                    totalAmountByMonth(
                      prevYearMonth,
                      empAmountData?.prevYearData
                    ).reduce((a, b) => a + b, 0)
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="print__footer">
            <h2>NOTE</h2>
            <h2>1. EMPLOYEE MONTHLY SALES AMOUNT.</h2>
          </div>
        </div>
      </ReportLayout>
    );
  };
  const MOMQty = () => {
    return (
      <ReportLayout
        handleGenerate={() => {
          setLoading(true);
          api
            .get("/reports/sales/mom/qty", {
              params: {
                showroom: srCode,
                year,
              },
            })
            .then((res) => {
              setEmpData(res.data);
              setLoading(false);
            })
            .catch((err: AxiosError<ApiError>) => {
              rejectedToast(err);
              setLoading(false);
            });
        }}
        handlePdf={handleMOMQty}
        handlePrint={() =>
          printJS({
            printable: "printAble",
            type: "html",
            targetStyles: ["*"],
          })
        }
        year={year}
        setYear={setYear}
        setSrCode={setSrCode}
        srCode={srCode}
        excelTitle={
          "Employee MOM QTY of " +
          showroom.find((sr) => sr.showroomCode === srCode)?.showroomName
        }
        excelTableId={"pdfQty"}
      >
        <div className={"text-center font-semibold"} id={"printAble"}>
          <div className={"report__info"}>
            <h1>mom employee sales quantity </h1>
            <h2>
              for the year {year} Of{" "}
              {showroom.find((sr) => sr.showroomCode === srCode)?.showroomName}
            </h2>
          </div>
          {/**
           *
           * Current Year Data
           */}
          <table className={"mom__sales-table"} id={"pdfQty"}>
            <thead>
              <tr>
                <th className="text-left">SL</th>
                <th className="text-left">Employee</th>
                {months.map((employee) => (
                  <th className="text-right" key={employee}>
                    {employee}
                  </th>
                ))}
                <th className="text-right">Total</th>
                <th className="text-right"> %</th>
              </tr>
            </thead>
            <tbody>
              {empData?.currentYearData.map((employee, index, arr) => {
                return (
                  <tr key={employee.empName}>
                    <td className="text-left">{index + 1}</td>
                    <td className="text-left"> {employee.empName}</td>
                    {months.map((month, index) => (
                      <td className="text-right" key={month}>
                        {qty(month, employee.empName, arr)}
                      </td>
                    ))}
                    <td className="text-right">
                      {totalQtyArr(months, employee.empName, arr).reduce(
                        (a, b) => a + b,
                        0
                      )}
                    </td>
                    <td className="text-right">
                      {totalQtyArr(months, employee.empName, arr).reduce(
                        (a, b) => a + b,
                        0
                      )
                        ? Math.round(
                            (totalQtyArr(months, employee.empName, arr).reduce(
                              (a, b) => a + b,
                              0
                            ) /
                              totalQtyByMonth(
                                months,
                                empData?.currentYearData
                              ).reduce((a, b) => a + b, 0)) *
                              100
                          )
                        : 0}
                      %
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td></td>
                <td></td>
                {months.map((month, index) => (
                  <td key={index} className="text-right">
                    {totalQty(month, empData?.currentYearData)}
                  </td>
                ))}
                <td className="text-right">
                  {totalQtyByMonth(months, empData?.currentYearData).reduce(
                    (a, b) => a + b,
                    0
                  )}
                </td>
                <td>
                  {totalQtyByMonth(months, empData?.currentYearData).reduce(
                    (a, b) => a + b,
                    0
                  )
                    ? (totalQtyByMonth(months, empData?.currentYearData).reduce(
                        (a, b) => a + b,
                        0
                      ) /
                        totalQtyByMonth(
                          months,
                          empData?.currentYearData
                        ).reduce((a, b) => a + b, 0)) *
                      100
                    : 0}
                  %
                </td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                {months.map((month, index) => {
                  return (
                    <td key={index} className="text-right">
                      {Number(
                        ((totalQty(month, empData?.currentYearData) -
                          totalQty(
                            prevYearMonth[index],
                            empData?.prevYearData
                          )) /
                          100) *
                          100
                      ).toFixed(0)}
                      %
                    </td>
                  );
                })}
                <td className="text-right">
                  {Number(
                    ((totalQtyByMonth(months, empData?.currentYearData).reduce(
                      (a, b) => a + b,
                      0
                    ) -
                      totalQtyByMonth(
                        prevYearMonth,
                        empData?.prevYearData
                      ).reduce((a, b) => a + b, 0)) /
                      100) *
                      100
                  ).toFixed(0)}
                  %
                </td>
              </tr>
            </tbody>
          </table>

          {/**
           *
           * Previous Year data
           *
           */}

          <table className={"mom__sales-table mt-10"} id={"pdfQty"}>
            <thead>
              <tr>
                <th className="text-left">SL</th>
                <th className="text-left">Employee</th>
                {prevYearMonth.map((employee) => (
                  <th className="text-right" key={employee}>
                    {employee}
                  </th>
                ))}
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {empData?.prevYearData.map((employee, index, arr) => {
                return (
                  <tr key={employee.empName}>
                    <td className="text-left">{index + 1}</td>
                    <td className="text-left"> {employee.empName}</td>
                    {prevYearMonth.map((month, index) => (
                      <td className="text-right" key={month}>
                        {qty(month, employee.empName, arr)}
                      </td>
                    ))}
                    <td className="text-right">
                      {totalQtyArr(prevYearMonth, employee.empName, arr).reduce(
                        (a, b) => a + b,
                        0
                      )}
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td></td>
                <td></td>
                {prevYearMonth.map((month, index) => (
                  <td key={index} className="text-right">
                    {totalQty(month, empData?.prevYearData)}
                  </td>
                ))}
                <td className="text-right">
                  {totalQtyByMonth(prevYearMonth, empData?.prevYearData).reduce(
                    (a, b) => a + b,
                    0
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <div className={"print__footer"}>
            <h2>NOTE</h2>
            <h2>1. EMPLOYEE MONTHLY SALES QUANTITY.</h2>
          </div>
        </div>
      </ReportLayout>
    );
  };

  return (
    <div>
      <div className={"flex bg-white py-4 gap-x-5 py-2 px-5 rounded mb-4"}>
        <Button
          className={showMOMqty ? "btn__active" : ""}
          onClick={() => {
            setShowMOMqty(true);
            setShowMOMAmount(false);
          }}
        >
          Show MOM QTY
        </Button>
        <Button
          className={showMOMAmount ? "btn__active" : ""}
          onClick={() => {
            setShowMOMqty(false);
            setShowMOMAmount(true);
          }}
        >
          Show MOM Amount
        </Button>
      </div>
      {loading ? <Loader /> : null}
      {showMOMqty ? <MOMQty /> : null}
      {showMOMAmount ? <MOMAmount /> : null}
    </div>
  );
};

export default EmployeeSales;
