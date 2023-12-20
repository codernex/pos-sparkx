import printJS from "print-js";
import * as XLSX from "xlsx";
import moment from "moment";
import { rejectedToast, successToast } from "./toaster";
import api from "../../api";

export const uniqueItem = <T>(arr: T[], fn: (x: T) => string): string[] => {
  const set = new Set<string>();
  arr.forEach((x) => set.add(fn(x)));
  return Array.from(set).sort();
};

export const handlePrint = (
  data: any,
  props: any,
  title: string = "Document"
) =>
  printJS({
    printable: data,
    type: "json",
    properties: props,
    header: title,
    headerStyle: "padding:0;text-align:center;margin:0;font-size:28px",
    targetStyle: ["border", "padding"],
    gridStyle:
      "padding:5px 0;border:1px solid lightgray;text-align:center;font-family:Montserrat;font-size:16px",
  });

export const handleExcel = (
  data: any[],
  title: string = "Document",
  file: string = "Excel Data"
) => {
  const formattedData = data.map((item) => {
    const keyWithPrice: string[] = [];

    for (const key in item) {
      if (
        key.toLocaleLowerCase().includes("price") ||
        key.toLocaleLowerCase().includes("cost") ||
        key.toLocaleLowerCase().includes("amount")
      ) {
        keyWithPrice.push(key);
      }
    }

    const newItem = { ...item };

    if (Object.hasOwn(newItem, "showroom")) {
      newItem["showroom"] = newItem["showroom"].showroomName;
    }

    if (Object.hasOwn(newItem, "sales")) {
      newItem["sales"] = newItem["sales"].length;
    }

    if (Object.hasOwn(newItem, "returnSales")) {
      newItem["returnSales"] = newItem["returnSales"].length;
    }
    if (Object.hasOwn(newItem, "purchasedProducts")) {
      newItem["purchasedProducts"] = newItem["purchasedProducts"].length;
    }
    if (Object.hasOwn(newItem, "returnedProducts")) {
      newItem["returnedProducts"] = newItem["returnedProducts"].length;
    }

    const regex = /, \n/g;

    keyWithPrice.forEach((key) => {
      const resultArray = newItem[key].split(regex);

      newItem[key] =
        resultArray instanceof Array
          ? resultArray.map((item) => formatPrice(item)).join(", \n")
          : newItem[key]
          ? formatPrice(newItem[key])
          : "";
    });

    return newItem;
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(formattedData);
  const fileName =
    file +
    "_" +
    new Date().toLocaleTimeString("en-US", {
      timeZone: "Asia/Dhaka",
      day: "numeric",
      hour12: true,
      year: "numeric",
      month: "numeric",
    }) +
    ".xlsx";
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, fileName);
};

export const handleExcelHtml = (tableId: string, title: string) => {
  const table = document.getElementById(tableId) as HTMLElement;
  const workbook = XLSX.utils.table_to_book(table);
  const ws = workbook.Sheets["Sheet1"];
  XLSX.utils.sheet_add_aoa(
    ws,
    [["Created " + new Date().toLocaleDateString()], [title]],
    {
      origin: -1,
    }
  );
  const fileName =
    title.toUpperCase() + new Date(Date.now()).toString() + ".xlsx";

  XLSX.writeFile(workbook, fileName);
};

export const getDayOfMonth = function (
  year: number,
  month: number
): { date: string; day: string }[] {
  const monthIndex = month - 1; // 0..11 instead of 1..12
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const date = new Date(year, monthIndex, 1);
  const result = [];
  while (date.getMonth() === monthIndex) {
    result.push({
      date:
        date.getDate().toString().padStart(2, "0") +
        "-" +
        (date.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        date.getFullYear(),
      day: days[moment(date).isoWeekday() - 1],
    });
    date.setDate(date.getDate() + 1);
  }
  return result;
};

export function generateRandomNumber(length: number): string {
  let num = "";
  for (let i = 0; i < length; i++) {
    num += Math.floor(Math.random() * 10).toString();
  }
  return num;
}

export const sendSmsBulk = async (
  message: string,
  numbers: string[]
): Promise<void> => {
  api
    .post("/sms", { message, numbers: numbers.join(",") })
    .then((response) => {
      successToast("SMS sent successfully");
    })
    .catch((err) => {
      rejectedToast(err);
    });
};
export const sendSmsSingle = async (
  message: string,
  numbers: string
): Promise<void> => {
  api
    .post("/sms", { message, numbers })
    .then((response) => {
      console.log(response);
      successToast("SMS sent successfully");
    })
    .catch((err) => {
      rejectedToast(err);
    });
};

export const getTotalQuantityByProductName = (products: Product[]) => {
  const soldProducts = products.filter(
    (product) =>
      product.sellingStatus === "Sold" &&
      moment(product.updatedAt).format("YYYY-MM") === moment().format("YYYY-MM")
  );
  // Group sold products by productGroup and sum the quantities
  const soldProductsByGroup = soldProducts.reduce(
    (accumulator: Record<any, any>, product) => {
      if (accumulator[product.productGroup]) {
        accumulator[product.productGroup] += product.quantity;
      } else {
        accumulator[product.productGroup] = product.quantity;
      }
      return accumulator;
    },
    {}
  );

  // Find the best selling product by quantity
  let bestSellingProduct = null;
  let maxQuantity = 0;

  for (const productGroup in soldProductsByGroup) {
    if (soldProductsByGroup[productGroup] > maxQuantity) {
      maxQuantity = soldProductsByGroup[productGroup];
      bestSellingProduct = soldProducts.find(
        (product) => product.productGroup === productGroup
      );
    }
  }

  return bestSellingProduct;
};

interface GroupedProduct {
  productGroup: string;
  quantity: number;
  sellPrice: number;
}

export const groupedProducts = (products: any): Product[] =>
  products.reduce((groups: GroupedProduct[], product: Product) => {
    // Check if there's already a group for this product's productGroup
    const groupIndex = groups.findIndex(
      (g) => g.productGroup === product.productGroup
    );
    const { productGroup, quantity, ...newProduct } = product;

    if (groupIndex !== -1) {
      // If the group already exists, increment the quantity
      groups[groupIndex].quantity++;
    } else {
      // If the group doesn't exist, create a new one with quantity 1
      groups.push({
        productGroup: productGroup,
        quantity: 1,
        ...newProduct,
      });
    }

    return groups;
  }, []);

interface DateObj {
  createdAt: string;
  // ... other properties
}

export const dateFilter = <T extends DateObj>(
  arr: T[],
  startDate: string,
  endDate?: string
): T[] => {
  return arr.filter((item) => {
    const momentStart = moment(startDate).format("YYYY-MM-DD");
    const momentEnd = moment(endDate).format("YYYY-MM-DD");
    const formattedDate = moment(item.createdAt).format("YYYY-MM-DD");

    if (formattedDate >= momentStart && formattedDate <= momentEnd) {
      return item;
    } else {
      return undefined;
    }
  });
};

export function formatPrice(num: string | number): string {
  const price = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(price)) return "";

  return price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function getCustomerData(customer: ICustomer[]): Promise<string[]> {
  return new Promise(async (resolve) => {
    const data = customer.map((c) => {
      return c.customerPhone;
    });

    return resolve(data);
  });
}

export default function utils() {}
