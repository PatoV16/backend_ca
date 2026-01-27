// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import { join } from 'path';

// async function bootstrap() {
//   const app = await NestFactory.create<NestExpressApplication>(AppModule);

//   // ✅ Validación global de DTOs
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//     }),
//   );

//   // ✅ Servir imágenes estáticas
//   app.useStaticAssets(join(__dirname, '..', 'uploads'), {
//     prefix: '/uploads/',
//   });

//   // (Opcional pero recomendado)
//   app.enableCors();

//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import { join } from 'path';

// async function bootstrap() {
//   const app = await NestFactory.create<NestExpressApplication>(AppModule);

//   //⚠️ IMPORTANTE: CORS debe ir ANTES de todo
//   app.enableCors({
//     origin: true, // Permite todos los orígenes en desarrollo
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
//     exposedHeaders: ['Content-Type', 'Content-Length'],
//   });

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//     }),
//   );

// //  Servir imágenes estáticas
//   app.useStaticAssets(join(__dirname, '..', 'uploads'), {
//     prefix: '/uploads/',
//   });

//   const port = process.env.PORT ?? 3000;
//   await app.listen(port, '0.0.0.0'); // ← Escucha en todas las interfaces
  
//   console.log(`🚀 Server running on: http://localhost:${port}`);
//   console.log(`🚀 Also available at: http://127.0.0.1:${port}`);
//   console.log(`📁 Serving static files from: ${join(__dirname, '..', 'uploads')}`);
//   console.log(`🌐 CORS enabled for all origins`);
// }
// bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization','Accept','Origin'],
    exposedHeaders: ['Content-Type','Content-Length'],
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Static assets solo si quieres soporte local
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads/' });

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server running on: http://localhost:${port}`);
  console.log(`🌐 CORS enabled for all origins`);
}
bootstrap();
