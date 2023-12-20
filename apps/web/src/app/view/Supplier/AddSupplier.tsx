import { Typography } from "antd";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { addSupplier } from "../../../redux/actions/supplier";
import { useAppDispatch, useTypedSelector } from "../../../redux/store";
import { Button, CommonInput } from "../../components";

const AddWH = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading } = useTypedSelector((state) => state.supplier);

  return (
    <div className="w-full pt-10 flex items-start justify-center flex-col">
      <Typography className="font-bold text-2xl mb-2 dark:text-white">
        Add Supplier
      </Typography>
      <Formik
        initialValues={{
          supplierName: "",
          contactPersonName: "",
          supplierAddress: "",
          contactPersonNumber: "",
          altContactNumber: "",
          supplierEmail: "",
          extraInfo: "",
        }}
        onSubmit={async (value, { resetForm, setErrors }) => {
          await dispatch(addSupplier(value, resetForm, navigate));
        }}
      >
        <Form className="w-full flex flex-col gap-y-6 items-center pt-10 bg-white p-4 dark:bg-primaryColor-900">
          <CommonInput
            name="supplierName"
            label="Supplier Name"
            placeholder="Supplier Name"
            required
          />
          <CommonInput
            name="supplierEmail"
            label="Supplier Email"
            placeholder="Supplier Email"
          />

          <CommonInput
            name="contactPersonName"
            label="Contact Person"
            placeholder="Contact Person"
            required
          />

          <CommonInput
            name="contactPersonNumber"
            label="Contact Number"
            placeholder="Contact Number"
            required
          />

          <CommonInput
            name="altContactNumber"
            label="Alt Contact"
            placeholder="Alt Contact"
          />
          <CommonInput
            name="supplierAddress"
            label="Supplier Address"
            placeholder="Supplier Address"
            required
          />
          <CommonInput
            name="extraInfo"
            label="Extra Info"
            placeholder="Extra Info"
          />
          <Button type="submit" loading={isLoading}>
            Save
          </Button>
        </Form>
      </Formik>
    </div>
  );
};

export default AddWH;
