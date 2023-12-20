import { NextFunction, Request, Response } from "express";
import moment from "moment";
import xlsx from "xlsx";
import Product from "../entities/product";
import ProductGroup from "../entities/productGroup";
import Purchase from "../entities/purchase";
import Showroom from "../entities/showroom";
import TransferProduct from "../entities/transfer";
import { ControllerFn, ProductStatus } from "../types";
import ErrorHandler from "../utils/errorHandler";
import dataSource from "../typeorm.config";
import { filter } from "underscore";
import appDataSource from "../typeorm.config";

export const createProductGroup: ControllerFn = async (req, res, next) => {
  try {
    const { productCategory, productCode, productName } =
      req.body as ProductGroup;

    if (!productCategory || !productCode || !productName) {
      return next(new ErrorHandler("Please Enter Required Information", 404));
    }

    const productGroup = new ProductGroup();

    productGroup.productCategory = productCategory;
    productGroup.productCode = productCode;
    productGroup.productName = productName;

    await productGroup.save();

    return res.status(201).json(productGroup);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
};

export const createSingleProduct: ControllerFn = async (req, res, next) => {
  const queryRunner = appDataSource.createQueryRunner();
  const manager = queryRunner.manager;

  try {
    const {
      itemCode,
      productGroup,
      invoiceNumber,
      unitCost,
      sellPrice,
      totalItem,
      invoiceTotalPrice,
      supplierName,
      invoiceDate,
    } = req.body as Product;

    const requiredFields = [
      itemCode,
      productGroup,
      invoiceNumber,
      unitCost,
      sellPrice,
      totalItem,
      supplierName,
    ];

    if (requiredFields.some((field) => !field)) {
      return next(new ErrorHandler("Please Enter Required Information", 400));
    }

    const productCode = await manager.findOne(ProductGroup, {
      where: {
        productName: productGroup,
      },
    });

    const showroom = (await manager.findOne(Showroom, {
      where: req.showroomId ? { id: req.showroomId } : { showroomCode: "HO" },
      relations: {
        purchases: true,
      },
    })) as Showroom;

    await queryRunner.startTransaction();

    // Create Purchase
    const purchase = new Purchase();
    purchase.quantity = totalItem;
    purchase.invoiceNo = invoiceNumber;
    purchase.supplierName = supplierName;
    purchase.purchaseAmount = invoiceTotalPrice;

    showroom.purchases.push(purchase);
    await Promise.all([manager.save(purchase), manager.save(showroom)]);

    const productArr: Product[] = [];

    for (let i = 0; i < totalItem; i++) {
      const itemMCode = parseInt(itemCode) + i;
      const grossProfit = (sellPrice - unitCost).toFixed(2);
      const grossMargin = (((sellPrice - unitCost) / sellPrice) * 100).toFixed(
        2
      );

      const product = {
        ...req.body,
        itemCode: itemMCode.toString().padStart(10, "0"),
        productCode: String(productCode?.productCode),
        grossProfit,
        grossMargin,
        unitTotalCost: Number(unitCost),
        sellingStatus: ProductStatus.Unsold,
        invoiceDate: new Date(invoiceDate),
      };

      productArr.push(product);
    }

    await Promise.all(
      productArr.map(async (product) => await manager.save(Product, product))
    );

    // Commit Transaction
    await queryRunner.commitTransaction();

    return res.json(productArr);
  } catch (e) {
    await queryRunner.rollbackTransaction();
    res.status(500).json({ message: e.message });
  } finally {
    await queryRunner.release();
  }
};

export const getProducts: ControllerFn = async (req, res, next) => {
  const { showroomId } = req;
  const productRepository = dataSource.getRepository(Product);
  type ProductResponse = {
    product: Product[];
    hasMore: boolean;
  };

  const response: ProductResponse = {
    product: [],
    hasMore: false,
  };

  if (showroomId) {
    const showroomRepository = dataSource.getRepository(Showroom);
    const showroom = await showroomRepository
      .createQueryBuilder("showroom")
      .where("showroom.id=:id", { id: showroomId })
      .getOne();

    if (!showroom) {
      return next(new ErrorHandler("Unexpected Result", 404));
    }

    response.product = await productRepository
      .createQueryBuilder("p")
      .where("p.showroomName=:showroomName", {
        showroomName: showroom.showroomName,
      })
      .orderBy("p.itemCode", "ASC")
      .getMany();
  } else {
    response.product = await productRepository
      .createQueryBuilder("p")
      .orderBy("p.itemCode", "ASC")
      .getMany();
  }

  res.status(200).json(response);
};

export const getProductGroup: ControllerFn = async (_req, res, _next) => {
  res.status(200).json(await ProductGroup.find());
};

export const createMultipleProducts: ControllerFn = async (req, res, next) => {
  try {
    const products = req.body as Product[];

    if (products.length === 0) {
      return next(new ErrorHandler("Please Enter Required Information", 404));
    } else if (
      !products[0].invoiceDate ||
      !products[0].invoiceNumber ||
      !products[0].sellPrice ||
      !products[0].itemCode
    ) {
      return next(new ErrorHandler("Please Enter Required Information", 404));
    }

    const showroom =
      (await dataSource
        .getRepository(Showroom)
        .createQueryBuilder("showroom")
        .leftJoinAndSelect("showroom.purchases", "purchase")
        .where("showroom.id=:id", { id: req.showroomId })
        .getOne()) ||
      (await dataSource
        .getRepository(Showroom)
        .createQueryBuilder("showroom")
        .leftJoinAndSelect("showroom.purchases", "purchase")
        .where('showroom.showroomCode="HO"')
        .getOne());
    if (!showroom) {
      return next(new ErrorHandler("Unexpected Result", 404));
    }

    const invoiceDate = moment(req.body.invoiceDate).toDate();

    const productArr: Product[] = [];
    const purchase = new Purchase();

    await Promise.all(
      products.map(async (product: Product) => {
        const grossProfit = product.sellPrice - product.unitCost;
        const grossMargin = ((grossProfit / product.sellPrice) * 100).toFixed(
          2
        );
        const productCode = await ProductGroup.findOne({
          where: { productName: product.productGroup },
        });

        const productToSave = Product.create({
          ...product,
          invoiceDate,
          grossProfit: grossProfit.toFixed(2),
          grossMargin,
          totalItem: products.length,
          unitCost: Number(product.unitCost),
          sellingStatus: ProductStatus.Unsold,
          productCode: productCode?.productCode,
        });

        purchase.addPurchase(productToSave);

        purchase.invoiceNo = productToSave.invoiceNumber;
        purchase.supplierName = productToSave.supplierName;
        purchase.purchaseAmount = productToSave.invoiceTotalPrice;

        await productToSave.save();
        productArr.push(productToSave);
      })
    );
    purchase.quantity = products.length;

    showroom.purchases.push(purchase);

    await Promise.all([purchase.save(), showroom.save()]);

    return res.json(productArr);
  } catch (e) {
    res.status(400).json(e.message);
  }
};

export const importProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const file = req.file;

    if (!file) {
      return next(new ErrorHandler("No File Found", 400));
    }
    const workbook = xlsx.read(file?.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const data: Product[] = xlsx.utils.sheet_to_json(sheet);

    if (data.length === 0) {
      return next(new ErrorHandler("No Data Found", 400));
    }

    const requiredFields: { key: keyof Product; label: string }[] = [
      { key: "itemCode", label: "Item Code" },
      { key: "showroomName", label: "Showroom Name" },
      { key: "unitCost", label: "Unit Cost" },
      { key: "productGroup", label: "Product Group" },
      { key: "sellPrice", label: "Sell Price" },
      { key: "sellingStatus", label: "Product Status" },
      { key: "productCode", label: "Product Code" },
    ];

    for (const product of data) {
      const missingFields = requiredFields.filter(
        (field) => !product[field.key]
      );

      if (missingFields.length > 0) {
        const missingFieldsLabels = missingFields
          .map((field) => field.label)
          .join(", ");
        return next(
          new ErrorHandler(
            `Product is missing value(s) for ${missingFieldsLabels}`,
            404
          )
        );
      }
    }

    const productsToInsert = data.map((product) => ({
      itemCode: product.itemCode.padStart(10, "0"),
      showroomName: product.showroomName,
      productCode: product?.productCode,
      supplierName: product?.supplierName,
      lotNumber: product?.lotNumber,
      size: product?.size,
      unitCost: product.unitCost,
      invoiceDate: new Date(product?.invoiceDate),
      productGroup: product.productGroup,
      grossProfit: (product.sellPrice - product.unitCost).toFixed(2),
      grossMargin: (
        ((product.sellPrice - product.unitCost) / product.sellPrice) *
        100
      ).toFixed(2),
      unitTotalCost: product.unitCost,
      deliveryDate: new Date(product?.deliveryDate),
      sellPrice: product.sellPrice,
      sellPriceAfterDiscount:
        product.sellPriceAfterDiscount || product.sellPrice,
      updatedAt: new Date(product?.updatedAt),
      challanNumber: product?.challanNumber,
      invoiceNumber: product?.invoiceNumber,
      invoiceTotalPrice: product?.invoiceTotalPrice,
      totalItem: product?.totalItem,
      transportationCost: product?.transportationCost,
      purchaseName: product?.purchaseName,
      sellingStatus: product?.sellingStatus,
    }));

    // Use a single transaction to insert all products
    await dataSource.transaction(async (manager) => {
      await manager
        .createQueryBuilder()
        .insert()
        .into(Product)
        .values(productsToInsert)
        .execute();
    });

    res.status(200).json({ message: "Data imported successfully", data: data });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const transferProduct: ControllerFn = async (req, res, next) => {
  const { plannedShowroom, currentShowroom, itemCodes } = req.body as {
    currentShowroom: string;
    plannedShowroom: string;
    itemCodes: { itemCode: string }[];
  };

  if (!currentShowroom || !plannedShowroom || !itemCodes.length) {
    return next(new ErrorHandler("Please Provide All Information", 404));
  }
  try {
    const productArr = await Product.createQueryBuilder("product")
      .where("product.itemCode IN (:...productCodes)", {
        productCodes: itemCodes.map((item) => item.itemCode),
      })
      .leftJoinAndSelect("product.employee", "employee")
      .leftJoinAndSelect("employee.sales", "sales")
      .getMany();

    for (const product of productArr) {
      product.showroomName = plannedShowroom;
      await product.save();
    }
    const transferData = new TransferProduct();
    transferData.prevLocation = currentShowroom;
    transferData.currentLocation = plannedShowroom;
    transferData.productCount = itemCodes.length;
    transferData.transferredProducts = productArr;

    //Removed Transfer Lot

    await transferData.save();
    res.status(200).json("Product Transferred Successfully");
  } catch (e) {
    console.log(e);
    res.status(400).json({ success: false, message: e.message });
  }
};

export const getTransferHistory: ControllerFn = async (_req, res) => {
  res.status(200).json(await TransferProduct.find());
};

export const importProductGroup: ControllerFn = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      return next(new ErrorHandler("No File Found", 400));
    }
    const workbook = xlsx.read(file?.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const data: ProductGroup[] = xlsx.utils.sheet_to_json(sheet);

    if (data.length === 0) {
      return next(new ErrorHandler("No Data Found", 400));
    }

    if (
      !data[0].productCode ||
      !data[0].productName ||
      !data[0].productCategory
    ) {
      return next(
        new ErrorHandler("Product Name, Code & Category Required", 400)
      );
    }

    data.every(async (item) => {
      const productGroup = new ProductGroup();

      productGroup.productName = item.productName;
      productGroup.productCategory = item.productCategory;
      productGroup.productCode = item.productCode;

      await productGroup.save();
    });
    res.status(200).json({ message: "Data Imported Successfully" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const updateProduct: ControllerFn = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ where: { id } });

    if (!product) {
      return next(new ErrorHandler("Product Not Found", 404));
    }

    if (product.sellingStatus === ProductStatus.Sold) {
      return next(
        new ErrorHandler(
          "Sold Products Cannot Update || You May Try To Return",
          404
        )
      );
    }

    Object.assign(product, {
      ...req.body,
      grossProfit: String(product.sellPrice - +product.unitCost),
      grossMargin: String(
        ((product.sellPrice - product.unitCost) / product.sellPrice) * 100
      ),
    });

    await product.save();

    res.status(200).json(product);
  } catch (e) {
    console.log(e);
    res.status(400).json({ success: false, message: e.message });
  }
};

