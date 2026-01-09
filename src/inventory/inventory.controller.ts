import { Controller, Get, Post, Put, Delete, Body, Param, ValidationPipe, UsePipes } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateUnitDto } from './dto/create-unit.dto';
import { CreateProviderDto } from './dto/create-provider.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateEntryDto } from './dto/create-entry.dto';
import { CreateExitDto } from './dto/create-exit.dto';

@Controller('inventory')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  /* ===== CATEGORIES ===== */
  @Post('categories')
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.service.createCategory(dto);
  }

  @Get('categories')
  findAllCategories() {
    return this.service.findAllCategories();
  }

  @Get('categories/:id')
  findOneCategory(@Param('id') id: number) {
    return this.service.findOneCategory(+id);
  }

  @Put('categories/:id')
  updateCategory(@Param('id') id: number, @Body() dto: Partial<CreateCategoryDto>) {
    return this.service.updateCategory(+id, dto);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: number) {
    return this.service.deleteCategory(+id);
  }

  /* ===== UNITS ===== */
  @Post('units')
  createUnit(@Body() dto: CreateUnitDto) {
    return this.service.createUnit(dto);
  }

  @Get('units')
  findAllUnits() {
    return this.service.findAllUnits();
  }

  @Get('units/:id')
  findOneUnit(@Param('id') id: number) {
    return this.service.findOneUnit(+id);
  }

  @Put('units/:id')
  updateUnit(@Param('id') id: number, @Body() dto: Partial<CreateUnitDto>) {
    return this.service.updateUnit(+id, dto);
  }

  @Delete('units/:id')
  deleteUnit(@Param('id') id: number) {
    return this.service.deleteUnit(+id);
  }

  /* ===== PROVIDERS ===== */
  @Post('providers')
  createProvider(@Body() dto: CreateProviderDto) {
    return this.service.createProvider(dto);
  }

  @Get('providers')
  findAllProviders() {
    return this.service.findAllProviders();
  }

  @Get('providers/:id')
  findOneProvider(@Param('id') id: number) {
    return this.service.findOneProvider(+id);
  }

  @Put('providers/:id')
  updateProvider(@Param('id') id: number, @Body() dto: Partial<CreateProviderDto>) {
    return this.service.updateProvider(+id, dto);
  }

  @Delete('providers/:id')
  deleteProvider(@Param('id') id: number) {
    return this.service.deleteProvider(+id);
  }

  /* ===== PRODUCTS ===== */
  @Post('products')
  createProduct(@Body() dto: CreateProductDto) {
    return this.service.createProduct(dto);
  }

  @Get('products')
  findAllProducts() {
    return this.service.findAllProducts();
  }

  @Get('products/:id')
  findOneProduct(@Param('id') id: number) {
    return this.service.findOneProduct(+id);
  }

  @Put('products/:id')
  updateProduct(@Param('id') id: number, @Body() dto: Partial<CreateProductDto>) {
    return this.service.updateProduct(+id, dto);
  }

  @Delete('products/:id')
  deleteProduct(@Param('id') id: number) {
    return this.service.deleteProduct(+id);
  }

  /* ===== ENTRIES ===== */
  @Post('entries')
  createEntry(@Body() dto: CreateEntryDto) {
    return this.service.createEntry(dto);
  }

  @Get('entries')
  findAllEntries() {
    return this.service.findAllEntries();
  }

  @Get('entries/:id')
  findOneEntry(@Param('id') id: number) {
    return this.service.findOneEntry(+id);
  }

  @Delete('entries/:id')
  deleteEntry(@Param('id') id: number) {
    return this.service.deleteEntry(+id);
  }

  /* ===== EXITS ===== */
  @Post('exits')
  createExit(@Body() dto: CreateExitDto) {
    return this.service.createExit(dto);
  }

  @Get('exits')
  findAllExits() {
    return this.service.findAllExits();
  }

  @Get('exits/:id')
  findOneExit(@Param('id') id: number) {
    return this.service.findOneExit(+id);
  }

  @Delete('exits/:id')
  deleteExit(@Param('id') id: number) {
    return this.service.deleteExit(+id);
  }

  /* ===== STOCK & REPORTS ===== */
  @Get('stock')
  getStock() {
    return this.service.getStock();
  }

  // @Get('stock/low')
  // getLowStock() {
  //   return this.service.getLowStock();
  // }

  // @Get('products/:id/kardex')
  // getProductKardex(@Param('id') id: number) {
  //   return this.service.getProductKardex(+id);
  // }

  // @Get('dashboard')
  // getDashboard() {
  //   return this.service.getDashboard();
  // }
}