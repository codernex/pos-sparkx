import { Field } from "formik";
import React from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  name: string;
  label: string;
  children: React.ReactNode;
};
const SelectInput: React.FC<SelectProps> = ({
  children,
  name,
  label,
  ...props
}) => {
  return (
    <div className="flex flex-col w-full gap-y-2 cursor-pointer">
      <label className={"dark:text-white"} htmlFor={name}>
        {label}
      </label>
      <Field
        className="h-[37px] rounded border border-b-2 border-b-slate-300 outline-none bg-transparent pl-3 cursor-pointer dark:bg-slate-700 dark:text-white "
        as="select"
        name={name}
        {...props}
      >
        <option>Select {label.split(" ")[label.split(" ").length - 1]}</option>
        {children}
      </Field>
    </div>
  );
};

export default SelectInput;
