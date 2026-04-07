import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UAParser } from 'ua-parser-js';

export const GetDeviceInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const uaString = req.headers['user-agent'] || '';
    const parser = new UAParser(uaString);
    const uaResult = parser.getResult();

    return {
      device: uaResult.device.model || 'Desktop',
      browser: uaResult.browser.name || 'Unknown',
      os: uaResult.os.name || 'Unknown',
      ipAddress: req.ip || (req.headers['x-forwarded-for'] as string) || '',
    };
  },
);
