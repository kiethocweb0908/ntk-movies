import { Controller, Get } from '@nestjs/common';
import { CountryService } from './country.service';
import { type CountryResponse } from '@workspace/shared/schema/country/country.response';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  async findAll(): Promise<CountryResponse[]> {
    return await this.countryService.findAll();
  }
}
