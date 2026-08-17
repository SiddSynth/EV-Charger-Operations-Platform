import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Charger } from './charger.entity';
import { ChargersController } from './chargers.controller';
import { ChargersService } from './chargers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Charger])],
  controllers: [ChargersController],
  providers: [ChargersService],
})
export class ChargersModule {}