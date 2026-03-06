import dotenv from "dotenv";

dotenv.config();

const requireEnv = (value:string | undefined,name:string) => {
  if(!value){
    throw new Error(`Missing environment variable : ${name} is required`);
  }
  return value;
}

const optionalEnv = (value:string | undefined) => {
  return value || undefined;
}

export const env = {
  PORT:parseInt(requireEnv(process.env.PORT,"PORT")),
  DATABASE_URL:requireEnv(process.env.DATABASE_URL,"DATABASE_URL"),
  BASE_URL:requireEnv(process.env.BASE_URL,"BASE_URL"),
  REDIS_DATABASE_URL:requireEnv(process.env.REDIS_DATABASE_URL,"REDIS_DATABASE_URL"),
  REDIS_DATABASE_PASSWORD:optionalEnv(process.env.REDIS_DATABASE_PASSWORD), // Optional for local dev
  NODE_ENV:requireEnv(process.env.NODE_ENV,"NODE_ENV"),
  LOG_LEVEL:requireEnv(process.env.LOG_LEVEL,"LOG_LEVEL")
}