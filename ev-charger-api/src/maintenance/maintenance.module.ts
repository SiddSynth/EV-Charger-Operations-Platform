import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MaintenanceTicket } from './maintenance-ticket.entity';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceService } from './maintenance.services';
import { Charger } from '../chargers/charger.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MaintenanceTicket,
      Charger,
    ]),
  ],
  controllers: [MaintenanceController],
  providers: [MaintenanceService],
})
export class MaintenanceModule {}