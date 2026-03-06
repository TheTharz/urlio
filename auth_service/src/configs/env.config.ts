import dotenv from "dotenv";
dotenv.config();

const requireEnv = (value: string | undefined, name: string) => {
    if (!value) {
        throw new Error(`Missing environment variable : ${name} is required`);
    }
    return value;
}


export const env = {
    PORT: parseInt(process.env.PORT as string, 10) || 5004,
    DATABASE_URL: requireEnv(process.env.DATABASE_URL as string, "DATABASE_URL"),
    JWT_SECRET: requireEnv(process.env.JWT_SECRET as string, "JWT_SECRET")
};
