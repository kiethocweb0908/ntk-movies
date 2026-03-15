import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { type CountryResponse } from '@workspace/shared/schema/country/country.response';

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
