import mongoose from 'mongoose';

async function connectToDb() {
  let database_uri = process.env.DATABASE_DEV_URI;
  if (process.env.NODE_ENV === 'production')
    database_uri = process.env.DATABASE_PROD_URI;
  mongoose.set('strictQuery', false);
  try {
    if (!database_uri) throw Error('Datebase Uri not defined');
    await mongoose.connect(database_uri);
    console.log('connected to DB');
  } catch (error: any) {
    console.log(`Could not connect to Db \n${(error as Error).stack}`);
    process.exit(1);
  }
}

export default connectToDb;
