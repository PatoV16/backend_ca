import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationModule } from './config/configuration.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { InventoryModule } from './inventory/inventory.module';
import { WorkOrdersModule } from './work-orders/work-orders.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production', // Mejor práctica
      ssl: {
        rejectUnauthorized: false,
      },
      logging: ['error', 'warn'], // Para ver errores en los logs
      extra: {
        connectionTimeoutMillis: 10000, // 10 segundos timeout
        max: 10, // Pool de 10 conexiones máximo
      },
    }),
    ConfigurationModule,
    UsersModule,
    AuthModule,
    InventoryModule,
    WorkOrdersModule,
    PostsModule,
  ],
})
export class AppModule {}
