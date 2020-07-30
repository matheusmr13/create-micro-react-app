import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeFirebase } from './auth/auth.service';
import * as helmet from 'helmet';

const firebaseAdminConfigToParse = JSON.parse(
  process.env.FIREBASE_ADMIN_CONFIG!,
);
const firebaseAdminConfig = {
  ...firebaseAdminConfigToParse,
  private_key: JSON.parse(`"${firebaseAdminConfigToParse.private_key}"`),
};

async function startApplication() {
  const app = await NestFactory.create(AppModule, { cors: true });
  initializeFirebase(firebaseAdminConfig);
  app.use(helmet());
  await app.listen(8080);
}

startApplication();
