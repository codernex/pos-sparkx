import React, { useState } from "react";
import { useTypedSelector } from "../../../redux/store";
import { Field, Form, Formik } from "formik";
import { Button, SelectInput } from "../../components";
import { toast } from "react-toastify";
import { AiOutlineDelete } from "react-icons/ai";
import { Spin } from "antd";
import api from "../../../api";
import { rejectedToast, successToast } from "../../utils/toaster";
import { AxiosError } from "axios";
import { ApiError } from "../../../redux/types";
import ConfirmationModal from "../../components/ConfirmationModal";

interface TransferProductProps {}

const TransferProduct: React.FC<TransferProductProps> = () => {
  const { showroom } = useTypedSelector((state) => state.showroom);
  const [transferAbleProduct, setTransferAbleProduct] = React.useState<
    Product[]
  >([]);
  const [selectedTransfer, setSelectedTransfer] = React.useState<Product[]>([]);
  const [showRemoveBtn, setShowRemoveBtn] = React.useState<null | number>(null);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    itemCodes: [{ itemCode: "" }],
    currentShowroom: "",
    plannedShowroom: "",
  };

  return (
    <div className={"mt-10"}>
      {/*
                    Previous Transferred Product
                */}
      {/* <Modal
        width={800}
        open={showModal}
        footer={false}
        onCancel={() => setShowModal(false)}
      >
        <Table dataSource={transferred} rowKey={(obj) => obj.id}>
          <Table.Column title={"SL"} render={(_, rec, index) => index + 1} />
          <Table.Column title={"P. Location"} dataIndex={"prevLocation"} />
          <Table.Column title={"C. Location"} dataIndex={"currentLocation"} />
          <Table.Column title={"T. Products"} dataIndex={"productCount"} />
          <Table.Column title={"Lot Number"} dataIndex={"transferredLot"} />
        </Table>
      </Modal>
      <div className={"mb-10"}>
        <button
          className={
            "px-2 py-1 border border-slate-400 w-fit flex gap-x-2 items-center dark:text-white"
          }
          onClick={() => setShowModal(true)}
        >
          <FaHistory /> History
        </button>
      </div> */}

      {/**
       * End Previous Returned Showroom
       */}

      <Formik
        initialValues={initialValues}
        onSubmit={(values, { resetForm }) => {
          console.log(values);

          values.itemCodes = selectedTransfer.map((item) => ({
            itemCode: item.itemCode,
          }));

          if (values.currentShowroom === values.plannedShowroom) {
            toast.error("Current Showroom & Planned Showroom Can't be same");
          } else {
            api
              .post("/product/transfer", values)
              .then((res) => {
                successToast(
                  "Transfer Success, Please Reload To See In Action"
                );
                resetForm();
                setTransferAbleProduct([]);
                setSelectedTransfer([]);
              })
              .catch((error: AxiosError<ApiError>) => {
                rejectedToast(error);
              });
          }
        }}
      >
        {({ handleSubmit, handleChange, setFieldValue }) => {
          return (
            <Form
              method={"post"}
              className={"h-full"}
              onSubmit={(event) => {
                event.preventDefault();
                setConfirmationModal(true);
              }}
            >
              {/*
                    Confirmation Modal
                    */}

              <ConfirmationModal
                open={confirmationModal}
                setOpen={setConfirmationModal}
                execute={async () => {
                  handleSubmit();
                }}
              />
              {
                // End Confirmation Modal
              }

              <div
                className={
                  "flex space-x-6 mb-10 shadow-lg py-4 rounded-md px-3"
                }
              >
                <SelectInput
                  label="Select From Showroom"
                  name="currentShowroom"
                  onChange={(e) => {
                    handleChange(e);
                    setFieldValue("currentShowroom", e.target.value);

                    setIsLoading(true);
                    api
                      .get("/product/filter", {
                        params: { showroomCode: e.target.value },
                      })
                      .then((res) => {
                        setTransferAbleProduct(res.data);
                        setIsLoading(false);
                      })
                      .catch((err) => {
                        setIsLoading(false);
                      });
                  }}
                  children={showroom.map((item, i) => (
                    <option key={i} value={item.showroomCode}>
                      {item.showroomName}
                    </option>
                  ))}
                />
                <SelectInput
                  label={"Select Planned Showroom"}
                  name={"plannedShowroom"}
                >
                  {showroom.map((item, i) => (
                    <option key={i} value={item.showroomName}>
                      {item.showroomName}
                    </option>
                  ))}
                </SelectInput>
                <Button type={"submit"}>Transfer</Button>
              </div>
            </Form>
          );
        }}
      </Formik>

      {/**
       *
       *
       *
       * Product Selection Area
       *
       *
       *
       */}

      {isLoading ? (
        <div className="w-full flex items-center justify-center h-96">
          <Spin />
        </div>
      ) : (
        <div className={"flex w-full space-x-5 shadow-md rounded-md py-4 px-3"}>
          <div className={"w-full flex flex-col gap-3"}>
            <div
              className={
                "flex justify-between border-dashed border-b border-slate-400 pb-3"
              }
            >
              <h1 className={"text-xl font-semibold dark:text-white"}>
                Select / Search Product
              </h1>
              <Formik
                initialValues={{
                  searchTerm: "",
                }}
                onSubmit={({ searchTerm }, { resetForm }) => {
                  const searchedProduct = transferAbleProduct.find(
                    (p) => p.itemCode === searchTerm
                  );
                  if (!searchedProduct) {
                    toast.error("Product Not Exist on this showroom");
                  } else if (selectedTransfer.includes(searchedProduct)) {
                    toast.error("Product already selected");
                  } else setSelectedTransfer((p) => [...p, searchedProduct]);

                  resetForm();
                }}
              >
                <Form>
                  <Field
                    name="searchTerm"
                    placeholder="Enter Product Code To Select"
                    className="w-80 py-1 border border-slate-400 rounded-md focus:border-slate-500 outline-none"
                    list="productList"
                  />
                  {/* <datalist id="productList">
                    {transferAbleProduct.map((item, i) => (
                      <option key={i} value={item.itemCode}>
                        {item.itemCode}
                      </option>
                    ))}
                  </datalist> */}
                </Form>
              </Formik>
              <button
                type={"button"}
                className={"bg-primary-color text-white px-2 py-0.5 rounded"}
                onClick={() => {
                  setSelectedTransfer(transferAbleProduct);
                }}
              >
                Select All
              </button>
            </div>

            <ul
              className={
                "h-[400px] space-y-2 overflow-y-scroll p-4 scrollbar-thin scrollbar-thumb-amber-700 scrollbar-thumb-rounded "
              }
            >
              {transferAbleProduct
                ? transferAbleProduct.map((item, index) => (
                    <li
                      onClick={() => {
                        if (selectedTransfer.includes(item)) {
                          return toast.error("Product Already Selected");
                        } else {
                          setSelectedTransfer((prev) => [...prev, item]);
                        }
                      }}
                      className={
                        "rounded-md bg-primary-color text-white p-4 cursor-pointer flex justify-between"
                      }
                      key={index}
                    >
                      <span>{item.productGroup}</span>{" "}
                      <span>{item.itemCode}</span>
                    </li>
                  ))
                : null}
            </ul>
          </div>
          <div className={"w-full flex flex-col gap-3 "}>
            <div
              className={
                "flex justify-between border-dashed border-b border-slate-400 pb-3"
              }
            >
              <h1 className={"text-xl font-semibold dark:text-white"}>
                Selected Products : {selectedTransfer.length} Items
              </h1>
              <button
                type={"button"}
                className={"bg-red-900 text-white px-2 py-0.5 rounded"}
                onClick={() => {
                  setSelectedTransfer([]);
                }}
              >
                Remove All
              </button>
            </div>
            <ul
              className={
                "h-[400px] space-y-2 overflow-y-scroll p-4 scrollbar-thin scrollbar-thumb-amber-700 scrollbar-thumb-rounded"
              }
            >
              {selectedTransfer.map((item, index) => (
                <div
                  key={index}
                  onMouseEnter={() => setShowRemoveBtn(index)}
                  onMouseLeave={() => setShowRemoveBtn(null)}
                  className={"relative"}
                >
                  <li
                    className={
                      "z-10 rounded-md bg-primary-color text-white p-4 cursor-pointer flex justify-between"
                    }
                  >
                    <span>{item.productGroup}</span>
                    <span>{item.itemCode}</span>
                  </li>
                  {showRemoveBtn === index ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTransfer((prevState) => {
                          return [
                            ...prevState.filter(
                              (p) => p.itemCode !== item.itemCode
                            ),
                          ];
                        });
                      }}
                      className={
                        "absolute duration-300 z-50 top-0 right-0 flex items-center justify-center h-full w-[80px] bg-red-500 text-white"
                      }
                    >
                      <AiOutlineDelete />
                    </button>
                  ) : null}
                </div>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferProduct;
