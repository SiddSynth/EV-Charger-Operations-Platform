import { BadRequestException, NotFoundException } from '@nestjs/common';

import { MaintenanceService } from './maintenance.services';

describe('MaintenanceService', () => {
  const createService = () => {
    const ticketRepository = {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };
    const chargerRepository = {
      findOneBy: jest.fn(),
      save: jest.fn(),
    };

    return {
      service: new MaintenanceService(
        ticketRepository as any,
        chargerRepository as any,
      ),
      ticketRepository,
      chargerRepository,
    };
  };

  it('returns a not found response when resolving a missing ticket', async () => {
    const { service, ticketRepository } = createService();
    ticketRepository.findOne.mockResolvedValue(null);

    await expect(service.resolve(1)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects incomplete maintenance tickets with a bad request response', async () => {
    const { service } = createService();

    await expect(
      service.create(Number.NaN, 'Connector fault', 'High'),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.create(1, '', 'High')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    await expect(
      service.create(1, 'Connector fault', ''),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
