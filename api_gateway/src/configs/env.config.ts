import dotenv from 'dotenv';

dotenv.config();

const requireEnv = (value:string|undefined,name:string)=>{
  if(!value){
    throw new Error(`Missing environment variable : ${name} is required`);
  }  
  return value;
}

export const env = {
  PORT:parseInt(requireEnv(process.env.PORT,"PORT")),
  SHORTNER_SERIVCE_URL:requireEnv(process.env.SHORTNER_SERVICE_URL,"SHORTNER_SERVICE_URL"),
  REDIRECT_SERIVCE_URL:requireEnv(process.env.REDIRECT_SERVICE_URL,"REDIRECT_SERVICE_URL")
}