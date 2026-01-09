import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkOrdersService } from './work-orders.service';
import { WorkOrdersController } from './work-orders.controller';

import { WorkOrder } from './entities/work-order.entity';
import { WorkOrderProduct } from './entities/work-order-products.entity';

import { UserEntity } from '../users/entities/user.entity';
import { Product } from '../inventory/entities/product.entity';
import { Exit } from '../inventory/entities/exit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkOrder,
      WorkOrderProduct,
      UserEntity,
      Product,
      Exit,
    ]),
  ],
  controllers: [WorkOrdersController],
  providers: [WorkOrdersService],
  exports: [WorkOrdersService],
})
export class WorkOrdersModule {}
