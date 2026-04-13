import { SetMetadata } from '@nestjs/common';

export const NO_CHECK_TOKEN_KEY = 'noCheckToken';
export const NoCheckToken = () => SetMetadata(NO_CHECK_TOKEN_KEY, true);
