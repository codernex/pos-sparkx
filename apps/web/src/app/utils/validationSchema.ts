import * as yup from "yup";

export const transferValidationSchema = yup.object().shape({
  lotNumber: yup.string().required("Please Select A Lot Number"),
  whName: yup.string().required("Please Select Your Current Location"),
  showroomName: yup.string().required("Please Select You Destination Showroom"),
  itemCodes: yup.array().required("Please Add Some Product To Transfer"),
});

export const returnValiationSchema = yup.object().shape({
  returnProduct: yup.array().required("Please Search Your Product To Return"),
  exchange: yup.string().required("Please Select AN Exchnage Type To Return"),
  check: yup.string().required("Please Enter Check %"),
});
