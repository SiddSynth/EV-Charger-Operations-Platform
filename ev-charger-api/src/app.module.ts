import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [User, Charger, MaintenanceTicket],
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    UsersModule,
    ChargersModule,
    MaintenanceModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}