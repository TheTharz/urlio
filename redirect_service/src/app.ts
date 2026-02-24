import express,{ Application } from "express";
import redirectRoutes from "./routes/redirect.routes"
import { errorHandler } from "./middlewares/errorHandler";

const app:Application = express();

app.use(express.json());
app.use("/",redirectRoutes);

app.use(errorHandler);

export default app;