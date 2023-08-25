import { model, Schema, Document } from "mongoose";

export type ConfigType = {
  type: "production" | "developement";

  payZapp?: {
    merchant_id: string;
    access_code: string;
    working_key: string;
  };

  social?: {
    id: string;
    media: "twitter" | "instagram" | "facebook" | "youtube";
    link: string;
  }[];

  auth?: {
    google?: {
      clientId: string;
      secret: string;
    };

    facebook?: {
      clientId: string;
      secret: string;
    };
  };

  analytics?: {
    google: string;
  };
};

interface ConfigDocument extends Document, ConfigType {}
const configSchema: Schema<ConfigDocument> = new Schema({
  type: String,

  payZapp: {
    merchant_id: String,
    access_code: String,
    working_key: String,
  },

  social: [
    {
      id: String,
      media: String,
      link: String,
    },
  ],

  auth: {
    google: {
      clientId: String,
      secret: String,
    },
    facebook: {
      clientId: String,
      secret: String,
    },
  },

  analytics: {
    google: String,
  },
});

const ConfigModel = model("Config", configSchema);
export default ConfigModel;