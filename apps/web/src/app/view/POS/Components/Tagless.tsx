import { Modal } from "antd";
import { Form, Formik } from "formik";
import React, { SetStateAction } from "react";
import { useAppDispatch, useTypedSelector } from "../../../../redux/store";
import { fetchProduct } from "../../../../redux/actions/product";
import api from "../../../../api";
import { rejectedToast } from "../../../utils/toaster";
import { CommonInput, SelectInput } from "../../../components";
import Button from "../../../components/Button";

interface TaglessProps {
  showTaglessModal: boolean;
  setShowTaglessModal: React.Dispatch<SetStateAction<boolean>>;
  setCart: React.Dispatch<SetStateAction<Product[]>>;
}

const Tagless: React.FC<TaglessProps> = React.memo(
  ({ showTaglessModal, setShowTaglessModal, setCart }) => {
    const dispatch = useAppDispatch();
    const { productGroup } = useTypedSelector((state) => state.productGroup);
    return (
      <Modal
        open={showTaglessModal}
        onCancel={() => {
          setShowTaglessModal(false);
        }}
        footer={false}
      >
        <Formik
          initialValues={{
            size: "",
            sellPrice: 0,
            productGroup: "",
          }}
          onSubmit={async (values) => {
            api
              .post("/product/tagless", values)
              .then((res) => {
                setCart((prev) => [...prev, res.data]);
                dispatch(fetchProduct());
              })
              .catch((err) => {
                rejectedToast(err);
              });
            setShowTaglessModal(false);
          }}
        >
          {
            <Form className="flex flex-col gap-y-2">
              <CommonInput name="sellPrice" label="Sell Price" type="number" />
              <SelectInput label="Product Group" name="productGroup">
                {productGroup.map((pg) => (
                  <option key={pg.productName} value={pg.productName}>
                    {pg.productName}
                  </option>
                ))}
              </SelectInput>
              <CommonInput
                name="size"
                label="Size"
                placeholder={"Eg: M,L,42,46"}
                type="text"
              />
              <Button type="submit" className="btn__common">
                Add Tagless Product
              </Button>
            </Form>
          }
        </Formik>
      </Modal>
    );
  }
);
export default Tagless;
