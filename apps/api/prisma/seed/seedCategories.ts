import axios from 'axios';
import { prisma } from '../client';

export async function seedCategories() {
  console.log('Seed categories start');
  const res = await axios.get('https://ophim1.com/v1/api/the-loai');

  let categories = res.data.data.items;

  categories = categories.filter(
    (c: any) => c._id !== '6242b89cc78eb57bbfe29f91',
  );

  for (const cate of categories) {
    // if (cate.slug === 'phim-18') continue;

    await prisma.category.upsert({
      where: {
        externalId: cate._id,
      },
      update: {
        name: cate.name,
        slug: cate.slug,
      },
      create: {
        externalId: cate._id,
        name: cate.name,
        slug: cate.slug,
      },
    });
  }

  console.log('Seed categories done');
}
