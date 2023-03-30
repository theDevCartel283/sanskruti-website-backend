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

// Routers import
import testRouter from './routes/test.routes';
import refreshRouter from './routes/refresh.routes';
import userRouter from './routes/user.routes';

// Protected Router Imports
import userProtectedRouter from './routes/user.protectedRoutes';

// creating an express app
const app: Application = express();
const PORT = process.env.PORT || 3500;

// handle options credentials check before cors
// and fetch cookes credentials requirement
// app.use(credentials);
// Cors - Cross Origin Resource Sharing
app.use(cors(corsOptions));

// Middleware
// handle url encoded data / form data
app.use(express.urlencoded({ extended: false }));

// parse json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// File Upload
// app.use(fileUpload());

// Routes
app.use('/api/v1/test', testRouter);
app.use('/api/v1/refresh', refreshRouter);
app.use('/api/v1/user', userRouter);

// Access JWT Verification
app.use(verifyAccessJwt);

// Protected Routes
app.use('/api/v1/user', userProtectedRouter);

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
  console.log(
    `server running on port ${PORT}, in ${process.env.NODE_ENV} enviroment`
  );

  // Connect To Database
  await connectToDb();
});