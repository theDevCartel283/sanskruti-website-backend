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

// Routers import
import testRouter from './routes/api/v1/test.routes';

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
app.use(
  express.urlencoded({ extended: true, parameterLimit: 100000, limit: '50mb' })
);

// parse json
app.use(express.json({ limit: '50mb' }));

// middleware for cookies
app.use(cookieParser());

// File Upload
app.use(fileUpload());

// Routes
app.use('/api/v1/test', testRouter);

// JWT Verification

// Protected Routes

// 404
app.all('*', (req: Request, res: Response) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, '..', 'views', '404.html'));
  }
  if (req.accepts('json')) {
    res.json({ error: '404 not found' });
  }
  if (req.accepts('txt')) {
    res.send('404 not found');
  }
});

// Error handling

// Listening
app.listen(PORT, () => {
  console.log(
    `server running on port ${PORT}, in ${process.env.NODE_ENV} enviroment`
  );
});
