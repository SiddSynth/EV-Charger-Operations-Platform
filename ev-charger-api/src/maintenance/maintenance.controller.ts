import { Body, Controller, Get, Post } from '@nestjs/common';

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
}