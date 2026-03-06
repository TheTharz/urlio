import app from './app';
import { env } from './configs/env.config';
import { logger } from './configs/logger.config';

app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, 'Server is running');
});