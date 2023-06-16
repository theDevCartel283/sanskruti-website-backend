import cors from "cors";
import { env } from "./env";

export const allowedOrigins = [
  "https://sanskruti-website-frontend-black.vercel.app",
  "https://sanskruti-admin.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
];
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    return callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsOptions;
