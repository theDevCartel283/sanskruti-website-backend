import cors from "cors";
import { env } from "./env";

export const allowedOrigins = ["http://localhost:3000"];
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (env.NODE_ENV === "development" && origin === undefined) {
      return callback(null, true);
    }
    if (origin === undefined) {
      return callback(new Error("Not allowed by CORS"));
    }
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsOptions;
