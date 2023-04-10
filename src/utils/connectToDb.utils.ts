import mongoose from 'mongoose';
import logger from './logger.utils';
import { env } from '../config/env';

async function connectToDb() {
  let database_uri = env.DATABASE_DEV_URI;
  if (env.NODE_ENV === 'production') database_uri = env.DATABASE_PROD_URI;
  mongoose.set('strictQuery', false);
  try {
    if (!database_uri) throw Error('Datebase Uri not defined');
    await mongoose.connect(database_uri);
    logger.success('connected to DB');
  } catch (error: any) {
    logger.error(`Could not connect to Db \n${(error as Error).stack}`);
    process.exit(1);
  }
}

export default connectToDb;
