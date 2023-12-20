import moment from "moment";
import { useEffect, useState } from "react";

const dateFilter = <T extends Product>(
  arr: T[],
  startDate: moment.Moment,
  endDate: moment.Moment
) => {
  return arr.filter((item) => {
    const itemDate = moment(item?.updatedAt);
    return (
      itemDate.isValid() && itemDate.isBetween(startDate, endDate, "day", "[]")
    );
  });
};

export const useFilteredSoldProduct = (
  data: Product[] = [],
  start?: string,
  end?: string
) => {
  const [filteredData, setFilteredData] = useState<Product[]>([]);

  useEffect(() => {
    if (!start || !end) {
      setFilteredData(data);
      return;
    }

    const startDate = moment(start);
    const endDate = moment(end);

    if (startDate.isValid() && endDate.isValid()) {
      const newFilteredData = dateFilter(data, startDate, endDate);
      if (JSON.stringify(newFilteredData) !== JSON.stringify(filteredData)) {
        setFilteredData(newFilteredData);
      }
    } else {
      setFilteredData([]);
    }
  }, [start, end, data, filteredData]);

  return filteredData;
};
