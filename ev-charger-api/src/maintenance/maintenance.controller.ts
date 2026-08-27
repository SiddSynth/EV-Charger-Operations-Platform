import { Body, Controller, Get, Post, Put, Param, ParseIntPipe } from '@nestjs/common';

import { MaintenanceService } from './maintenance.services';

@Controller('maintenance')
export class MaintenanceController {
  constructor(
    private readonly maintenanceService: MaintenanceService,
  ) {}

  @Get()
  findAll() {
    return this.maintenanceService.findAll();
  }

  @Post()
  create(
    @Body()
    body: {
      chargerId: number;
      issue: string;
      priority: string;
    },
  ) {
    return this.maintenanceService.create(
      body.chargerId,
      body.issue,
      body.priority,
    );
  }

  @Put(':id/resolve')
  resolve(@Param('id', ParseIntPipe) id: number) {
    return this.maintenanceService.resolve(id);
  }
}