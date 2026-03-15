import axios from 'axios';
import { prisma } from '../client';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function seedMovies() {
  console.log('Seed movies start');

  const LIMIT = 500;
  const firstRes = await axios.get(
    `https://ophim1.com/v1/api/danh-sach/phim-moi-cap-nhat?page=1&limit=${LIMIT}`,
  );
  const { totalItems } = firstRes.data.data.params.pagination;
  const totalPages = Math.ceil(totalItems / LIMIT);

  for (let page = 1; page <= totalPages; page++) {
    console.log(`\n📦 ĐANG XỬ LÝ TRANG: ${page}/${totalPages}`);
    const res = await axios.get(
      `https://ophim1.com/v1/api/danh-sach/phim-moi-cap-nhat?page=${page}&limit=${LIMIT}&sort_type=asc`,
    );

    const moviesList = res.data.data.items;

    for (const movie of moviesList) {
      try {
        const exists = await prisma.movie.findUnique({
          where: { externalId: movie._id },
          select: { id: true },
        });

        if (exists) {
          console.log('⏭️ Movie exists, skip:', movie.slug);
          continue;
        }

        console.log('Fetching movie:', movie.slug);
        const detail = await axios.get(
          `https://ophim1.com/v1/api/phim/${movie.slug}`,
        );
        const item = detail.data.data.item;

        // Check 18+
        const is18Plus = item.category.some(
          (cat: any) => cat.slug === 'phim-18' || cat.name.includes('18+'),
        );
        if (is18Plus) {
          console.log(`🚫 Bỏ qua phim người lớn: ${item.name}`);
          continue;
        }

        await prisma.movie.create({
          data: {
            externalId: item._id,
            name: item.name,
            originName: item.origin_name,
            content: item.content,
            type: item.type,
            status: item.status,
            thumbUrl: item.thumb_url,
            is_copyrigh: item.is_copyright,
            trailerUrl: item.trailer_url,
            time: item.time,
            episodeCurrent: item.episode_current,
            episodeTotal: item.episode_total,
            quality: item.quality,
            lang: item.lang,
            notify: item.notify || '',
            showtimes: item.showtimes,
            slug: item.slug,
            year: item.year,
            viewCount: item.view,
            chieurap: item.chieurap,
            posterUrl: item.poster_url,
            sub_docquyen: item.sub_docquyen,
            alternativeNames: item.alternative_names || [],
            lang_key: item.lang_key ? item.lang_key : ['vs'],

            tmdbType: item.tmdb.type,
            tmdbId: item.tmdb.id,
            tmdbSeason: item.tmdb.season,
            tmdb_vote_average: item.tmdb.vote_average,
            tmdb_vote_count: item.tmdb.vote_count,

            imdbId: item.imdb.id,
            imdb_vote_average: item.imdb.vote_average,
            imdb_vote_count: item.imdb.vote_count,

            // 1. Kết nối Categories (Mối quan hệ n-n)
            categories: {
              create: item.category.map((cat: any) => ({
                category: { connect: { externalId: cat.id } },
              })),
            },

            // 2. Kết nối Countries (Mối quan hệ n-n)
            countries: {
              create: item.country.map((c: any) => ({
                country: { connect: { externalId: c.id } },
              })),
            },

            // 3. Tạo Server và Episode lồng nhau (Tránh N+1 cực hiệu quả ở đây)
            servers: {
              create: item.episodes.map((server: any) => ({
                name: server.server_name,
                isAi: server.is_ai || false,
                episodes: {
                  create: server.server_data.map((ep: any) => ({
                    name: ep.name,
                    slug: ep.slug,
                    fileName: ep.filename,
                    linkEmbed: ep.link_embed,
                    linkM3u8: ep.link_m3u8,
                  })),
                },
              })),
            },
          },
        });

        if (item.actor.length || item.director.length) {
          const movieFromDb = await prisma.movie.findUnique({
            where: { slug: item.slug },
          });
          if (movieFromDb) await seedPeople(item.slug, movieFromDb.id);
        }

        await delay(200);
      } catch (error) {
        console.error(`❌ Lỗi tại ${movie.slug}:`, error.message);
      }
    }
  }
  console.log('Seed movies done');
}

async function connectCategory(movieId: string, categories: any[]) {
  for (const cate of categories) {
    const category = await prisma.category.findFirst({
      where: { slug: cate.slug },
    });

    if (!category) continue;

    await prisma.movieCategory.upsert({
      where: {
        categoryId_movieId: {
          movieId,
          categoryId: category.id,
        },
      },
      update: {},
      create: {
        movieId,
        categoryId: category.id,
      },
    });
  }
}

async function connectCountry(movieId: string, countries: any[]) {
  for (const c of countries) {
    const country = await prisma.country.findFirst({
      where: { slug: c.slug },
    });

    if (!country) continue;

    await prisma.movieCountry.upsert({
      where: {
        countryId_movieId: {
          movieId,
          countryId: country.id,
        },
      },
      update: {},
      create: {
        movieId,
        countryId: country.id,
      },
    });
  }
}

// async function saveEpisodes(movieId: string, episodes: any[]) {
//   for (const server of episodes) {
//     const createdServer = await prisma.server.upsert({
//       where: {
//         movieId_name: {
//           movieId,
//           name: server.server_name,
//         },
//       },
//       update: {
//         isAi: server.is_ai,
//       },
//       create: {
//         name: server.server_name,
//         movieId,
//         isAi: server.is_ai,
//       },
//     });

