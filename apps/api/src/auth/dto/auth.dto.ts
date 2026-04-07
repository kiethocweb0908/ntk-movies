import { createZodDto } from 'nestjs-zod';
import {
  RegisterSchema,
  ResendOTPSchema,
  VerifyOTPSchema,
  LoginSchema,
} from '@workspace/shared/schema/auth/auth.dto';

export class RegisterDto extends createZodDto(RegisterSchema) {}
export class VerifyOTPDto extends createZodDto(VerifyOTPSchema) {}
export class ResendOTPDto extends createZodDto(ResendOTPSchema) {}
export class LoginDto extends createZodDto(LoginSchema) {}
