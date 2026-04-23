import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
// import { JwtStrategy } from './strategies/jwt.strategy';
import { MailModule } from '../mail/mail.module';
import { ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './strategies/google.strategy';
import { FavoriteModule } from '../favorite/favorite.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '15m',
        },
      }),
    }),
    MailModule,
    FavoriteModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
