import { AxiosError } from "axios";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { useIsAuthenticated, useSignIn } from "react-auth-kit";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Navigate, useLocation, useNavigate } from "react-router";
import api from "../../../api";
import { ApiError } from "../../../redux/types";
import { rejectedToast } from "../../utils/toaster";
import { useAppDispatch } from "../../../redux/store";
import { fetchProduct } from "../../../redux/actions/product";
import { getSupplier } from "../../../redux/actions/supplier";
import { getShowroom } from "../../../redux/actions/showroom";
import { fetchEmployee } from "../../../redux/actions/employee";
import { fetchCustomer } from "../../../redux/actions/customer";
import { getInvoice } from "../../../redux/actions/invoice";
import {
  fetchBarcode,
  getDefaultBarcode,
} from "../../../redux/actions/barcode";
import "./login.css";
import { Spin } from "antd";

const Login = () => {
  const isAuth = useIsAuthenticated();
  const { pathname } = useLocation();
  const signIn = useSignIn();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  if (isAuth()) {
    return (
      <Navigate
        to={"/dashboard"}
        replace
        state={{
          from: pathname,
        }}
      />
    );
  }

  return (
    <div className="login__container">
      <div className="container" id="container">
        <div className="form-container log-in-container">
          <Formik
            initialValues={{ usernameOrEmail: "", password: "" }}
            onSubmit={async (value) => {
              setIsLoading(true);
              api
                .post("/auth/login", value)
                .then((res) => {
                  signIn({
                    token: res.data!.token,
                    authState: res.data!.user,
                    expiresIn: 12 * 60,
                    tokenType: "Bearer",
                  });
                  localStorage.setItem("token", res.data!.token);
                  dispatch(fetchProduct());
                  dispatch(getSupplier());
                  dispatch(getShowroom());
                  dispatch(fetchEmployee());
                  dispatch(fetchCustomer());
                  dispatch(getInvoice());
                  dispatch(getDefaultBarcode());
                  dispatch(fetchBarcode());
                  navigate("/dashboard", {
                    replace: true,
                  });
                })
                .catch((err: AxiosError<ApiError>) => {
                  rejectedToast(err);
                });

              setIsLoading(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form className={"relative"}>
                <h1 className="social-container">Login</h1>
                <Field
                  required={true}
                  name="usernameOrEmail"
                  type="text"
                  placeholder="Email"
                />
                <Field
                  required
                  name="password"
                  type={`${showPassword ? "text" : "password"}`}
                  placeholder="Password"
                />
                {showPassword ? (
                  <FaEyeSlash
                    onClick={() => setShowPassword(false)}
                    cursor={"pointer"}
                    className={"absolute top-[19.5rem] right-[55px] text-black"}
                  />
                ) : (
                  <FaEye
                    onClick={() => setShowPassword(true)}
                    cursor={"pointer"}
                    className={"absolute top-[19.5rem] right-[55px] text-black"}
                  />
                )}
                <button disabled={isLoading}>
                  {isLoading ? <Spin /> : "Log In"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-right">
              <h1>Welcome Back</h1>
              <p>SparkX LifeStyle Central Database Inventory Software.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
