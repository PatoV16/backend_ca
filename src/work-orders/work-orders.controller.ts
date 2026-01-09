import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { WorkOrdersService } from './work-orders.service';
import { CreateWorkOrderDto, UpdateWorkOrderDto  } from './dto/create-work-order.dto';
@Controller('work-orders')
export class WorkOrdersController {
  constructor(private readonly workOrdersService: WorkOrdersService) {}

  // ==================
  // CREATE
  // ==================
  @Post()
  create(@Body() dto: CreateWorkOrderDto) {
    return this.workOrdersService.create(dto);
  }

  // ==================
  // FIND ALL
  // ==================
  @Get()
  findAll(
    @Query('estado') estado?: string,
    @Query('usuario') usuarioId?: string,
  ) {
    if (estado) {
      return this.workOrdersService.findByStatus(estado);
    }

    if (usuarioId) {
      return this.workOrdersService.findByUser(usuarioId);
    }

    return this.workOrdersService.findAll();
  }

  // ==================
  // FIND ONE
  // ==================
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.workOrdersService.findOne(id);
  }

  // ==================
  // UPDATE
  // ==================
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWorkOrderDto,
  ) {
    return this.workOrdersService.update(id, dto);
  }

  // ==================
  // UPDATE STATUS
  // ==================
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('estado') estado: string,
  ) {
    return this.workOrdersService.updateStatus(id, estado);
  }

  // ==================
  // DELETE (SOFT)
  // ==================
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.workOrdersService.remove(id);
  }

  // ==================
  // STATISTICS
  // ==================
  @Get('stats/summary')
  getStatistics() {
    return this.workOrdersService.getStatistics();
  }
}
