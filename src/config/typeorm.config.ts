import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = {
  useFactory: async (config: ConfigService): Promise<TypeOrmModuleOptions> => ({
    type: 'postgres',
    host: config.get<string>('DB_HOST'),
    port: config.get<number>('DB_PORT'),
    username: config.get<string>('DB_USERNAME'),
    password: config.get<string>('DB_PASSWORD'),
    database: config.get<string>('DB_NAME'),
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: config.get<string>('NODE_ENV') !== 'production',
    logging: true,
  }),
  inject: [ConfigService],
};
