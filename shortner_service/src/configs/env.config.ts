import dotenv from "dotenv";

dotenv.config();

const requireEnv = (value:string | undefined,name:string) => {
  if(!value){
    throw new Error(`Missing environment variable : ${name} is required`);
  }
  return value;
}

export const env = {
  PORT:parseInt(requireEnv(process.env.PORT,"PORT")),
  DATABASE_URL:requireEnv(process.env.DATABASE_URL,"DATABASE_URL"),
  BASE_URL:requireEnv(process.env.BASE_URL,"BASE_URL")
}