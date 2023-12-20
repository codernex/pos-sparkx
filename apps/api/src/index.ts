import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import config from "./config";
import errorMiddleware from "./middleware/err";
import { commonAuth, isAuth, isSuperAdmin } from "./middleware/isAuth";

import { showRoomAccess } from "./middleware/showroom";

import { getAudit } from "./controller/audit";
import compression from "compression";
import sms from "./routes/sms";
import dataSource from "./typeorm.config";
import {
  authRoutes,
  barcodeRoutes,
  businessRoutes,
  customerRoutes,
  employeeRoutes,
  invoiceRoutes,
  productRoutes,
  purchaseRoutes,
  reportsRoutes,
  seedRoutes,
  showroomRoutes,
  supplierRoutes,
  taxRoutes,
  userRoutes,
} from "./routes";
import { deleteExpiredHoldInvoices } from "./utils/auto";

const mount = async (app: Application) => {
  await dataSource.initialize();
  const whiteList = [
    "http://sparkxfashion.com",
    "https://sparkxfashion.com",
    "http://localhost:3000",
  ];
  app.use(compression());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (origin && whiteList.includes(origin)) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true, limit: "100mb" }));

  app.get("/", async (req: Request, res: Response) => {
    const serverInfo = {
      protocol: req.protocol,
      host: req.hostname,
    };

    const userInfo = {
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    };
    res.status(200).json({ serverInfo, userInfo });
  });

  app.use("/api/v1/user", userRoutes);
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/product", isAuth, commonAuth, showRoomAccess, productRoutes);
  app.use("/api/v1/purchase", isAuth, commonAuth, isSuperAdmin, purchaseRoutes);
  app.use("/api/v1/sms", isAuth, commonAuth, sms);

  // Schedule the function to run periodically, e.g., every 24 hours
  setInterval(deleteExpiredHoldInvoices, 24 * 60 * 60 * 1000);

  app.use(
    "/api/v1/supplier",
    isAuth,
    commonAuth,
    showRoomAccess,
    supplierRoutes
  );

  app.use(
    "/api/v1/showroom",
    isAuth,
    commonAuth,
    showRoomAccess,
    showroomRoutes
  );

  app.use("/api/v1/barcode", isAuth, commonAuth, barcodeRoutes);

  app.use("/api/v1/invoice", isAuth, commonAuth, showRoomAccess, invoiceRoutes);

  app.use(
    "/api/v1/customer",
    isAuth,
    commonAuth,
    showRoomAccess,
    customerRoutes
  );
  app.use(
    "/api/v1/employee",
    isAuth,
    commonAuth,
    showRoomAccess,
    employeeRoutes
  );

  app.use("/api/v1/tax", isAuth, commonAuth, taxRoutes);
  app.use("/api/v1/business", isAuth, commonAuth, businessRoutes);
  app.use("/api/v1/db", seedRoutes);
  app.use("/api/v1/reports", isAuth, commonAuth, showRoomAccess, reportsRoutes);
  app.get("/api/v1/audit", isAuth, commonAuth, getAudit);
  app.use(errorMiddleware);

  app.listen(config.PORT, () => {
    console.log(`Development Server Started on PORT: ${config.PORT}`);
  });
};

mount(express()).catch((e) => console.log(e));
