import { Injectable } from '@nestjs/common';
import { type CountryResponse } from '@workspace/shared/schema/country/country.response';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CountryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CountryResponse[]> {
    return this.prisma.country.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}
