import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.ENV,
  port: process.env.PORT,
};
