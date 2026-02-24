import express,{Application,Request,Response} from "express";
import shortnerRoutes from "./routes/shortner.routes";
import { errorHandler } from "./middleware/errorHandler";

const app:Application = express();

app.use(express.json());
app.use("/",shortnerRoutes);

app.use(errorHandler);

export default app;