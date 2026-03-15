import axios from 'axios';
import { prisma } from '../client';

export async function seedCountries() {
  console.log('Seed countries start');

  const res = await axios.get('https://ophim1.com/v1/api/quoc-gia');

  const countries = res.data.data.items;

  for (const country of countries) {
    await prisma.country.upsert({
      where: {
        externalId: country._id,
      },
      update: {
        name: country.name,
        slug: country.slug,
      },
      create: {
        externalId: country._id,
        name: country.name,
        slug: country.slug,
      },
    });
  }

  console.log('Seed countries done');
}
