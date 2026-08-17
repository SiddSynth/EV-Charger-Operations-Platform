import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ChargersService } from './chargers.service';

@Controller('chargers')
export class ChargersController {
  constructor(private readonly chargersService: ChargersService) {}

  @Get()
  findAll() {
    return this.chargersService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.chargersService.getStats();
  }
  @Get('analytics')
getAnalytics() {
  return this.chargersService.getAnalytics();
}
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.chargersService.findOne(id);
  }
}