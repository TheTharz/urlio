import app from './app';
import { env } from './configs/env.config';

app.listen(env.PORT,()=>{
  console.log(`Server is running on port ${env.PORT}`);
})