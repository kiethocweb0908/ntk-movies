import { Module } from '@nestjs/common';
import { WatchTogetherService } from './watch-together.service';
import { WatchTogetherController } from './watch-together.controller';
import { WatchTogetherGateway } from './watch-together.gateway';
import { AuthModule } from '../auth/auth.module';
import { MoviesModule } from '../movies/movies.module';

@Module({
  imports: [AuthModule, MoviesModule],
  providers: [WatchTogetherService, WatchTogetherGateway],
  controllers: [WatchTogetherController],
})
export class WatchTogetherModule {}
