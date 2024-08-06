import { registerAs } from '@nestjs/config';

export default registerAs(
  'super-admin',
  (): Record<string, any> => ({
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
  }),
);
