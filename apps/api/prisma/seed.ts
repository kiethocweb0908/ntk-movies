import { seedCountries } from './seed/seedCountries';
import { seedCategories } from './seed/seedCategories';
import { seedMovies } from './seed/seedMovies';

async function main() {
  await seedCountries();

  await seedCategories();

  await seedMovies();
}

main();
