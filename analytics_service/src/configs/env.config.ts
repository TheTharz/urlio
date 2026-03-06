import dotenv from 'dotenv';

dotenv.config();

const requireEnv = (value: string | undefined, name: string) => {
  if (!value) {
    throw new Error(`Missing environment variable : ${name} is required`);
  }
  return value;
}

export const env = {
  PORT: parseInt(requireEnv(process.env.PORT, "PORT")),
  SHORTNER_SERIVCE_URL: requireEnv(process.env.SHORTNER_SERVICE_URL, "SHORTNER_SERVICE_URL"),
  DATABASE_URL: requireEnv(process.env.DATABASE_URL, "DATABASE_URL"),
  REDIS_URL: requireEnv(process.env.REDIS_DATABASE_URL, "REDIS_DATABASE_URL"),
  REDIS_PASSWORD: process.env.REDIS_DATABASE_PASSWORD
}