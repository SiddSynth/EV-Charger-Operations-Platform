import { NotFoundException } from '@nestjs/common';

import { ChargersService } from './chargers.service';

describe('ChargersService', () => {
  const createService = () => {
    const chargerRepository = {
      count: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
    };

    return {
      service: new ChargersService(chargerRepository as any),
      chargerRepository,
    };
  };

  it('returns a charger by id', async () => {
    const { service, chargerRepository } = createService();
    const charger = { id: 2566, stationName: 'Tata.ev Luxon Motors' };
    chargerRepository.findOneBy.mockResolvedValue(charger);

    await expect(service.findOne(2566)).resolves.toBe(charger);
  });

  it('returns not found when a charger id does not exist', async () => {
    const { service, chargerRepository } = createService();
    chargerRepository.findOneBy.mockResolvedValue(null);

    await expect(service.findOne(2)).rejects.toBeInstanceOf(NotFoundException);
  });
});
