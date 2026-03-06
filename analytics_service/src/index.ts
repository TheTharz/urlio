import app from './app';
import { env } from './configs/env.config';
import { connectRedis } from './configs/redis.config';
import { AnalyticsConsumer } from './workers/analytics.consumer';

const startServer = async () => {
  await connectRedis();

  // Start the background consumer without blocking the main thread
  AnalyticsConsumer.startConsuming().catch(err => {
    console.error('Consumer failed to start', err);
  });

  app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });
};

startServer();