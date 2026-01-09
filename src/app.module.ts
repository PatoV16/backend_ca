// import { Module } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';

// import { ConfigurationModule } from './config/configuration.module';
// import { UsersModule } from './users/users.module';
// import { AuthModule } from './auth/auth.module';
// import { InventoryModule } from './inventory/inventory.module';
// import { WorkOrdersModule } from './work-orders/work-orders.module';
// import { PostsModule } from './posts/posts.module';

// @Module({
//   imports: [
//     // 🔹 ENV GLOBAL
//     ConfigModule.forRoot({
//       isGlobal: true,
//     }),

//     // 🔹 POSTGRES
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: process.env.DB_HOST,
//       port: Number(process.env.DB_PORT),
//       username: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME,
//       autoLoadEntities: true,
//       synchronize: true, // ⚠️ solo en desarrollo
//     }),

//     ConfigurationModule,

//     UsersModule,

//     AuthModule,

//     InventoryModule,

//     WorkOrdersModule,

//     PostsModule,
//   ],
// })
// export class AppModule {}
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
      synchronize: true, // ⚠️ solo dev
      ssl: {
        rejectUnauthorized: false,
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
