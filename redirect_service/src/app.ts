import express,{ Application } from "express";
import redirectRoutes from "./routes/redirect.routes"

const app:Application = express();

app.use(express.json());
app.use("/",redirectRoutes);

export default app;