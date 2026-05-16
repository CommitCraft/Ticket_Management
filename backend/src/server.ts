import { env } from './config/env.js';
import { connectDatabase } from './config/db.js';
import { app } from './app.js';

async function bootstrap() {
  await connectDatabase();
  app.listen(env.PORT, env.HOST, () => {
    console.log(`API listening on ${env.HOST}:${env.PORT}`);
  });
}

void bootstrap();
