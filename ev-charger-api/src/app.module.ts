import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';

import { Charger } from './chargers/charger.entity';
import { ChargersModule } from './chargers/chargers.module';

import { MaintenanceTicket } from './maintenance/maintenance-ticket.entity';
import { MaintenanceModule } from './maintenance/maintenance.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'gababa',
      database: 'ev_charger_db',
      entities: [User, Charger, MaintenanceTicket],
      autoLoadEntities: true,
      synchronize: true,
    }),

    UsersModule,
    ChargersModule,
    MaintenanceModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}