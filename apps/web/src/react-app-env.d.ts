interface IShowroom {
  id: number;
  showroomName: string;
  showroomCode: string;
  showroomAddress: string;
}

interface HoldInvoice {
  discounts: number[];
  subtotal: number;
  paidAmount: number;
  items: Product[];
  customerPhone: string;
  discountTk: number[];
  crmPhone: string;
  vat: number;
  payable: number[];
  employees: string[];
  paymentMethod: string;
  cash: number;
  bkash: number;
  cbl: number;
  createdAt: string;
  id: number;
  invoiceNo: string;
}
interface ILocalHoldInvoice {
  invoices: HoldInvoice[];
}

type ThemMode = "dark" | "light";

interface ISettingContext {
  isActive: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  profile: boolean;
  setProfile: React.Dispatch<React.SetStateAction<boolean>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  submitForm: boolean;
  setSubmitForm: React.Dispatch<React.SetStateAction<boolean>>;

  showConfirmModal: boolean;
  setShowConfirmModal: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser: IUser | null;
  defaultBarcodeSettings: BarcodeSetting | undefined;

  mode: ThemMode;
  setMode: React.Dispatch<React.SetStateAction<ThemMode>>;
}

interface Supplier {
  id: number;
  supplierName: string;
  supplierAddress: string;
  contactPersonName: string;
  contactPersonNumber: string;
  supplierEmail: string;
  altContactNumber: string;
  extraInfo: string;
}

type IUserRole =
  | "MasterAdmin"
  | "SuperAdmin"
  | "ShowroomManager"
  | "SalesOperator";

interface IUser {
  id: number;
  name: string;
  email: string;
  username: string;
  role: string;
  password?: string;
  assignedShowroom: string;
}

interface Product {
  id: number;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceTotalPrice: number;
  lotNumber: string;
  supplierName: string;
  productGroup: string;
  totalItem: number;
  unitCost: number;
  transportationCost: number;
  sellPrice: number;
  showroomName: string;
  whName: string;
  itemCode: string;
  productCode: string;
  sellingStatus: string;
  sellPriceAfterDiscount: number;
  grossProfit: string;
  grossMargin: string;
  quantity: number;
  size: string;

  discount?: number;

  returnStatus: number;
  createdAt: string;
  updatedAt: string;
  employee: IEmployee;
  tagless: boolean;
}

interface DeleteProductRes {
  id: number;
  message: string;
  success: boolean;
}

interface BarcodeSetting {
  id: number;
  name: string;
  description: string;
  stickerWidth: number;
  stickerHeight: number;
  stickerInRow: number;
  columnGap: number;
  rowGap: number;
  paperWidth: number;
  paperHeight: number;
}

interface IDefaultBarcode {
  id: number;
  barcodeId: number;
}

interface IPrintBarcodeState {
  products: Product[];
  barcode: BarcodeSetting[];
  defaultBarcode: IDefaultBarcode | undefined;
  isLoading: boolean;
}

interface MultipleProductInput {
  invoiceNumber: string;
  invoiceDate: string;
  invoiceTotalPrice: number;
  lotNumber: number;
  supplierName: string;
  showroomName: string;
  unitCost: number;

  items: { itemCode: string; sellPrice: number }[];
  productGroup: string;
}

interface ProductInfoMultiple {
  sellPrice: number;
  itemCode: string;
}

interface Payment {
  id: number;
  paymentMethod: string;
  amount: number;
}

interface Invoice {
  id: number;
  invoiceNo: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceAmount: number;

  invoiceStatus: string;
  paymentMethod: Payment;

  vat: number;

  businessName: string;

  businessAddress: string;

  customerName: string;

  customerMobile: string;

  employeeName: string;
  products: Product[];

  createdAt: string;

  updatedAt: string;

  paidAmount: number;

  discountAmount: number;
  netAmount: number;
  subtotal: number;

  changeAmount: number;

  showroomInvoiceCode: string;
  showroomAddress: string;
  showroomMobile: string;
  showroomName: string;
  returned: IReturned;

  deletedAt: string;
}

interface IShowroom {
  showroomName: string;
  showroomCode: string;

  showroomMobile: string;
  showroomAddress: string;
  id: number;
}

interface ICustomer {
  id?: number;

  customerName: string;

  customerPhone: string;

  customerEmail?: string;

  customerAddress?: string;

  crm: string;

  credit?: number;

  paid: number;
  purchasedProducts: Product[];

  returnedProducts: Product[];

  showroom: IShowroom;
  createdAt: string;

  updatedAt: string;
}

interface IEmployee {
  id: number;

  empName: string;

  empPhone: string;

  designation: string;

  empEmail: string;

  empAddress: string;

  sales: Product[];
  returnSales: Product[];

  showroom: IShowroom;

  empSalary: number;

  joiningDate: string;

  salary: ISalary[];

  createdAt: Date;

  updatedAt: Date;
}

interface IBusiness {
  id: number;
  address: string;

  name: string;

  phone: string;

  currencyCode: string;

  defaultTax: number;
}

interface ITax {
  id: number;

  tax: number;

  taxName: string;
}

interface ITransfer {
  id: number;
  prevLocation: string;
  currentLocation: string;
  productCount: number;
  transferredLot: string;
  transferredProducts: Product[];
  createdAt: string;
  updatedAt: string;
}

interface IExpense {
  id: number;
  expenseName: string;
  employeeId: number;
  expenseReason: string;
  expenseCost: number;
  showroom: IShowroom;
  createdAt: string;
  updatedAt: string;
}

interface IExpenseType {
  id: number;
  expenseName: string;
}

interface ISalary {
  id: number;
  salaryAmount: number;
  createdAt: string;
}

interface IBrand {
  id: number;
  brandName: string;
  createdAt: string;
}

interface Purchase {
  id: number;
  invoiceNo: string;
  supplierName: string;
  purchaseAmount: number;
  purchaseStatus: string;
  products: Product[];
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

interface IReturned {
  id: number;
  amount: number;
  check: string;
  returnProducts: Product[];
  exchange: boolean;
  customerPhone: string;
  createdAt: string;
  updatedAt: string;
  cash: number;
  bkash: number;
  cbl: 0;
}
