import { registerAs } from '@nestjs/config';

export default registerAs(
  'tuya-config',
  (): Record<string, any> => ({
    TUYA_ACCESS_ID: process.env.TUYA_ACCESS_ID,
    TUYA_ACCESS_KEY: process.env.TUYA_ACCESS_KEY,
    TUYA_EU_URL: process.env.TUYA_EU_URL,
    TRUN_ON_TUYA_SOCKET:
      process.env.TRUN_ON_TUYA_SOCKET === 'true' ? true : false,
  }),
);
