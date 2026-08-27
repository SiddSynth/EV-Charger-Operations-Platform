import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Charger } from './charger.entity';

@Injectable()
export class ChargersService {
  constructor(
    @InjectRepository(Charger)
    private readonly chargerRepository: Repository<Charger>,
  ) {}

  findAll() {
    return this.chargerRepository.find();
  }

  findOne(id: number) {
    return this.chargerRepository.findOneBy({ id });
  }

  async getStats() {
    const total = await this.chargerRepository.count();

    const online = await this.chargerRepository.count({
      where: {
        status: 'Online',
      },
    });

    const offline = await this.chargerRepository.count({
      where: {
        status: 'Offline',
      },
    });

    const maintenance = await this.chargerRepository.count({
      where: {
        status: 'Maintenance',
      },
    });

    return {
      total,
      online,
      offline,
      maintenance,
    };
  }

  async getAnalytics() {
    const chargers = await this.chargerRepository.find();

    const byState: Record<string, number> = {};
    const byOperator: Record<string, number> = {};

    let totalPower = 0;

    chargers.forEach((charger) => {
      byState[charger.state] =
        (byState[charger.state] || 0) + 1;

      byOperator[charger.operator] =
        (byOperator[charger.operator] || 0) + 1;

      totalPower += charger.powerKw;
    });

    return {
      totalChargers: chargers.length,
      totalPower,
      byState,
      byOperator,
    };
  }

  async updateStatus(id: number, status: string) {
    const charger = await this.chargerRepository.findOneBy({ id });
    if (!charger) {
      throw new Error('Charger not found');
    }
    charger.status = status;
    return this.chargerRepository.save(charger);
  }
}