import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/auth.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'identifier', passwordField: 'password' });
  }

  async validate(identifier: string, password: string) {
    return this.authService.validateUser(identifier, password);
  }
}