//     for (const ep of server.server_data) {
//       await prisma.episode.upsert({
//         where: {
//           serverId_slug: {
//             serverId: createdServer.id,
//             slug: ep.slug,
//           },
//         },
//         update: {
//           name: ep.name,
//           fileName: ep.filename,
//           linkEmbed: ep.link_embed,
//           linkM3u8: ep.link_m3u8,
//         },
//         create: {
//           serverId: createdServer.id,
//           slug: ep.slug,
//           name: ep.name,
//           fileName: ep.filename,
//           linkEmbed: ep.link_embed,
//           linkM3u8: ep.link_m3u8,
//         },
//       });
//     }
//   }
// }

async function seedPeople(slug: string, movieId: string) {
  try {
    const res = await axios.get(
      `https://ophim1.com/v1/api/phim/${slug}/peoples`,
    );

    const peoples = res.data?.data?.peoples || [];

    for (const p of peoples) {
      const actor = await prisma.actor.upsert({
        where: {
          tmdb_people_id: p.tmdb_people_id,
        },
        update: {
          name: p.name,
          gender: p.gender,
          originalName: p.original_name,
          profile_path: p.profile_path,
          also_known_as: p.also_known_as || [],
        },
        create: {
          tmdb_people_id: p.tmdb_people_id,
          name: p.name,
          gender: p.gender,
          originalName: p.original_name,
          profile_path: p.profile_path,
          also_known_as: p.also_known_as || [],
        },
      });

      await prisma.movieActor.upsert({
        where: {
          movieId_actorId: {
            movieId,
            actorId: actor.id,
          },
        },
        update: {
          character: p.character,
          role: p.known_for_department || 'Acting',
        },
        create: {
          movieId,
          actorId: actor.id,
          character: p.character,
          role: p.known_for_department || 'Acting',
        },
      });
    }
  } catch (error) {
    console.log(
      `People API failed for ${slug}:`,
      'status: ',
      error?.response?.status,
      'error: ',
      error?.response?.message,
    );
  }
}

//---------

// const detail = await axios.get(
//   `https://ophim1.com/v1/api/phim/${movie.slug}`,
// );

// const item = detail.data.data.item;

// const createdMovie = await prisma.movie.upsert({
//   where: {
//     externalId: item._id,
//   },
//   update: {
//     name: item.name,
//     originName: item.origin_name,
//     content: item.content,
//     type: item.type,
//     status: item.status,
//     thumbUrl: item.thumb_url,
//     is_copyrigh: item.is_copyright,
//     trailerUrl: item.trailer_url,
//     time: item.time,
//     episodeCurrent: item.episode_current,
//     episodeTotal: item.episode_total,
//     quality: item.quality,
//     lang: item.lang,
//     notify: item.notify || '',
//     showtimes: item.showtimes,
//     slug: item.slug,
//     year: item.year,
//     viewCount: item.view,
//     chieurap: item.chieurap,
//     posterUrl: item.poster_url,
//     sub_docquyen: item.sub_docquyen,
//     alternativeNames: item.alternative_names,
//     lang_key: item.lang_key,

//     tmdbType: item.tmdb.type,
//     tmdbId: item.tmdb.id,
//     tmdbSeason: item.tmdb.season,
//     tmdb_vote_average: item.tmdb.vote_average,
//     tmdb_vote_count: item.tmdb.vote_count,

//     imdbId: item.imdb.id,
//     imdb_vote_average: item.imdb.vote_average,
//     imdb_vote_count: item.imdb.vote_count,
//   },
//   create: {
//     externalId: item._id,
//     name: item.name,
//     originName: item.origin_name,
//     content: item.content,
//     type: item.type,
//     status: item.status,
//     thumbUrl: item.thumb_url,
//     is_copyrigh: item.is_copyright,
//     trailerUrl: item.trailer_url,
//     time: item.time,
//     episodeCurrent: item.episode_current,
//     episodeTotal: item.episode_total,
//     quality: item.quality,
//     lang: item.lang,
//     notify: item.notify || '',
//     showtimes: item.showtimes,
//     slug: item.slug,
//     year: item.year,
//     viewCount: item.view,
//     chieurap: item.chieurap,
//     posterUrl: item.poster_url,
//     sub_docquyen: item.sub_docquyen,
//     alternativeNames: item.alternative_names,
//     lang_key: item.lang_key,

//     tmdbType: item.tmdb.type,
//     tmdbId: item.tmdb.id,
//     tmdbSeason: item.tmdb.season,
//     tmdb_vote_average: item.tmdb.vote_average,
//     tmdb_vote_count: item.tmdb.vote_count,

//     imdbId: item.imdb.id,
//     imdb_vote_average: item.imdb.vote_average,
//     imdb_vote_count: item.imdb.vote_count,
//   },
// });

// // await connectCategory(createdMovie.id, item.category);
// // await connectCountry(createdMovie.id, item.country);
// // await saveEpisodes(createdMovie.id, item.episodes);

// if (item.actor.length || item.director.length) {
//   await seedPeople(item.slug, createdMovie.id);
// }
