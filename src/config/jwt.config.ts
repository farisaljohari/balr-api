import { registerAs } from '@nestjs/config';

export default registerAs(
  'jwt',
  (): Record<string, any> => ({
    secret: process.env.JWT_SECRET,
    expire_time: process.env.JWT_EXPIRE_TIME,
    secret_refresh: process.env.JWT_SECRET_REFRESH,
    expire_refresh: process.env.JWT_EXPIRE_TIME_REFRESH,
  }),
);