export const addTaglessProduct: ControllerFn = async (req, res, next) => {
  try {
    let showroom: Showroom | null;
    if (req.showroomId) {
      showroom = await dataSource
        .getRepository(Showroom)
        .createQueryBuilder("sr")
        .where("sr.id=:showroomId", { showroomId: req.showroomId })
        .getOne();
    } else {
      showroom = await dataSource
        .getRepository(Showroom)
        .createQueryBuilder("sr")
        .where('sr.showroomCode="HO"')
        .getOne();
    }

    if (!showroom) {
      return next(new ErrorHandler("Something Went Wrong", 404));
    }

    const { productGroup, sellPrice } = req.body as Product;
    if (!productGroup) {
      return next(new ErrorHandler("Product Group Required", 400));
    }
    if (!sellPrice) {
      return next(new ErrorHandler("Sell Price Required", 400));
    }

    const productGroupCode = await dataSource
      .getRepository(ProductGroup)
      .createQueryBuilder("p")
      .where("p.productName = :productGroup", { productGroup })
      .getOne();

    if (!productGroupCode) {
      return next(new ErrorHandler("Product Group Not Found", 400));
    }
    const products = await dataSource.getRepository(Product).find();

    const product = new Product();

    const taglessProducts = filter(
      products,
      (pr) => pr.tagless && pr.showroomName === showroom?.showroomName
    );

    product.itemCode =
      showroom.showroomCode +
      (taglessProducts.length + 1).toString().padStart(8, "0");
    product.showroomName = showroom.showroomName;
    product.sellPrice = sellPrice;
    product.productGroup = productGroup;
    product.productCode = productGroupCode.productCode;
    product.unitCost = sellPrice;
    product.size = req.body?.size;
    product.tagless = true;

    await product.save();

    res.status(200).json(product);
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const updateBulkProduct: ControllerFn = async (req, res, next) => {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.startTransaction();

  const manager = queryRunner.manager;
  try {
    const file = req.file;

    if (!file) {
      return next(new ErrorHandler("No File Found", 400));
    }
    const workbook = xlsx.read(file?.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const data: Product[] = xlsx.utils.sheet_to_json(sheet);

    if (data.length === 0) {
      return next(new ErrorHandler("No Data Found", 400));
    }

    const requiredFields: { key: keyof Product; label: string }[] = [
      { key: "itemCode", label: "Item Code" },
    ];

    for (const product of data) {
      const missingFields = requiredFields.filter(
        (field) => !product[field.key]
      );

      if (missingFields.length > 0) {
        const missingFieldsLabels = missingFields
          .map((field) => field.label)
          .join(", ");
        return next(
          new ErrorHandler(
            `Product is missing value(s) for ${missingFieldsLabels}`,
            404
          )
        );
      }
    }
    // Use the transaction manager to update all products
    for (const product of data) {
      await manager
        .createQueryBuilder()
        .update(Product)
        .set({
          showroomName: product?.showroomName,
          productCode: product?.productCode,
          supplierName: product?.supplierName,
          lotNumber: product?.lotNumber,
          size: product?.size,
          unitCost: product?.unitCost,
          invoiceDate: new Date(product?.invoiceDate),
          productGroup: product?.productGroup,
          grossProfit: (product?.sellPrice - product?.unitCost).toFixed(2),
          grossMargin: (
            ((product?.sellPrice - product?.unitCost) / product?.sellPrice) *
            100
          ).toFixed(2),
          unitTotalCost: product?.unitCost,
          deliveryDate: new Date(product?.deliveryDate),
          sellPrice: product?.sellPrice,
          updatedAt: new Date(product?.updatedAt),
          challanNumber: product?.challanNumber,
          invoiceNumber: product?.invoiceNumber,
          invoiceTotalPrice: product?.invoiceTotalPrice,
          totalItem: product?.totalItem,
          transportationCost: product?.transportationCost,
          purchaseName: product?.purchaseName,
          sellingStatus: product?.sellingStatus,
        })
        .where("itemCode = :itemCode", { itemCode: product.itemCode })
        .execute();
    }

    // Commit the transaction if everything succeeds
    await queryRunner.commitTransaction();

    res.status(200).json({ message: "Data updated successfully", data: data });
  } catch (error) {
    // Rollback the transaction if there's an error
    await queryRunner.rollbackTransaction();

    console.log(
      "🚀 ~ file: productController.ts:559 ~ const updateBulkProduct: ControllerFn = async ~ error:",
      error
    );
    res.status(500).json({ success: false, message: error.message });
  } finally {
    // Release the query runner
    await queryRunner.release();
  }
};

export const getProductByShowroom: ControllerFn = async (req, res, next) => {
  try {
    const { showroomCode } = req.query;

    const showroom = await appDataSource
      .getRepository(Showroom)
      .createQueryBuilder("sr")
      .where("sr.showroomCode=:showroomCode", { showroomCode })
      .getOne();

    if (!showroom) {
      return next(new ErrorHandler("Showroom Not Found", 404));
    }

    const products = await appDataSource
      .getRepository(Product)
      .createQueryBuilder("p")
      .where("p.showroomName=:showroomName", {
        showroomName: showroom.showroomName,
      })
      .andWhere('p.sellingStatus="Unsold"')
      .getMany();

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
