import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: number) {
    const charger = await this.chargerRepository.findOneBy({ id });

    if (!charger) {
      throw new NotFoundException('Charger not found');
    }

    return charger;
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
    let fastChargers = 0;
    let slowChargers = 0;

    chargers.forEach((charger) => {
      // Normalize state names
      let state = charger.state ? charger.state.trim() : 'Unknown';
      if (state) {
        const stateLower = state.toLowerCase();
        if (
          stateLower.includes('keral') ||
          stateLower === 'keraka' ||
          stateLower === 'lerala'
        ) {
          state = 'Kerala';
        } else if (stateLower.includes('karnatak')) {
          state = 'Karnataka';
        } else if (stateLower.includes('maharashtr')) {
          state = 'Maharashtra';
        } else if (stateLower.includes('tamil')) {
          state = 'Tamil Nadu';
        } else if (stateLower.includes('delhi')) {
          state = 'Delhi';
        } else {
          state = state
            .split(' ')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(' ');
        }
      } else {
        state = 'Unknown';
      }

      byState[state] = (byState[state] || 0) + 1;

      // Normalize operators
      let operator = charger.operator
        ? charger.operator.trim()
        : 'Unknown Operator';
      if (!operator || operator === '' || operator === 'undefined') {
        operator = 'Unknown Operator';
      }
      byOperator[operator] = (byOperator[operator] || 0) + 1;

      totalPower += charger.powerKw;

      if (charger.powerKw >= 50) {
        fastChargers++;
      } else {
        slowChargers++;
      }
    });

    return {
      totalChargers: chargers.length,
      totalPower: Math.round(totalPower * 10) / 10,
      fastChargers,
      slowChargers,
      byState,
      byOperator,
    };
  }

  async updateStatus(id: number, status: string) {
    const charger = await this.chargerRepository.findOneBy({ id });
    if (!charger) {
      throw new NotFoundException('Charger not found');
    }
    charger.status = status;
    return this.chargerRepository.save(charger);
  }
}
