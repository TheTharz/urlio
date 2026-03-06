import dotenv from 'dotenv';

dotenv.config();

const requireEnv = (value: string | undefined, name: string) => {
  if (!value) {
    throw new Error(`Missing environment variable : ${name} is required`);
  }
  return value;
}

export const env = {
  PORT: parseInt(process.env.PORT as string, 10) || 5002,
  SHORTNER_SERIVCE_URL: requireEnv(process.env.SHORTNER_SERVICE_URL as string, "SHORTNER_SERVICE_URL"),
  REDIRECT_SERIVCE_URL: requireEnv(process.env.REDIRECT_SERVICE_URL as string, "REDIRECT_SERVICE_URL"),
  ANALYTICS_SERVICE_URL: requireEnv(process.env.ANALYTICS_SERVICE_URL as string, "ANALYTICS_SERVICE_URL"),
  JWT_SECRET: requireEnv(process.env.JWT_SECRET as string, "JWT_SECRET"),
  AUTH_SERVICE_URL: requireEnv(process.env.AUTH_SERVICE_URL as string, "AUTH_SERVICE_URL"),
}