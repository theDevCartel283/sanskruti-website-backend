// import enviroment variables using dotenv
import path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// imports
import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import verifyAccessJwt from "./middleware/verifyJwt";
import connectToDb from "./utils/connectToDb.utils";
import logger from "./utils/logger.utils";
import { env } from "./config/env";

import errFunction from "./middleware/error.middleware";

// Routers import
import healthCheckRouter from "./routes/healthCheck.routes";
import userRouter from "./routes/user.routes";
import adminRouter from "./routes/admin.routes";
import superAdminRouter from "./routes/superadmin.routes";
import authRouter from "./routes/auth.routes";

// Protected Router Imports
import userProtectedRouter from "./routes/user.protectedRoutes";
import {
  verifyIsAdmin,
  verifyIsSuperAdmin,
} from "./middleware/verifyIsAdmin.middleware";
import { authInit } from "./utils/auth/authInit";
import corsOptions, { allowedOrigins } from "./config/corsConfig";
import { credentials } from "./middleware/credentials";

// creating an express app
const app: Application = express();
const PORT = Number(env.PORT) || 4000;

// Cors - Cross Origin Resource Sharing
// app.use(cors(corsOptions));
app.use(
  cors({
    origin: "*", // Replace with your allowed origin or use '*' to allow all origins
    allowedHeaders: "Content-Type,Authorization", // Specify the allowed headers for requests
  })
);
// CORS - res headers credential
app.use(credentials);

// Middleware
// handle url encoded data / form data
app.use(express.urlencoded({ extended: true }));

// parse json
app.use(express.json({ limit: "50mb" }));

// middleware for cookies
app.use(cookieParser());

// Routes
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/user", userRouter);

// oauth2.0
authInit(app);

app.use("/api/v1", authRouter);
// get product

// Access JWT Verification
app.use(verifyAccessJwt);

// Protected Routes
app.use("/api/v1/user", userProtectedRouter);

// verify user is admin or super admin
app.use(verifyIsAdmin);
app.use("/api/v1/admin", adminRouter);

// Admin Routes
// crud product

// verify user is super admin
app.use(verifyIsSuperAdmin);

// Super admin routes
app.use("/api/v1/superadmin", superAdminRouter);

// 404
app.all("*", (req: Request, res: Response) => {
  if (req.accepts("json")) {
    res.json({ error: "404 not found" });
  }
  if (req.accepts("txt")) {
    res.send("404 not found");
  }
});

// Error handling

app.use(errFunction);

// Listening
app.listen(PORT, async () => {
  logger.info(`server running on port ${PORT}, in ${env.NODE_ENV} enviroment`);

  // Connect To Database
  await connectToDb();
});

export default app;
