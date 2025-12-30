import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigurationModule } from './config/configuration.module';

@Module({
  imports: [
    // 🔹 ENV GLOBAL
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 🔹 POSTGRES
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // ⚠️ solo en desarrollo
    }),

    ConfigurationModule,
  ],
})
export class AppModule {}
