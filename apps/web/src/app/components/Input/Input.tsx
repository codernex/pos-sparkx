import { useField } from "formik";
import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: React.ReactNode;
};

const Input: React.FC<InputProps> = ({
  label,
  size: _,
  className,
  ...props
}) => {
  const [field, { error }] = useField(props);
  return (
    <div>
      <div className="flex space-y-2 items-center bg-white text-fuchsia-900 px-5 justify-between relative">
        <label htmlFor={field.name}>{label}</label>
        <input
          {...props}
          id={field.name}
          {...field}
          className="app__input focus:outline-none text-black rounded-sm"
        />
      </div>
      <p>{error}</p>
    </div>
  );
};

export default Input;
