import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

import { Charger } from '../chargers/charger.entity';

const databaseUrl = process.env.DATABASE_URL;

const dataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl || undefined,
  host: databaseUrl ? undefined : process.env.DB_HOST || 'localhost',
  port: databaseUrl ? undefined : Number(process.env.DB_PORT || 5432),
  username: databaseUrl ? undefined : process.env.DB_USERNAME || 'postgres',
  password: databaseUrl ? undefined : process.env.DB_PASSWORD || 'gababa',
  database: databaseUrl ? undefined : process.env.DB_NAME || 'ev_charger_db',
  entities: [Charger],
  ssl:
    process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function seed() {
  await dataSource.initialize();

  console.log('Database connected.');

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