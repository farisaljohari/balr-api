import { registerAs } from '@nestjs/config';

export default registerAs(
  'auth-config',
  (): Record<string, any> => ({
    DEVICE_ID: process.env.DEVICE_ID,
    ACCESS_KEY: process.env.ACCESS_KEY,
    SECRET_KEY: process.env.SECRET_KEY,
  }),
);
