import React, { SetStateAction, useEffect, useState } from "react";
import { Button, DatePicker, Select } from "antd";
import { useTypedSelector } from "../../redux/store";
import { useSettingContext } from "../context/SettingProver";

const { RangePicker } = DatePicker;

interface DateProps {
  onChange: React.Dispatch<SetStateAction<string[]>>;
  setShowroom?: React.Dispatch<SetStateAction<string>>;
  setFilteredCustomer?: React.Dispatch<SetStateAction<ICustomer[]>>;
}

const DateFilter: React.FC<DateProps> = ({
  onChange,
  setShowroom,
  setFilteredCustomer,
}) => {
  const [dateRange, setDateRange] = useState<string[]>([]);
  const { showroom } = useTypedSelector((state) => state.showroom);
  const { customers } = useTypedSelector((state) => state.customer);

  useEffect(() => {
    onChange(dateRange);
  }, [dateRange, onChange]);
  const { currentUser } = useSettingContext();

  return (
    <div className="flex justify-end gap-x-4 my-3">
      <div></div>
      {setShowroom && currentUser?.role === "SuperAdmin" && (
        <Select
          placeholder="Select Showroom"
          options={showroom.map((ite) => ({
            value: ite.showroomCode,
            label: ite.showroomName,
          }))}
          onChange={(value) => setShowroom(value)}
          className="w-40"
        />
      )}
      <RangePicker
        onChange={(_, values) => {
          setDateRange(values);
        }}
      />

      {setFilteredCustomer && (
        <Button
          onClick={() => {
            setFilteredCustomer(customers);
          }}
        >
          Reset
        </Button>
      )}
    </div>
  );
};

export default DateFilter;
