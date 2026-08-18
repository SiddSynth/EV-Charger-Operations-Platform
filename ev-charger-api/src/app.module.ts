import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        return {
          type: 'postgres',
          url: databaseUrl || undefined,
          host: databaseUrl ? undefined : configService.get<string>('DB_HOST', 'localhost'),
          port: databaseUrl ? undefined : Number(configService.get<number>('DB_PORT', 5432)),
          username: databaseUrl ? undefined : configService.get<string>('DB_USERNAME', 'postgres'),
          password: databaseUrl ? undefined : configService.get<string>('DB_PASSWORD', 'gababa'),
          database: databaseUrl ? undefined : configService.get<string>('DB_NAME', 'ev_charger_db'),
          entities: [User, Charger, MaintenanceTicket],
          autoLoadEntities: true,
          synchronize: configService.get<string>('NODE_ENV') !== 'production',
          ssl:
            configService.get<string>('NODE_ENV') === 'production'
              ? { rejectUnauthorized: false }
              : false,
        };
      },
    }),

    UsersModule,
    ChargersModule,
    MaintenanceModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
