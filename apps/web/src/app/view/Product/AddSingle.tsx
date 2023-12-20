import Typography from "antd/es/typography/Typography";
import { Formik } from "formik";
import { createSingleProduct } from "../../../redux/actions/product";
import { useAppDispatch, useTypedSelector } from "../../../redux/store";
import { AddProductSingle } from "../../components";
import { Navigate } from "react-router-dom";
import { filter } from "underscore";

const AddSingle = () => {
  const dispatch = useAppDispatch();
  const { products } = useTypedSelector((store) => store.products);

  let itemCode = "";
  if (products.length) {
    const filteredProducts = filter(products, (pr) => !pr.tagless);
    itemCode = (
      parseInt(filteredProducts[filteredProducts.length - 1]?.itemCode) + 1
    )
      .toString()
      .padStart(10, "0");
  } else {
    itemCode = "0000000001";
  }

  return (
    <div>
      <Typography className="text-2xl my-10 dark:text-white">
        Add New Product{" "}
        <span className="text-xl ml-3 text-slate-500">
          Item Starting From {itemCode}
        </span>
      </Typography>
      <Formik
        initialValues={{
          invoiceNumber: "",
          invoiceDate: "",
          lotNumber: "",
          invoiceTotalPrice: 0,
          supplierName: "",
          totalItem: 0,
          unitCost: 0,
          sellPrice: 0,
          showroomName: "",
          productGroup: "",
          itemCode: itemCode,
        }}
        enableReinitialize={true}
        onSubmit={async (value, { resetForm }) => {
          await dispatch(createSingleProduct(value, resetForm)).then(() => (
            <Navigate to="/" replace={true} />
          ));
        }}
      >
        {({ handleSubmit }) => (
          <AddProductSingle itemCode={itemCode} handleSubmit={handleSubmit} />
        )}
      </Formik>
    </div>
  );
};

export default AddSingle;
