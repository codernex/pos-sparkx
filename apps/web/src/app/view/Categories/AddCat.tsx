import { Typography } from "antd";
import { Form, Formik } from "formik";
import { createCat } from "../../../redux/actions/category";
import { useAppDispatch, useTypedSelector } from "../../../redux/store";
import { Button, CommonInput } from "../../components";

const AddCat = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useTypedSelector((state) => state.category);
  return (
    <div>
      <Typography className="text-2xl my-10 dark:text-white">
        Add New Category
      </Typography>
      <Formik
        initialValues={{ categoryName: "" }}
        onSubmit={async (value, { resetForm }) => {
          await dispatch(createCat(value, resetForm));
        }}
      >
        <Form className="bg-white p-10 rounded flex flex-col gap-y-6 items-center dark:bg-primaryColor-900">
          <CommonInput
            type={"text"}
            name="categoryName"
            label="Category Name"
            placeholder="Category Name"
          />

          <Button type="submit" loading={isLoading}>
            Save
          </Button>
        </Form>
      </Formik>
    </div>
  );
};

export default AddCat;
