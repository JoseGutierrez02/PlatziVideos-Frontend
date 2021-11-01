import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.ENV,
  port: process.env.PORT,
  apiUrl: process.env.API_URL,
  apiKeyToken: process.env.API_KEY_TOKEN,
};
