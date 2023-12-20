import { Pagination } from "antd";
import React from "react";

interface PaginationProps {
  currentPage: number;
  total: number;
  pageSize: number;
  onChange: (page: number, size: number) => void;
}

const PaginationPage: React.FC<PaginationProps> = ({
  total,
  pageSize,
  onChange,
  currentPage,
}) => (
  <div
    className={`
    w-full flex justify-end py-6

    ${total < 50 ? "hidden" : ""}
    `}
  >
    <Pagination
      total={total}
      current={currentPage}
      pageSize={pageSize}
      onChange={onChange}
    />
  </div>
);

export default PaginationPage;
