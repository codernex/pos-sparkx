import { Modal, Button, Table } from "antd";
import { Formik, Form } from "formik";
import React, { SetStateAction, useEffect, useState } from "react";
import { useAppDispatch, useTypedSelector } from "../../../../redux/store";
import { toast } from "react-toastify";
import { CommonInput, SelectInput } from "../../../components";
import { AiFillCloseCircle, AiOutlineClose } from "react-icons/ai";
import api from "../../../../api";
import { rejectedToast } from "../../../utils/toaster";
import { fetchProduct } from "../../../../redux/actions/product";
import { getInvoice } from "../../../../redux/actions/invoice";
import { fetchCustomer } from "../../../../redux/actions/customer";
import { fetchEmployee } from "../../../../redux/actions/employee";

interface ReturnModalProps {
  showReturnModal: boolean;
  setShowReturnModal: React.Dispatch<SetStateAction<boolean>>;
  setReturnId: React.Dispatch<React.SetStateAction<number | null>>;
  returnId: number | null;
  setReturnLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setReturns: React.Dispatch<SetStateAction<IReturned[]>>;
}

const ReturnModal: React.FC<ReturnModalProps> = React.memo(
  ({
    setShowReturnModal,
    showReturnModal,
    returnId,
    setReturnId,
    setReturnLoading,
    setReturns,
  }) => {
    const { customers } = useTypedSelector((state) => state.customer);
    const { products } = useTypedSelector((state) => state.products);
    const [returnProduct, setReturnProduct] = useState<Product[]>([]);

    const dispatch = useAppDispatch();

    const [customerPhone, setCustomerPhone] = useState("");

    useEffect(() => {
      if (returnProduct.length > 0) {
        const customer = customers.find((c) => {
          return c.purchasedProducts.some((p) => {
            return p.itemCode === returnProduct[0].itemCode;
          });
        });

        console.log(customer);

        if (customer) {
          setCustomerPhone(customer.customerPhone);
        }
      }
    }, [returnProduct, customers]);

    return (
      <>
        <Modal
          open={showReturnModal}
          footer={false}
          onCancel={() => setShowReturnModal(false)}
        >
          <Formik
            initialValues={{ itemCode: "" }}
            onSubmit={(values, { resetForm }) => {
              const returnProduct = products.filter(
                (product) =>
                  product.sellingStatus === "Sold" &&
                  product.itemCode === values.itemCode
              );

              if (returnProduct.length) {
                setReturnProduct((prev) => [...prev, ...returnProduct]);
              } else {
                toast.error("Maybed Product not selled");
              }
              resetForm();
            }}
          >
            <Form>
              <CommonInput
                placeholder="Enter Product Code"
                label="Item Code"
                name="itemCode"
              />
            </Form>
          </Formik>
          {returnProduct.length ? (
            <>
              <Table
                dataSource={returnProduct}
                rowKey={(obj: Product) => obj.itemCode}
                pagination={false}
              >
                <Table.Column
                  title="SL"
                  render={(_, rec, index) => index + 1}
                />
                <Table.Column title="Item Code" dataIndex={"itemCode"} />
                <Table.Column
                  title="Price"
                  dataIndex={"sellPriceAfterDiscount"}
                />
                <Table.Column
                  title={<AiFillCloseCircle />}
                  render={(_, rec: Product) => {
                    return (
                      <AiOutlineClose
                        cursor={"pointer"}
                        onClick={() => {
                          const filteredReturn = returnProduct.filter(
                            (p) => p.id !== rec.id
                          );

                          setReturnProduct(filteredReturn);
                        }}
                      />
                    );
                  }}
                />
              </Table>

              <Formik
                enableReinitialize
                initialValues={{
                  items: returnProduct.map((item) => item.itemCode),
                  check: "",
                  exchange: "",
                  customerPhone: customerPhone,
                  cash: 0,
                  bkash: 0,
                  cbl: 0,
                  returnDate: "",
                }}
                onSubmit={(values, { resetForm }) => {
                  setReturnLoading(true);
                  api
                    .post("/invoice/return", values)
                    .then((res) => {
                      if (res.data.exchange) {
                        setReturnId(res.data.id);
                        api.get("/invoice/return").then(async (res) => {
                          setReturns(res.data);
                        });
                      } else {
                        setReturnId(null);
                      }
                      toast.success("Product Successfully Returned");
                    })
                    .catch((err) => {
                      rejectedToast(err);
                    })
                    .finally(async () => {
                      await dispatch(getInvoice());
                      await dispatch(fetchProduct());
                      await dispatch(fetchEmployee());
                      await dispatch(fetchCustomer());
                      resetForm();
                      setShowReturnModal(false);
                      setReturnLoading(false);
                    });
                }}
              >
                {({ values, setFieldValue, handleSubmit, handleChange }) => (
                  <Form className="mt-2 flex flex-col gap-y-3">
                    <CommonInput
                      label="Check %"
                      name="check"
                      placeholder="eg: 100%"
                      onChange={handleChange}
                    />
                    <SelectInput
                      label="Exchange"
                      name="exchange"
                      placeholder="Exchange"
                      value={values.exchange}
                      onChange={handleChange}
                      children={["Exchanging", "Not Exchanging"].map((e) => (
                        <option value={e} key={e}>
                          {e}
                        </option>
                      ))}
                    />

                    {!customerPhone && (
                      <CommonInput
                        name="customerPhone"
                        value={customerPhone}
                        disabled={!!customerPhone}
                        label="Customer Phone"
                      />
                    )}

                    {values.exchange === "Not Exchanging" ? (
                      <>
                        <CommonInput
                          name="returnDate"
                          placeholder="Date"
                          label="Date"
                          type="date"
                          step={1}
                        />

                        <h1 className="text-xl font-semibold">
                          You Have To Return Maximumn{" "}
                          {returnProduct.reduce(
                            (acc, a) => acc + a.sellPriceAfterDiscount,
                            0
                          )}
                          tk
                        </h1>

                        <div className="flex gap-x-2">
                          <CommonInput
                            name="cash"
                            placeholder="CASH"
                            label="CASH"
                            type="number"
                            step={1}
                          />
                          <CommonInput
                            name="bkash"
                            placeholder="Bkash"
                            label="Bkash"
                            type="number"
                            step={1}
                          />
                          <CommonInput
                            name="cbl"
                            placeholder="CBL"
                            label="CBL"
                            type="number"
                            step={1}
                          />
                        </div>
                      </>
                    ) : (
                      ""
                    )}

                    <Button onClick={() => handleSubmit()}>Return</Button>
                  </Form>
                )}
              </Formik>
            </>
          ) : (
            ""
          )}
        </Modal>
      </>
    );
  }
);
export default ReturnModal;
