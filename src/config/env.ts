import { str, envsafe, port, url } from "envsafe";

export const env = envsafe({
  PORT: port({
    devDefault: 3500,
    desc: "The port the app is running on",
    example: 80,
  }),
  NODE_ENV: str({
    devDefault: "development",
    choices: ["development", "production"],
  }),

  // endpoint
  ENDPOINT: url(),

  // google auth
  GOOGLE_CLIENT_ID: str(),
  GOOGLE_CLIENT_SECRET: str(),

  // facebook auth
  // FACEBOOK_CLIENT_ID: str(),
  // FACEBOOK_CLIENT_SECRET: str(),

  // database
  DATABASE_DEV_URI: url(),
  DATABASE_PROD_URI: url(),

  // access token
  ACCESS_TOKEN_PRIVATE: str(),
  ACCESS_TOKEN_PUBLIC: str(),

  // refresh token
  REFRESH_TOKEN_PRIVATE: str(),
  REFRESH_TOKEN_PUBLIC: str(),

  // email token
  EMAIL_TOKEN_PRIVATE: str(),
  EMAIL_TOKEN_PUBLIC: str(),

  // Role Secret
  USER_ROLE: str(),
  ADMIN_ROLE: str(),
  SUPERADMIN_ROLE: str(),
});
