// import enviroment variables using dotenv
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// imports
import express, { Application, Request, Response } from 'express';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import corsOptions from './config/corsConfig';
import verifyAccessJwt from './middleware/verifyJwt';
import connectToDb from './utils/connectToDb.utils';
import logger from './utils/logger.utils';

// Routers import
import healthCheckRouter from './routes/healthCheck.routes';
import refreshRouter from './routes/refresh.routes';
import userRouter from './routes/user.routes';
import adminRouter from './routes/admin.routes';
import superAdminRouter from './routes/superadmin.routes';

// Protected Router Imports
import userProtectedRouter from './routes/user.protectedRoutes';
import {
  verifyIsAdmin,
  verifyIsSuperAdmin,
} from './middleware/verifyIsAdmin.middleware';

// creating an express app
const app: Application = express();
const PORT = Number(process.env.PORT) || 3500;

// Cors - Cross Origin Resource Sharing
app.use(cors(corsOptions));

// Middleware
// handle url encoded data / form data
app.use(
  express.urlencoded({ extended: false, parameterLimit: 100000, limit: '50mb' })
);

// parse json
app.use(express.json({ limit: '50mb' }));

// middleware for cookies
app.use(cookieParser());

// File Upload
app.use(fileUpload());

// Routes
app.use('/api/v1/healthcheck', healthCheckRouter);
app.use('/api/v1/refresh', refreshRouter);
app.use('/api/v1/user', userRouter);
// get product

// Access JWT Verification
app.use(verifyAccessJwt);

// Protected Routes
app.use('/api/v1/user', userProtectedRouter);

// verify user is admin or super admin
app.use(verifyIsAdmin);
app.use('/api/v1/admin', adminRouter);

// Admin Routes
// crud product

// verify user is super admin
app.use(verifyIsSuperAdmin);

// Super admin routes
app.use('/api/v1/admin', superAdminRouter);

// 404
app.all('*', (req: Request, res: Response) => {
  if (req.accepts('json')) {
    res.json({ error: '404 not found' });
  }
  if (req.accepts('txt')) {
    res.send('404 not found');
  }
});

// Error handling

// Listening
app.listen(PORT, async () => {
  logger.info(
    `server running on port ${PORT}, in ${process.env.NODE_ENV} enviroment`
  );

  // Connect To Database
  await connectToDb();
});
