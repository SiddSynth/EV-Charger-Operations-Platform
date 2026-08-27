import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import * as dotenv from 'dotenv';

// Load environmental variables
dotenv.config();

import { Charger } from '../chargers/charger.entity';
import { User } from '../users/user.entity';

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  // Use fallback local settings only if DATABASE_URL is not provided
  ...(!process.env.DATABASE_URL && {
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'gababa',
    database: 'ev_charger_db',
  }),
  entities: [Charger, User],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();

  console.log('Database connected.');

  // Seed Users
  const userRepository = dataSource.getRepository(User);
  const mockUsers = [
    { name: 'Vishal', email: 'vishal@evcompany.com', password: 'admin123', role: 'Admin', status: 'Active' },
    { name: 'Satyam', email: 'satyam@evcompany.com', password: 'employee123', role: 'Employee', status: 'Active' },
    { name: 'Rahul', email: 'rahul@evcompany.com', password: 'inactive123', role: 'Employee', status: 'Inactive' }
  ];

  for (const mu of mockUsers) {
    let user = await userRepository.findOneBy({ email: mu.email });
    if (!user) {
      user = userRepository.create(mu);
    } else {
      user.name = mu.name;
      user.status = mu.status;
    }
    await userRepository.save(user);
    console.log(`User ${mu.email} created/updated.`);
  }

  const filePath = path.join(
    process.cwd(),
    'data',
    'Indian_EV_Stations_Simplified.csv',
  );

  const csvFile = fs.readFileSync(filePath, 'utf-8');

  const records = parse(csvFile, {
    columns: true,
    skip_empty_lines: true,
  });

  const chargerRepository = dataSource.getRepository(Charger);

  const existingChargersCount = await chargerRepository.count();
  if (existingChargersCount > 0) {
    console.log('Database already has chargers. Skipping charger seeding.');
    await dataSource.destroy();
    return;
  }

  const chargers = records.map((record: any) => {
    const charger = new Charger();

    charger.stationName = record['Station Name'];
    charger.city = record['City'];
    charger.state = record['State'];
    charger.latitude = Number(record['Latitude']);
    charger.longitude = Number(record['Longitude']);
    charger.operator = record['Operator'];
    charger.usageType = record['Usage Type'];
    charger.connectorType = record['Connector Type'];
    charger.powerKw = Number(record['Power (kW)']);
    charger.status = 'Online';

    return charger;
  });

  await chargerRepository.save(chargers);

  console.log(`${chargers.length} chargers inserted.`);

  await dataSource.destroy();
}

seed().catch((error) => {
  console.error('Seed failed:', error);
});