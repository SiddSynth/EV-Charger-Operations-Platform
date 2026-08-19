import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule, { abortOnError: false });

    app.enableCors();

    await app.init();

    cachedApp = app;
  }

  return cachedApp;
}

// Vercel serverless handler
export default async function handler(req: any, res: any) {
  try {
    const app = await bootstrap();
    const expressInstance = app.getHttpAdapter().getInstance();
    return expressInstance(req, res);
  } catch (error) {
    console.error("Vercel handler bootstrap failed:", error);
    res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error during NestJS bootstrap",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}

// Local development
if (!process.env.VERCEL) {
  bootstrap().then((app) => {
    app.listen(process.env.PORT ?? 3001);
  });
}