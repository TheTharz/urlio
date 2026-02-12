import express,{Application,Request,Response} from "express";
import shortnerRoutes from "./routes/shortner.routes";

const app:Application = express();

app.use(express.json());
app.use("/api/v1/shortner_service/",shortnerRoutes);

export default app;