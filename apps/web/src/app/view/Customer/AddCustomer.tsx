import React from "react";
import { Form, Formik } from "formik";
import { useAppDispatch, useTypedSelector } from "../../../redux/store";
import { createCustomer } from "../../../redux/actions/customer";
import { Button, CommonInput } from "../../components";
import SelectInput from "../../components/Input/SelectInput";
import { useSettingContext } from "../../context/SettingProver";

interface AddCustomerProps {}

const AddCustomer: React.FC<AddCustomerProps> = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useTypedSelector((state) => state.customer);
  const { showroom } = useTypedSelector((state) => state.showroom);
  const { currentUser } = useSettingContext();
  return (
    <div className={"mt-10"}>
      <h1 className={"text-2xl mb-10 dark:text-white"}>Create New Customer</h1>
      <Formik
        initialValues={{
          customerName: "",
          customerPhone: "",
          customerEmail: "",
          customerAddress: "",
          showroomCode: "",
        }}
        onSubmit={async (values, { resetForm }) => {
          dispatch(createCustomer(values));
          resetForm();
        }}
      >
        <Form className="space-y-2">
          <CommonInput
            required={true}
            label={"Customer Name"}
            name={"customerName"}
          />
          <CommonInput
            required={true}
            label={"Customer Phone"}
            name={"customerPhone"}
          />
          <CommonInput label={"Customer Email"} name={"customerEmail"} />
          <CommonInput label={"Customer Address"} name={"customerAddress"} />
          {currentUser?.role === "SuperAdmin" ? (
            <SelectInput name="showroomCode" label="Select Showroom">
              {showroom.map((sr) => {
                return (
                  <option
                    key={sr.showroomCode}
                    id={sr.showroomCode}
                    value={sr.showroomCode}
                  >
                    {sr.showroomName}
                  </option>
                );
              })}
            </SelectInput>
          ) : (
            ""
          )}
          <Button type={"submit"} loading={isLoading}>
            Save
          </Button>
        </Form>
      </Formik>
    </div>
  );
};

export default AddCustomer;
