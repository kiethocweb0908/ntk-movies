import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { PrismaService } from '../prisma/prisma.service';
import {
  IntentSchema,
  IntentType,
} from '@workspace/shared/schema/chatbot/chatbot.dto';
import { ChatbotResponse } from '@workspace/shared/schema/chatbot/chatbot.response';
import { Prisma } from '@prisma/client';
import { MoviesService } from '../movies/movies.service';
import { MovieResponse } from '@workspace/shared/schema/movie/movie.response';

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
  private async getStructuredIntent(message: string): Promise<IntentType> {
    console.log('Đã vào phân tích');
    try {
      const res = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `
        Bối cảnh: Bạn là AI điều hướng cho web "NTK Phim".
              Nhiệm vụ: Phân tích câu hỏi của người dùng để trích xuất ý định tìm kiếm phim.
              
              QUY TẮC BẮT BUỘC:
              1. Nếu người dùng yêu cầu tìm phim, gợi ý phim, hoặc hỏi về bất kỳ thể loại/quốc gia/năm nào (Vd: "tìm phim Hàn", "phim tình cảm", "phim hành động Mỹ"), bạn PHẢI trả về intent: "movie_search".
              2. Nếu là chào hỏi xã giao hoặc hỏi những thứ không liên quan đến tìm phim, trả về intent: "normal_chat".
              3. Đối với "keyword", hãy trích xuất tên phim hoặc từ khóa chính. Nếu người dùng hỏi chung chung về thể loại, hãy để keyword là null và điền vào các trường genre, country...

        Phân tích câu người dùng  và trả về JSON theo format:

        {
        "intent": "movie_search" | "normal_chat",
        "keyword": string,
        "genre": string,
        "country": string,
        "year": number,
        "type": "single" | "series" | "hoathinh"
        }
        Chỉ trả về JSON, không giải thích.
        Message: "${message}" `,
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

  // Điều kiện truy vấn
  private async buildMovieQuery(intent: IntentType) {
    const where: Prisma.MovieWhereInput = { published: true };

    if (intent.keyword) {
      where.OR = [
        { name: { contains: intent.keyword, mode: 'insensitive' } },
        { originName: { contains: intent.keyword, mode: 'insensitive' } },
        { content: { contains: intent.keyword, mode: 'insensitive' } },
      ];
    }
    if (intent.type) where.type = intent.type;
    if (intent.year) where.year = intent.year;

    // Query quan hệ n-n (Category và Country)
    if (intent.genre) {
      where.categories = {
        some: {
          category: { name: { contains: intent.genre, mode: 'insensitive' } },
        },
      };
    }
    if (intent.country) {
      where.countries = {
        some: {
          country: { name: { contains: intent.country, mode: 'insensitive' } },
        },
      };
    }

    return where;
  }

  // Tìm phim
  private async searchMovie(intent: IntentType): Promise<MovieResponse[]> {
    const where = await this.buildMovieQuery(intent);

    const movies = await this.prisma.movie.findMany({
      where,
      take: 5,
      orderBy: {
        viewCount: 'desc',
      },
      select: this.moviesService.select,
    });

    const formatMovies = this.moviesService.formatMovie(movies);
    return formatMovies;
  }

  // Format response AI
  private async formatMovieText(movies: MovieResponse[]) {
    try {
      const res = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `
        Dựa vào danh sách phim sau, hãy viết lời gợi ý tự nhiên:

        ${JSON.stringify(movies.slice(0, 5))}

        Ngắn gọn nhất có thể, thân thiện. `,
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
        model: 'gemini-3-flash-preview',
        contents: `
        Bạn là trợ lý cho trang web xem phim trực tuyến NTK Phim.
        Message: ${message}`,
      });

      return res.text;
    } catch {
      return 'Có lỗi xảy ra 😢';
    }
  }

  // Hàm xử lý chính
  async handleChat(message: string): Promise<ChatbotResponse> {
    const intent = await this.getStructuredIntent(message);
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

      const text = await this.formatMovieText(movies);

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
