import { env } from './config/env.js';
import { connectDatabase } from './config/db.js';
import { app } from './app.js';

async function bootstrap() {
  await connectDatabase();
  app.listen(env.PORT, () => {
    console.log(`API listening on port ${env.PORT}`);
  });
}

void bootstrap();
