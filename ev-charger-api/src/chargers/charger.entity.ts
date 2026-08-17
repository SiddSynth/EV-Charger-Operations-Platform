import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chargers')
export class Charger {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stationName: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column('double precision')
  latitude: number;

  @Column('double precision')
  longitude: number;

  @Column()
  operator: string;

  @Column()
  usageType: string;

  @Column()
  connectorType: string;

  @Column('float')
  powerKw: number;

  @Column({ default: 'Online' })
  status: string;
}