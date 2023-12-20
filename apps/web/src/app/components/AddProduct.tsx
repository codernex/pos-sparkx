import { Form } from "formik";
import styled from "styled-components";
import { Button, CommonInput, SelectInput } from ".";
import { useAppDispatch, useTypedSelector } from "../../redux/store";
import React, { useEffect } from "react";
import { getProductGroup } from "../../redux/actions/productGroup";
import { Modal } from "antd";

const FormGroup = styled.div`
  display: flex;
  column-gap: 40px;
  width: 100%;
`;
const AddProduct: React.FC<{
  itemCode: string;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
}> = ({ itemCode, handleSubmit }) => {
  const dispatch = useAppDispatch();

  const { productGroup } = useTypedSelector((store) => store.productGroup);
  const { showroom } = useTypedSelector((store) => store.showroom);
  const { suppliers } = useTypedSelector((store) => store.supplier);
  const { warehouses } = useTypedSelector((store) => store.warehouse);
  const { isLoading } = useTypedSelector((store) => store.products);

  useEffect(() => {
    dispatch(getProductGroup());
  }, [dispatch]);
  const [confimationModal, setConfirmationModal] = React.useState(false);
  return (
    <Form
      method={"POST"}
      onSubmit={(e) => {
        e.preventDefault();
        setConfirmationModal(true);
      }}
      className="w-full flex flex-col gap-y-6 items-center bg-white rounded p-4 dark:bg-primaryColor-900"
    >
      <Modal
        open={confimationModal}
        footer={false}
        onCancel={() => setConfirmationModal(false)}
      >
        <h1 className="confirm__modal--heading">
          Are you sure! you want to Continue?
        </h1>
        <div className={"flex gap-x-5"}>
          <button
            className={"confirm__modal--btn cancel"}
            type={"button"}
            onClick={() => setConfirmationModal(false)}
          >
            Cancel
          </button>
          <button
            type={"button"}
            className={"confirm__modal--btn continue"}
            onClick={() => {
              handleSubmit();
              setConfirmationModal(false);
            }}
          >
            Confirm
          </button>
        </div>
      </Modal>
      <FormGroup>
        <CommonInput required name="invoiceNumber" label="Invoice Number" />
        <CommonInput
          required
          label="Invoice Date"
          type="date"
          name="invoiceDate"
        />
      </FormGroup>
      <FormGroup>
        <CommonInput
          required
          label="Invoice Total Price"
          type="number"
          name="invoiceTotalPrice"
        />
        <CommonInput required label="Lot Number" name="lotNumber" />
      </FormGroup>
      <FormGroup>
        <SelectInput required name="supplierName" label="Supplier Name">
          {suppliers.map((sp) => (
            <option key={sp.id} value={sp.supplierName}>
              {sp.supplierName}
            </option>
          ))}
        </SelectInput>
        <SelectInput required name="productGroup" label="Product Group">
          {productGroup.map((pg) => (
            <option key={pg.id} value={pg.productName}>
              {pg.productName}
            </option>
          ))}
        </SelectInput>
      </FormGroup>
      <FormGroup>
        <CommonInput
          required
          label="Total Item"
          type="number"
          name="totalItem"
        />
        <CommonInput required label="Unit Cost" type="number" name="unitCost" />
      </FormGroup>
      <FormGroup>
        <CommonInput
          required
          label="Sell Price"
          type="number"
          name="sellPrice"
        />
      </FormGroup>
      <FormGroup>
        <SelectInput required name="showroomName" label="Current Location">
          {showroom.map((sr) => (
            <option key={sr.id} value={sr.showroomName}>
              {sr.showroomName}
            </option>
          ))}
        </SelectInput>
        {/* <SelectInput required name='whName' label='Location'>
                    {warehouses.map(wh => (
                        <option key={wh.whId} value={wh.whName}>
                            {wh.whName}
                        </option>
                    ))}
                </SelectInput> */}
      </FormGroup>
      <Button type="submit" loading={isLoading}>
        Save
      </Button>
    </Form>
  );
};

export default AddProduct;
