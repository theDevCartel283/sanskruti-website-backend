import cors from 'cors';

const node_env = process.env.NODE_ENV;

export const allowedOrigins = ['https://vishal-kamath.github.io'];
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (node_env === 'developement' && origin === undefined) {
      return callback(null, true);
    }
    if (origin === undefined) {
      return callback(new Error('Not allowed by CORS'));
    }
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};

export default corsOptions;
