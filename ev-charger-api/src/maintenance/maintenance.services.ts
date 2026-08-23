import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MaintenanceTicket } from './maintenance-ticket.entity';
import { Charger } from '../chargers/charger.entity';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(MaintenanceTicket)
    private readonly ticketRepository: Repository<MaintenanceTicket>,

    @InjectRepository(Charger)
    private readonly chargerRepository: Repository<Charger>,
  ) {}

  findAll() {
    return this.ticketRepository.find({
      relations: {
        charger: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async create(
    chargerId: number,
    issue: string,
    priority: string,
  ) {
    const charger = await this.chargerRepository.findOneBy({
      id: chargerId,
    });

    if (!charger) {
      throw new Error('Charger not found');
    }

    charger.status = 'Maintenance';
    await this.chargerRepository.save(charger);

    const ticket = this.ticketRepository.create({
      charger,
      issue,
      priority,
      status: 'Open',
    });

    return this.ticketRepository.save(ticket);
  }
}