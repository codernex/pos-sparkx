import moment from "moment";
import { useState, useEffect, SetStateAction } from "react";

export const useFilteredHook = <T extends ICustomer>(
  start: string,
  end: string,
  data: T[],
  showroom?: string
): T[] => {
  const [filteredData, setFilteredData] = useState<T[]>(data);

  useEffect(() => {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();

    let filtered: T[];

    if (showroom) {
      filtered = data.filter((item) => item.showroom.showroomCode === showroom);
    } else {
      filtered = data;
    }

    if (moment(startDate).isValid() && moment(endDate).isValid()) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.updatedAt).getTime();

        return itemDate >= startDate && itemDate <= endDate;
      });
    }
    setFilteredData(filtered);
  }, [start, end, data, showroom]);

  return filteredData;
};
