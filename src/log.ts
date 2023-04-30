import dotenv from 'dotenv';
dotenv.config();
import { Client, ClientOptions } from '@kleithor/logger';

export const options: ClientOptions = {
  application: process.env.APPLICATION as string,
  saveLogs: process.env.PRODUCTION === 'true',
};

export const LOGGER = new Client(process.env.DB_CONNECTION_URL as string, options);
