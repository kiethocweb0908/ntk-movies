import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { ConfigModule } from '@nestjs/config';
import { CountryModule } from './country/country.module';
import { MoviesModule } from './movies/movies.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { APP_GUARD } from '@nestjs/core';
import { AppAuthGuard } from './common/guards/app-at.guard';
import { ChatbotModule } from './chatbot/chatbot.module';
import { HistoryModule } from './history/history.module';
import { FavoriteModule } from './favorite/favorite.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    CategoryModule,
    CountryModule,
    MoviesModule,
    AuthModule,
    MailModule,
    ChatbotModule,
    HistoryModule,
    FavoriteModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: AppAuthGuard,
    // },
  ],
})
export class AppModule {}
