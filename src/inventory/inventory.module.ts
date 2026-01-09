import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { Product } from './entities/product.entity';
import { Entry } from './entities/entry.entity';
import { Exit } from './entities/exit.entity';
import { Category } from './entities/category.entity';
import { Unit } from './entities/unit.entity';
import { Provider } from './entities/provider.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Entry,
      Exit,
      Category,
      Unit,
      Provider
    ]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
