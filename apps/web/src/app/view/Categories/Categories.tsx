import { Table } from "antd";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getCat } from "../../../redux/actions/category";
import { useAppDispatch, useTypedSelector } from "../../../redux/store";
import { Category } from "../../../redux/types";
import { Pagination, PrintAble } from "../../components";
import Loader from "../../components/Loader";
import { useSettingContext } from "../../context/SettingProver";
import { handlePrint } from "../../utils/helper";

const Categories = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCat());
  }, [dispatch]);

  const { categories, isLoading } = useTypedSelector((state) => state.category);
  const { page, pageSize, setPage, setPageSize } = useSettingContext();
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <PrintAble
        title={"Categories"}
        handlePrint={() => handlePrint(categories, ["categoryName"])}
        showExcel={false}
        showPDF={false}
      >
        <Table
          dataSource={categories}
          rowKey={(object) => object.categoryName}
          pagination={{
            current: page,
            total: categories.length,
            pageSize: pageSize,
            onChange: (page, size) => {
              setPage(page);
              setPageSize(size);
            },
            style: {
              display: "none",
            },
          }}
          id="categories-table"
          rowClassName={
            "dark:bg-slate-700 dark:text-white dark:hover:text-primaryColor-900"
          }
        >
          <Table.Column
            title="Category Name"
            dataIndex={"categoryName"}
            key="categoryName"
          />
          <Table.Column
            title="Actions"
            dataIndex={"id"}
            render={(value, record: Category) => {
              return <Link to={`${record.id}`}>Edit</Link>;
            }}
          />
        </Table>
        <Pagination
          currentPage={page}
          total={categories.length}
          onChange={(page, size) => {
            setPage(page);
            setPageSize(size);
          }}
          pageSize={pageSize}
        />
      </PrintAble>
    </div>
  );
};

export default Categories;
