import { Modal } from "antd";
import { Formik, Form } from "formik";
import React, { SetStateAction } from "react";
import { createCustomer } from "../../../../redux/actions/customer";
import { useAppDispatch, useTypedSelector } from "../../../../redux/store";
import { Button, CommonInput, SelectInput } from "../../../components";
import { useSettingContext } from "../../../context/SettingProver";

interface CustomerProps {
  showCustomerModal: boolean;
  setShowCustomerModal: React.Dispatch<SetStateAction<boolean>>;
  setCustomerPhone: React.Dispatch<SetStateAction<string | null>>;
}

const Customer: React.FC<CustomerProps> = React.memo(
  ({ setShowCustomerModal, showCustomerModal, setCustomerPhone }) => {
    const dispatch = useAppDispatch();
    const { isLoading } = useTypedSelector((state) => state.customer);
    const { currentUser } = useSettingContext();
    const { showroom } = useTypedSelector((state) => state.showroom);
    return (
      <Modal
        open={showCustomerModal}
        footer={false}
        onCancel={() => setShowCustomerModal(false)}
        title={"Add Customer"}
      >
        <Formik
          initialValues={{
            customerName: "",
            customerPhone: "",
            customerEmail: "",
            customerAddress: "",
            showroomCode: "",
          }}
          onSubmit={async (values) => {
            await dispatch(createCustomer(values, setCustomerPhone));
            setShowCustomerModal(false);
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
                    <option id={sr.showroomCode} value={sr.showroomCode}>
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
      </Modal>
    );
  }
);
export default Customer;
