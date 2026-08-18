import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);

    app.enableCors();

    await app.init();

    cachedApp = app;
  }

  return cachedApp;
}

// Vercel serverless handler
export default async function handler(req: any, res: any) {
  const app = await bootstrap();

  const expressInstance = app.getHttpAdapter().getInstance();

  return expressInstance(req, res);
}

// Local development
if (!process.env.VERCEL) {
  bootstrap().then((app) => {
    app.listen(process.env.PORT ?? 3001);
  });
}