import { Typography } from "antd";
import { Field, Form, Formik } from "formik";
import { useRef, useState } from "react";
import BarcodeGeneratorComponent from "react-barcode";
import { FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import { printBarcode } from "../../../redux/actions/barcode";
import { useAppDispatch, useTypedSelector } from "../../../redux/store";
import { Button, Loader } from "../../components";
import { useSettingContext } from "../../context/SettingProver";

const Barcode = () => {
  const dispatch = useAppDispatch();

  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  const { products, isLoading } = useTypedSelector((state) => state.barcode);
  const { defaultBarcodeSettings } = useSettingContext();

  const [isClicked, setIsClicked] = useState<boolean>(false);
  const itemNodes: Array<number> = [];
  if (defaultBarcodeSettings) {
    for (let i = 0; i < defaultBarcodeSettings.stickerInRow; i++) {
      itemNodes.push(i);
    }
  }

  const LotForm = () => {
    return (
      <div>
        <Formik
          initialValues={{ startItemCode: "", endItemCode: "" }}
          onSubmit={(value) => {
            if (!value.startItemCode || !value.endItemCode) {
              toast.error("Invalid start item code ");
            } else {
              dispatch(printBarcode(value));
              setIsClicked(true);
            }
          }}
        >
          {() => (
            <Form className="bg-primary-color rounded p-10 rounder flex flex-col items-center gap-y-4 text-white">
              <h1 className={"text-2xl "}>Item Codes</h1>
              <Field
                name={"startItemCode"}
                placeholder={"Itemcode Start"}
                className={
                  "w-full rounded h-8 text-black focus:outline-none pl-2"
                }
              />
              <Field
                name={"endItemCode"}
                placeholder={"Itemcode End"}
                className={
                  "w-full rounded h-8 text-black focus:outline-none pl-2"
                }
              />
              <button
                type="submit"
                className="border-1 border-white text-white hover:text-light-white px-2  py-1 rounded-md"
              >
                Generate Barcode
              </button>
            </Form>
          )}
        </Formik>
      </div>
    );
  };

  if (!isClicked) {
    return <LotForm />;
  }
  if (isLoading) {
    return <Loader />;
  }

  if (!products?.length) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
        <Typography.Title level={3} className={"dark:text-white"}>
          No Product To Print Barcode ! Please Try A Different Lot Number
        </Typography.Title>
        <Button
          type="button"
          onClick={() => setIsClicked(false)}
          className={"dark:text-white"}
        >
          Go Back
        </Button>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex justify-between items-center">
        <Typography.Title level={3} className={"dark:text-white"}>
          Barcodes
        </Typography.Title>
        <div className={"flex gap-x-5"}>
          <span className={"text-xl font-semibold dark:text-white"}>
            Lot Number: {products[0].lotNumber}
          </span>

          <span className={"text-xl font-semibold dark:text-white"}>
            Total Products: {products.length}
          </span>
        </div>
        <div className="flex gap-x-10">
          <Button
            onClick={() => {
              setIsClicked(false);
            }}
          >
            Back
          </Button>
          <button
            onClick={handlePrint}
            className="flex gap-x-2 bg-yellow-300 items-center px-4 rounded py-1"
          >
            <FaPrint />
            Print
          </button>
        </div>
      </div>
      <div
        style={{
          width: "fit-content",
          display: "flex",
          flexDirection: "column",
          rowGap: `${defaultBarcodeSettings?.rowGap}in`,
        }}
        ref={printRef}
      >
        {products?.map((product, i) => {
          return (
            <div
              className="barcode__wrapper"
              style={{
                width: `${defaultBarcodeSettings?.paperWidth}in`,
                height: `${defaultBarcodeSettings?.paperHeight}in`,
                overflow: "hidden",
                columnGap: `${defaultBarcodeSettings?.columnGap}in`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              key={i}
            >
              {itemNodes.map((item) => {
                return (
                  <div
                    className="barcode__item"
                    style={{
                      width: `${defaultBarcodeSettings?.stickerWidth}in`,
                      height: `${defaultBarcodeSettings?.stickerHeight}in`,
                    }}
                    key={item}
                  >
                    <p
                      className="font-bold text-center"
                      style={{
                        fontSize: `${
                          defaultBarcodeSettings &&
                          defaultBarcodeSettings?.stickerHeight * 11
                        }px`,
                        lineHeight: `${
                          defaultBarcodeSettings &&
                          defaultBarcodeSettings?.stickerHeight * 12
                        }px`,
                      }}
                    >
                      {product.productGroup}
                    </p>
                    <p
                      className="text-[11px] font-bold"
                      style={{
                        fontSize: `${
                          defaultBarcodeSettings &&
                          defaultBarcodeSettings?.stickerHeight * 11
                        }px`,
                        lineHeight: `${
                          defaultBarcodeSettings &&
                          defaultBarcodeSettings?.stickerHeight * 12
                        }px`,
                      }}
                    >
                      Taka: {product.sellPrice}
                    </p>
                    <BarcodeGeneratorComponent
                      key={i}
                      width={
                        defaultBarcodeSettings &&
                        Math.floor(defaultBarcodeSettings?.stickerWidth) * 1.2
                      }
                      height={
                        defaultBarcodeSettings &&
                        defaultBarcodeSettings?.stickerHeight * 20 * 1.5
                      }
                      value={product.itemCode.toString()}
                      displayValue={false}
                      margin={0}
                      format="CODE128"
                      textAlign="center"
                    />
                    <p
                      className="font-bold"
                      style={{
                        fontSize: `${
                          defaultBarcodeSettings &&
                          defaultBarcodeSettings?.stickerHeight * 12
                        }px`,
                        lineHeight: `${
                          defaultBarcodeSettings &&
                          defaultBarcodeSettings?.stickerHeight * 12
                        }px`,
                      }}
                    >
                      {product.itemCode}
                    </p>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Barcode;
