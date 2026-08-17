import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Charger } from '../chargers/charger.entity';

@Entity('maintenance_tickets')
export class MaintenanceTicket {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Charger)
  @JoinColumn({ name: 'charger_id' })
  charger: Charger;

  @Column()
  issue: string;

  @Column({ default: 'Medium' })
  priority: string;

  @Column({ default: 'Open' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}