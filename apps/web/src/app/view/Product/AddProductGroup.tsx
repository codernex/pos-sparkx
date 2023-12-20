import Typography from "antd/es/typography/Typography";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { getCat } from "../../../redux/actions/category";
import { createProductGroup } from "../../../redux/actions/productGroup";
import { useAppDispatch, useTypedSelector } from "../../../redux/store";
import { ProductGroup } from "../../../redux/types";
import { Button, CommonInput, Loader, SelectInput } from "../../components";

const AddProductGroup = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getCat());
  }, [dispatch]);
  const { categories, isLoading } = useTypedSelector((state) => state.category);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div>
      <Typography className="text-2xl my-10 dark:text-white">
        Add New Product Group
      </Typography>
      <Formik
        initialValues={
          {
            productName: "",
            productCategory: "",
            productCode: "",
          } satisfies ProductGroup
        }
        onSubmit={(value, { resetForm }) => {
          dispatch(createProductGroup(value, resetForm));
        }}
      >
        <Form className="bg-white flex flex-col gap-y-6 items-center p-4 rounded dark:bg-primaryColor-900">
          <CommonInput label="Product Code" name="productCode" />
          <CommonInput label="Product Name" name="productName" />
          <SelectInput name="productCategory" label="Category" required>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.categoryName}>
                {cat.categoryName}
              </option>
            ))}
          </SelectInput>
          <Button type="submit">Save</Button>
        </Form>
      </Formik>
    </div>
  );
};

export default AddProductGroup;
