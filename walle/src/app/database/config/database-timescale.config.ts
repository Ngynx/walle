import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { TIMESCALE_CONNECTION_NAME } from '../../../common/constants/database.constant';

export const getTimescaleDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  // Permite habilitar SSL sin cambiar código.
  const sslRaw = configService.get<string>('TIMESCALE_SSL');
  const sslEnabled = sslRaw === 'true';

  return {
    name: TIMESCALE_CONNECTION_NAME,
    type: 'postgres',
    // Si no existe TIMESCALE_*, usa POSTGRES_* como respaldo.
    host:
      configService.get<string>('TIMESCALE_HOST') ??
      configService.get<string>('POSTGRES_HOST'),
    port: Number(
      configService.get<string>('TIMESCALE_PORT') ??
        configService.get<string>('POSTGRES_PORT') ??
        5432,
    ),
    username:
      configService.get<string>('TIMESCALE_USER') ??
      configService.get<string>('POSTGRES_USER'),
    password:
      configService.get<string>('TIMESCALE_PASSWORD') ??
      configService.get<string>('POSTGRES_PASSWORD'),
    database:
      configService.get<string>('TIMESCALE_DB') ??
      configService.get<string>('POSTGRES_DB'),
    autoLoadEntities: true,
    synchronize: configService.get<string>('TIMESCALE_SYNC') === 'true',
    ssl: sslEnabled ? { rejectUnauthorized: false } : false,
    logging: false,
  };
};
