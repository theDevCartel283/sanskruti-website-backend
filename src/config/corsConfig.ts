import cors from "cors";
import { env } from "./env";

export const allowedOrigins = [
  "http://localhost:3000",
  "https://admin.sanskrutinx.in",
  "https://sanskrutinx.in",
  "https://cdn.sanskrutinx.in",
  "https://admin.sanskrutinx.com",
  "https://sanskrutinx.com",
  "https://cdn.sanskrutinx.com",
];
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // if (allowedOrigins.includes(origin)) {
    //   callback(null, true);
    // } else {
    //   callback(new Error("not allowed by CORS"));
    // }
    return callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsOptions;
