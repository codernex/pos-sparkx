import { Field, Form, Formik } from "formik";
import React, { SetStateAction, useState } from "react";
import { useTypedSelector } from "../../../../redux/store";
import { filter } from "underscore";
import { toast } from "react-toastify";
import { FaPlus, FaSearch } from "react-icons/fa";
import { Spin, Tooltip } from "antd";

interface SearchProductProps {
  cart: Product[];
  setShowTaglessModal: React.Dispatch<SetStateAction<boolean>>;
  setCart: React.Dispatch<SetStateAction<Product[]>>;
  setFilteredProducts: React.Dispatch<SetStateAction<Product[] | null>>;
  filteredProducts: Product[] | null;
}

const SearchProduct: React.FC<SearchProductProps> = React.memo(
  ({
    cart,
    setShowTaglessModal,
    setCart,
    setFilteredProducts,
    filteredProducts,
  }) => {
    const [loading, setLoading] = useState(false);
    const { products } = useTypedSelector((state) => state.products);
    return (
      <div className="flex w-[40%] items-center flex-col relative">
        <Formik
          initialValues={{ searchTerm: "" }}
          onSubmit={({ searchTerm }, { resetForm }) => {
            //
            setLoading(true);
            const searchedProduct = filter(
              products,
              (element) =>
                element.productGroup.includes(searchTerm) ||
                element.itemCode.includes(searchTerm)
            );

            if (!searchedProduct.length) {
              toast.error("Please Try A Different Code, Maybe Try Again", {
                autoClose: 2000,
              });
              setLoading(false);
            } else {
              if (searchedProduct.length > 80) {
                toast.error(
                  "Many Product Found, Please Try To Use Specific Product Code",
                  { autoClose: 2000 }
                );
              } else if (searchedProduct.length === 1) {
                if (searchedProduct[0].sellingStatus !== "Unsold") {
                  toast.error(
                    searchedProduct[0].sellingStatus +
                      " product can't be added to cart",
                    {
                      autoClose: 2000,
                    }
                  );
                } else {
                  if (cart.includes(searchedProduct[0])) {
                    toast.error("This Product Is Already In Cart", {
                      autoClose: 2000,
                    });
                  } else {
                    setCart((prevCart) => [...prevCart, ...searchedProduct]);
                    setFilteredProducts([]);
                  }
                }
              } else {
                setFilteredProducts(searchedProduct);
              }
              setLoading(false);
            }

            resetForm();
          }}
        >
          {() => (
            <Form className={"flex w-full relative"}>
              <div className="border  h-[32px] w-[40px] justify-center border-r-0  border-slate-400 flex items-center">
                <FaSearch className="text-slate-500 dark:text-white" />
              </div>
              <Field
                className="pl-4 border border-solid h-[32px] w-full border-slate-400 focus:outline-none"
                type="text"
                placeholder="Enter Product Name / Item Code / Scan Bar Code ---- Press Enter On Keyboard"
                name={"searchTerm"}
              />
              <div
                className={
                  "flex justify-center items-center absolute right-3 top-2"
                }
              >
                {loading ? <Spin /> : null}
              </div>

              <div className="border  h-[32px] w-[40px] justify-center border-l-0 border-r-1  border-slate-400 flex items-center">
                <Tooltip title="Add Tagless Product">
                  <FaPlus
                    onClick={() => setShowTaglessModal(true)}
                    className="text-slate-500 dark:text-white"
                    cursor={"pointer"}
                  />
                </Tooltip>
              </div>
            </Form>
          )}
        </Formik>
        {filteredProducts?.length ? (
          <ul
            className={
              "absolute top-[110%] w-full border-1 border-slate-400 bg-white z-30 p-10 space-y-2 max-h-[70vh] overflow-y-scroll"
            }
          >
            {filteredProducts.map((product) => {
              return (
                <li
                  onClick={() => {
                    if (product.sellingStatus !== "Unsold") {
                      toast.error(
                        product.sellingStatus +
                          " product can't be added to cart ",

                        {
                          autoClose: 2000,
                        }
                      );
                    } else {
                      if (cart.includes(product)) {
                        toast.error("This Product Is Already In Cart", {
                          autoClose: 2000,
                        });
                      } else {
                        setCart((prev) => [...prev, product]);
                        setFilteredProducts([]);
                      }
                    }
                  }}
                  className={`flex flex-col gap-y-1 bg-primary-color text-white p-2 rounded cursor-pointer`}
                  key={product.itemCode}
                >
                  <p className={"flex justify-between"}>
                    <span>{product.productGroup}</span>
                    <span>{product.itemCode}</span>
                  </p>
                  <p className={"flex justify-between"}>
                    <span>Price: {product.sellPrice}</span>
                    <span
                      className={`${
                        product.sellingStatus === "Sold"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {product.sellingStatus}
                    </span>
                  </p>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    );
  }
);
export default SearchProduct;
