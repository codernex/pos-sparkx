import { Spin } from "antd";
import millify from "millify";
import React from "react";

const Stats: React.FC<{
  title: string;
  value: number;
  icon?: React.ReactNode;
  isLoading?: boolean;
}> = ({ title, value, icon, isLoading }) => {
  return (
    <div
      className={`dark:bg-slate-700 dark:text-white h-[100px] xl:min-w-[300px] 2xl:min-w-[360px] max-w-fit bg-white shadow-2xl px-5 py-2 rounded-bl-2xl rounded-tr-2xl rounded-md flex items-center justify-start gap-x-4 text-primaryColor-900 `}
    >
      <p className="text-4xl">{icon}</p>
      <div>
        <h1 className="text-2xl font-bold font-inter">{title}</h1>
        {!isLoading ? (
          <div className="flex gap-x-4">
            <p className={` font-semibold text-xl`}>{millify(value)}</p>
          </div>
        ) : (
          <div className={"text-white"}>
            <Spin size={"large"} spinning={true} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;
