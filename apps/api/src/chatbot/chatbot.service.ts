import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { PrismaService } from '../prisma/prisma.service';
import {
  ChatBotType,
  IntentSchema,
  IntentType,
} from '@workspace/shared/schema/chatbot/chatbot.dto';
import { ChatbotResponse } from '@workspace/shared/schema/chatbot/chatbot.response';
import { Prisma } from '@prisma/client';
import { MoviesService } from '../movies/movies.service';
import { MovieResponse } from '@workspace/shared/schema/movie/movie.response';
import slugify from 'slugify';

@Injectable()
export class ChatbotService {
  private ai: GoogleGenAI;

  constructor(
    private readonly prisma: PrismaService,
    private readonly moviesService: MoviesService,
  ) {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  // Phân tích câu hỏi của user thành dữ liệu có cấu trúc
  private async getStructuredIntent({
    message,
    history,
  }: ChatBotType): Promise<IntentType> {
    console.log('Đã vào phân tích');
    try {
      const res = await this.ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-preview',
        contents: ` Bạn là AI điều hướng cho web NTK Phim. 
        Lịch sử trò chuyện: ${JSON.stringify(history)} 
        Tin nhắn mới: "${message}" 
        Nhiệm vụ: 
        - Xác định người dùng đang chat bình thường hay tìm phim 
        - Sửa lỗi chính tả 
        - Chuẩn hóa tên phim 
        - Chuẩn hóa thể loại 
        - Chuẩn hóa quốc gia 
        - Xác định mood hoặc theme nếu có 
        - Nếu người dùng hỏi top phim, trending phim, phim nổi bật, phim hay nhất thì đặt isTopQuery = true 
        Ví dụ: 
        "hành đọng mỹ" -> normalizedGenre: "hành động" 
        "ha canh noi anh" -> normalizedKeyword: "Hạ Cánh Nơi Anh" 
        "hôm nay tui buồn" -> mood: "buồn" 
        "phim sinh tồn" -> theme: "sinh tồn" 
        "top phim hàn quốc" -> isTopQuery: true 
        Chỉ trả JSON đúng format: 
        { 
          "intent": "movie_search" | "normal_chat", 
          "keyword": string | null, 
          "normalizedKeyword": string | null, 
          "genre": string | null, 
          "normalizedGenre": string | null, 
          "country": string | null, 
          "normalizedCountry": string | null, 
          "mood": string | null, 
          "theme": string | null, 
          "year": number | null, 
          "type": "single" | "series" | "hoathinh" | null, 
          "isTopQuery": boolean 
          } `,
        config: { responseMimeType: 'application/json' },
      });

      const text = res.text?.trim();
      if (!text) return { intent: 'normal_chat' };
      console.log(text);

      const parsed = JSON.parse(text);
      console.log(parsed);
      console.log('Ai đã phân tích: ', res);

      return IntentSchema.parse(parsed);
    } catch (error) {
      console.error('Lỗi phân tích Intent:', error);
      return { intent: 'normal_chat' };
    }
  }

  private readonly moodMap: Record<string, string[]> = {
    buon: ['Tình Cảm', 'Gia Đình', 'Chữa Lành'],
    co_don: ['Tâm Lý', 'Chữa Lành'],
    vui: ['Hài Hước', 'Phiêu Lưu'],
    hoi_hop: ['Hành Động', 'Kinh Dị', 'Trinh Thám'],
  };

  private readonly themeMap: Record<string, string[]> = {
    sinh_ton: ['survival', 'zombie', 'thảm họa', 'hậu tận thế', 'đảo hoang'],
    hoc_duong: ['school', 'Học Đường', 'Thanh Xuân'],
    chua_lanh: ['healing', 'Gia Đình', 'Tâm Lý'],
  };

  // Điều kiện truy vấn
  private async buildMovieQuery(intent: IntentType) {
    const where: Prisma.MovieWhereInput = { published: true };

    const keyword = intent.normalizedKeyword || intent.keyword || '';
    const genre = intent.normalizedGenre || intent.genre || undefined;
    const country = intent.normalizedCountry || intent.country || undefined;

    if (keyword) {
      const slugKeyword = slugify(keyword, {
        lower: true,
        strict: true,
        locale: 'vi',
      });

      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { slug: { contains: slugKeyword, mode: 'insensitive' } },
        { originName: { contains: keyword, mode: 'insensitive' } },
        { alternativeNames: { hasSome: [keyword] } },
        { content: { contains: keyword, mode: 'insensitive' } },
      ];
    }
    if (intent.type) where.type = intent.type;
    if (intent.year) where.year = intent.year;

    if (genre) {
      const slugGenre = slugify(genre, {
        lower: true,
        strict: true,
        locale: 'vi',
      });
      where.categories = {
        some: {
          category: {
            OR: [
              { name: { contains: genre, mode: 'insensitive' } },
              { slug: { contains: slugGenre, mode: 'insensitive' } },
            ],
          },
        },
      };
    }
    if (country) {
      const slugCountry = slugify(country, {
        lower: true,
        strict: true,
        locale: 'vi',
      });
      where.countries = {
        some: {
          country: {
            OR: [
              { name: { contains: country, mode: 'insensitive' } },
              { slug: { contains: slugCountry, mode: 'insensitive' } },
            ],
          },
        },
      };
    }

    const andConditions: Prisma.MovieWhereInput[] = [];
    if (intent.theme) {
      const themeKey = slugify(intent.theme, { lower: true, replacement: '_' });
      const themeKeywords = this.themeMap[themeKey] || [];
      if (themeKeywords.length > 0) {
        andConditions.push({
          OR: themeKeywords.map((k) => ({
            OR: [
              { name: { contains: k, mode: 'insensitive' } },
              { content: { contains: k, mode: 'insensitive' } },
            ],
          })),
        });
      }
    }

    if (intent.mood) {
      const moodKey = slugify(intent.mood, { lower: true, replacement: '_' });
      const mappedGenres = this.moodMap[moodKey] || [];
      if (mappedGenres.length > 0) {
        andConditions.push({
          categories: { some: { category: { name: { in: mappedGenres } } } },
        });
      }
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    return where;
  }

  // Tìm phim
  private async searchMovie(intent: IntentType): Promise<MovieResponse[]> {
    const where = await this.buildMovieQuery(intent);

    const orderBy: Prisma.MovieOrderByWithRelationInput[] = intent.isTopQuery
      ? [
          { viewCount: 'desc' },
          { imdb_vote_average: 'desc' },
          { tmdb_vote_average: 'desc' },
        ]
      : [{ viewCount: 'desc' }];

    const movies = await this.prisma.movie.findMany({
      where,
      take: 5,
      orderBy,
      select: this.moviesService.select,
    });

    const formatMovies = this.moviesService.formatMovie(movies);
    return formatMovies;
  }

  // Format response AI
  private async formatMovieText(movies: MovieResponse[], intent: IntentType) {
    try {
      const res = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `
        Dựa vào danh sách phim sau, hãy viết lời gợi ý tự nhiên:
        ${JSON.stringify(movies.slice(0, 5))}

        Các dữ liệu từ khoá đã có:
         ${JSON.stringify(intent)}

        Ngắn gọn nhất có thể, thân thiện. 
        không cần liệt kê các tên phim, chỉ cần bảo tui tìm được các phim theo yêu cầu của bạn. 
        Hỏi thêm người dùng các từ khoá như quốc gia, thể loại,.. (các trường mà chưa có á) để tìm chính xác hơn `,
      });

      return res.text;
    } catch {
      return 'Mình tìm được vài phim hay cho bạn 🎬';
    }
  }

  // Chat thường
  private async normalChat(message: string) {
    try {
      const res = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `
        Bạn là trợ lý cho trang web xem phim trực tuyến NTK Phim.
        Hãy trò truyện với người dùng lịch sự thân thiện, trả lời ngắn gọn thôi.
        Message: ${message}`,
      });

      return res.text;
    } catch {
      return 'Có lỗi xảy ra 😢';
    }
  }

  // Hàm xử lý chính
  async handleChat({
    message,
    history,
  }: ChatBotType): Promise<ChatbotResponse> {
    const intent = await this.getStructuredIntent({ message, history });
    console.log('intent: ', intent);

    // Tìm phim
    if (intent.intent === 'movie_search') {
      console.log('Tìm phim');
      const movies = await this.searchMovie(intent);

      if (!movies.length) {
        return {
          type: 'text',
          message: 'Không tìm thấy phim phù hợp 😢',
        };
      }

      const text = await this.formatMovieText(movies, intent);

      return {
        type: 'movie',
        message: text || 'Không tìm thấy phim theo yêu cầu!',
        movies,
      };
    }

    // chat thường
    console.log('Chat thường');
    const text = await this.normalChat(message);
    return {
      type: 'text',
      message: text || 'Có lỗi xảy ra!',
    };
  }
}
