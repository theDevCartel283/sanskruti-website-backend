import cors from "cors";
import { env } from "./env";

export const allowedOrigins = [
  "http://localhost:3000",
  "https://admin.sanskrutinx.in",
  "https://sanskrutinx.in",
];
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // if development allow undefined
    if (env.NODE_ENV === "development" && origin === undefined) {
      return callback(null, true);
    }

    // else reject undefined
    if (origin === undefined) return callback(new Error("not allowed by CORS"));

    // check allowed
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsOptions;
