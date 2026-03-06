import app from "./app";
import { env } from "./configs/env.config";

const PORT = env.PORT || 5004;

app.listen(PORT, () => {
    console.log(`Auth Service is running on port ${PORT}`);
});
