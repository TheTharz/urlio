import app from './app';
import { env } from './configs/env.config';
import { connectRedis } from './configs/redis.config';

const startServer = async () => {
  await connectRedis();

  app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });
};

startServer();