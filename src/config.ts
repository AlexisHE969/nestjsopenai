import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    mongodb: process.env.MONGO_URL,
  };
});
