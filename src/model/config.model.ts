import { model, Schema, Document } from "mongoose";

export type ConfigType = {
  type: "production" | "developement";

  payZapp?: {
    merchant_id?: string;
    access_code?: string;
    working_key?: string;
  };

  paymentStatus: {
    payZapp: boolean;
    cashondelivery: boolean;
  };

  social?: {
    id: string;
    media: string;
    link: string;
  }[];

  auth: {
    google?: {
      clientId: string;
      secret: string;
    };

    facebook?: {
      clientId: string;
      secret: string;
    };

    status?: {
      google: boolean;
      facebook: boolean;
    };
  };

  analytics: {
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

  paymentStatus: {
    payZapp: Boolean,
    cashondelivery: Boolean,
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
    status: {
      google: Boolean,
      facebook: Boolean,
    },
  },

  analytics: {
    google: String,
  },
});

const ConfigModel = model("Config", configSchema);
export default ConfigModel;
