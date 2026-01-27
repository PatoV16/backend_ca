// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigurationService } from './configuration.service';
// import { ConfigurationController } from './configuration.controller';
// import { ConfigImage } from './entities/config-image.entity';

// @Module({
//   imports: [TypeOrmModule.forFeature([ConfigImage])],
//   controllers: [ConfigurationController],
//   providers: [ConfigurationService],
// })
// export class ConfigurationModule {}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationService } from './configuration.service';
import { ConfigurationController } from './configuration.controller';
import { ConfigImage } from './entities/config-image.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConfigImage]),
    CloudinaryModule, // 👈 IMPORTANTE
  ],
  controllers: [ConfigurationController],
  providers: [ConfigurationService],
})
export class ConfigurationModule {}
