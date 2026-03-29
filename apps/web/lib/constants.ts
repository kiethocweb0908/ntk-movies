export const MOVIE_TYPES = [
  { name: "Thể loại", slug: "the-loai" },
  { name: "Quốc gia", slug: "quoc-gia" },
  { name: "Phim lẻ", slug: "phim-le" },
  { name: "Phim bộ", slug: "phim-bo" },
  { name: "Phim hoạt hình", slug: "phim-hoat-hinh" },
  { name: "Xem chung", slug: "xem-chung" },
]

export const MOVIE_TYPES_FILTER = [
  { name: "Phim lẻ", slug: "single" },
  { name: "Phim bộ", slug: "series" },
  { name: "Phim hoạt hình", slug: "hoathinh" },
]

export const MOVIE_SORT_FILTER = [
  { name: "Mới nhất", slug: "createdAt" },
  { name: "Lượt xem", slug: "viewCount" },
]

const currentYear = new Date().getFullYear()
export const MOVIE_YEARS_FILTER = Array.from(
  { length: currentYear - 1940 + 1 },
  (_, i) => (currentYear - i).toString()
)
