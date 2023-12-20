import { Typography } from "antd";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { getProductGroup } from "../../../redux/actions/productGroup";
import { getSupplier } from "../../../redux/actions/supplier";
import { useAppDispatch, useTypedSelector } from "../../../redux/store";
import { Button, HookInput, SelectInput } from "../../components";
import { createMultipleProduct } from "../../../redux/actions/product";
import { filter } from "underscore";

const AddMultiple = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getSupplier());
    dispatch(getProductGroup());
  }, [dispatch]);

  const { products } = useTypedSelector((state) => state.products);
  const { suppliers } = useTypedSelector((state) => state.supplier);
  const { productGroup } = useTypedSelector((state) => state.productGroup);
  const { warehouses } = useTypedSelector((state) => state.warehouse);
  const { showroom } = useTypedSelector((state) => state.showroom);

  const [itemCount, setItemCount] = useState<number>(0);

  interface Item {
    code: string;
    price: number;
  }

  const item = function (): Item[] {
    const item: Item[] = [];

    if (itemCount) {
      const filteredProducts = filter(products, (pr) => !pr.tagless);
      for (let i = 1; i <= itemCount; i++) {
        const itemCodeNumber =
          parseInt(filteredProducts[filteredProducts.length - 1]?.itemCode) +
            i || 0 + i;

        item.push({
          code: itemCodeNumber.toString().padStart(10, "00"),
          price: 0,
        });
      }
    }
    return item;
  };

  const initialValues = {
    items: item().map((p) => ({
      itemCode: p.code,
      sellPrice: p.price,
    })),
  };

  //Multiple Check
  const MultipleCheck = () => {
    return (
      <Formik
        initialValues={{ pCount: "" }}
        onSubmit={(value) => {
          if (value.pCount) {
            setItemCount(parseInt(value.pCount));
          }
        }}
        enableReinitialize
      >
        {() => (
          <InitialForm className="bg-white flex flex-col items-center p-10 justify-around gap-y-3">
            <Typography>Item Count</Typography>
            <Field
              className="border border-black outline-none px-10 py-1 w-full"
              name="pCount"
              id="pCount"
              placeholder="How Many Items?"
              type="number"
              required
            />
            <button className="" type="submit">
              Go Next
            </button>
          </InitialForm>
        )}
      </Formik>
    );
  };

  //Important Steps

  return (
    <div className="w-full pt-10 flex items-center justify-center relative">
      {!itemCount ? (
        <MultipleCheck />
      ) : (
        <ProductForm>
          <Typography className="text-2xl my-10 dark:text-white">
            Add New Product
          </Typography>
          <div className="flex gap-x-20">
            <Formik
              enableReinitialize={true}
              initialValues={{
                invoiceNumber: "",
                invoiceDate: "",
                invoiceTotalPrice: 0,
                lotNumber: 0,
                supplierName: "",
                showroomName: "",
                unitCost: 0,
                productGroup: "",
                items: initialValues.items,
              }}
              onSubmit={async (value) => {
                await dispatch(createMultipleProduct(value));
              }}
            >
              <>
                <Form
                  id="form1multiple"
                  className="w-full flex flex-col gap-y-6 items-center"
                >
                  <FormGroup>
                    <HookInput
                      required
                      name="invoiceNumber"
                      label="Invoice Number"
                      placeholder="EG: #0001, 002, IV:002"
                    />
                    <HookInput
                      required
                      label="Invoice Date"
                      type="date"
                      name="invoiceDate"
                    />
                  </FormGroup>
                  <FormGroup>
                    <HookInput
                      required
                      label="Invoice Total Price"
                      type="number"
                      name="invoiceTotalPrice"
                    />
                    <HookInput
                      required
                      label="Lot Number"
                      type="number"
                      name="lotNumber"
                    />
                  </FormGroup>
                  <FormGroup>
                    <SelectInput
                      label="Supplier Name"
                      name="supplierName"
                      children={suppliers.map((sp) => (
                        <option key={sp.id} value={sp.supplierName}>
                          {sp.supplierName}
                        </option>
                      ))}
                      required
                    />
                    <SelectInput
                      label="Product Group"
                      name="productGroup"
                      children={productGroup.map((sp) => (
                        <option key={sp.id} value={sp.productName}>
                          {sp.productName}
                        </option>
                      ))}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <HookInput
                      label="Unit Cost"
                      type="number"
                      name="unitCost"
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <SelectInput
                      label="Select Location"
                      name="showroomName"
                      required
                      children={showroom.map((sp) => (
                        <option key={sp.id} value={sp.showroomName}>
                          {sp.showroomName}
                        </option>
                      ))}
                    />
                  </FormGroup>

                  <Button type="submit">Save</Button>
                </Form>

                <div className="w-full flex flex-col gap-y-6">
                  {initialValues.items.map((item, index) => (
                    <div key={index} className="flex  gap-x-4">
                      <div className="w-full">
                        <label
                          className={"dark:text-white"}
                          htmlFor={`items[${index}].itemCode`}
                        >
                          Item Code
                        </label>
                        <Field
                          value={item.itemCode}
                          className="h-[37px] w-full cursor-not-allowed text-slate-500 rounded border border-b-2 border-b-slate-300 outline-none bg-transparent pl-3 dark:bg-slate-700 dark:text-white"
                          // name={`items[${index}].itemCode`}
                          type={"disabled"}
                          id={`items[${index}].itemCode`}
                        />
                      </div>
                      <div className="w-full">
                        <label
                          className={"dark:text-white"}
                          htmlFor={`items[${index}].sellPrice`}
                        >
                          Sell Price
                        </label>
                        <Field
                          type="number"
                          name={`items[${index}].sellPrice`}
                          className="h-[37px] w-full rounded border border-b-2 border-b-slate-300 outline-none bg-transparent pl-3 dark:bg-slate-700 dark:text-white"
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            </Formik>
          </div>
        </ProductForm>
      )}
    </div>
  );
};

const InitialForm = styled(Form)`
  width: 50%;
`;
const ProductForm = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  row-gap: 30px;
  justify-content: center;
`;
const FormGroup = styled.div`
  display: flex;
  column-gap: 40px;
  width: 100%;
`;

export default AddMultiple;
