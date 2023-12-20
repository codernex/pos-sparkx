import React, { SetStateAction } from "react";
import { Select } from "antd";
import moment from "moment/moment";
import { UserRole } from "../../types";
import { AiFillFilePdf } from "react-icons/ai";
import { useSettingContext } from "../context/SettingProver";
import { useTypedSelector } from "../../redux/store";
import { FaFileExcel, FaNetworkWired, FaPrint } from "react-icons/fa";
import { handleExcelHtml } from "../utils/helper";

interface ReportLayoutProps {
  handleGenerate: React.MouseEventHandler<HTMLElement>;
  monthNumber?: number;
  setMonthNumber?: React.Dispatch<SetStateAction<number>>;
  monthData?: { value: number; name: string }[];
  srCode?: string;
  setSrCode?: React.Dispatch<SetStateAction<string>>;
  handlePdf: () => void;
  handlePrint: () => void;
  children: React.ReactNode;
  yearData?: number[];
  year?: number;
  setYear?: React.Dispatch<SetStateAction<number>>;
  supplierName?: string;
  setSupplierName?: React.Dispatch<SetStateAction<string>>;
  productGroup?: string;
  setProductGroup?: React.Dispatch<SetStateAction<string>>;
  sellingStatus?: string;
  setSellingStatus?: React.Dispatch<SetStateAction<string>>;
  excelTableId?: string;
  excelTitle: string;
  showPdf?: boolean;
  handleExcel?: () => void;
}

const ReportLayout: React.FC<ReportLayoutProps> = ({
  monthNumber,
  setMonthNumber,
  monthData,
  srCode,
  setSrCode,
  handleGenerate,
  handlePdf,
  handlePrint,
  children,
  yearData = [
    2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034,
    2035, 2036, 2037, 2038,
  ],
  year,
  setYear,
  supplierName,
  setSupplierName,
  productGroup,
  setProductGroup,
  sellingStatus,
  setSellingStatus,
  excelTableId,
  excelTitle,
  showPdf = true,
  handleExcel,
}) => {
  const { currentUser } = useSettingContext();
  const { showroom } = useTypedSelector((state) => state.showroom);
  const { suppliers } = useTypedSelector((state) => state.supplier);
  const { productGroup: productData } = useTypedSelector(
    (state) => state.productGroup
  );

  return (
    <div className={"min-h-[100vh]  rounded-md duration-500 "}>
      <div
        className={
          "border border-slate-400 p-5 mb-4 bg-white shadow drop-shadow-lg rounded-md"
        }
      >
        <div className={"flex gap-x-2 items-center"}>
          {setSupplierName ? (
            <div>
              <h1 className={"font-semibold"}>Supplier Name</h1>
              <Select
                value={supplierName}
                className={"w-[140px]"}
                onChange={(value) => setSupplierName(value)}
                options={suppliers.map((supplier) => ({
                  label: supplier.supplierName,
                  value: supplier.supplierName,
                }))}
              />
            </div>
          ) : null}
          {setProductGroup ? (
            <div>
              <h1 className={"font-semibold"}>Product Group</h1>
              <Select
                value={productGroup}
                className={"w-[140px]"}
                onChange={(value) => setProductGroup(value)}
                options={productData.map((p) => ({
                  label: p.productName,
                  value: p.productName,
                }))}
              />
            </div>
          ) : null}
          {setSellingStatus ? (
            <div>
              <h1 className={"font-semibold"}>Selling Status</h1>
              <Select
                value={sellingStatus}
                className={"w-[140px]"}
                onChange={(value) => setSellingStatus(value)}
                options={["Sold", "Unsold"].map((p) => ({
                  label: p,
                  value: p,
                }))}
              />
            </div>
          ) : null}
          {setYear && year ? (
            <div>
              <h1 className={"font-semibold"}>Year</h1>
              <Select
                value={year}
                className={"w-[140px]"}
                onChange={(value) => setYear(value)}
                options={
                  yearData &&
                  yearData.map((year) => ({
                    label: year,
                    value: year,
                  }))
                }
              />
            </div>
          ) : null}
          {setMonthNumber && monthNumber ? (
            <div>
              <h1 className={"font-semibold"}>Month</h1>
              <Select
                value={monthNumber}
                onChange={(value) => setMonthNumber(value)}
                defaultValue={moment().month() + 1}
                className={"w-[140px]"}
                options={
                  monthData &&
                  monthData.map((month) => ({
                    value: month.value,
                    label: month.name,
                  }))
                }
              />
            </div>
          ) : null}
          {currentUser?.role === UserRole[0] && setSrCode ? (
            <div>
              <h1 className={"font-semibold"}>Showroom</h1>
              <Select
                value={srCode}
                onChange={(value) => setSrCode(value)}
                className={"w-[140px]"}
                options={showroom.map((sr) => ({
                  value: sr.showroomCode,
                  label: sr.showroomName,
                }))}
              />
            </div>
          ) : null}
        </div>
        <div className={"flex mt-4 gap-x-3"}>
          <button
            className={"report__btn bg-orange-600 text-white"}
            onClick={handleGenerate}
          >
            <FaNetworkWired />
            <span>Generate</span>
          </button>
          <button
            className={"report__btn bg-green-600 text-white"}
            onClick={handlePrint}
          >
            <FaPrint />
            <span>Print Data</span>
          </button>

          <button
            className={"report__btn bg-green-600 text-white"}
            onClick={() =>
              excelTableId
                ? handleExcelHtml(excelTableId, excelTitle)
                : handleExcel
                ? handleExcel()
                : null
            }
          >
            <FaFileExcel />
            <span>Excel</span>
          </button>
          {showPdf ? (
            <button
              onClick={handlePdf}
              className={"report__btn bg-red-900 text-white"}
            >
              <AiFillFilePdf />
              <span>PDF</span>
            </button>
          ) : null}
        </div>
      </div>
      <div className={"h-full p-5 bg-white rounded-md"}>{children}</div>
    </div>
  );
};

export default ReportLayout;
