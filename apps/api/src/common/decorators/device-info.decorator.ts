import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UAParser } from 'ua-parser-js';

export const GetDeviceInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    const forwardedIp = req.headers['x-forwarded-for'];
    const ipAddress = Array.isArray(forwardedIp)
      ? forwardedIp[0]
      : forwardedIp?.split(',')[0] || req.ip || '';

    const uaString = req.headers['user-agent'] || '';
    const parser = new UAParser(uaString);
    const uaResult = parser.getResult();

    return {
      device: uaResult.device.model || uaResult.os.name || 'Desktop',
      browser: uaResult.browser.name || 'Unknown',
      os: uaResult.os.name || 'Unknown',
      ipAddress,
    };
  },
);
