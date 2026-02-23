import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AUTHSOFTWARE_SERVER_DB_NAME,
  DELTA_DISPATCH_DB_NAME,
  ROBIN_SERVER_DB_NAME,
  TIMESCALE_CONNECTION_NAME,
} from 'src/common/constants/database.constant';
import { getPostgresDatabaseConfig } from './config/database-postgresql.config';
import { getTimescaleDatabaseConfig } from './config/database-timescale.config';
import * as crypto from 'crypto';

// Expone crypto global para compatibilidad con TypeORM en Node.js v18.
if (typeof (globalThis as any).crypto === 'undefined') {
  (globalThis as any).crypto = crypto;
}

@Global()
@Module({})
export class DatabaseModule {
  // Conexion SQL actual (PostgreSQL particionado manual).
  static forLegacyPointsApplication(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: getPostgresDatabaseConfig,
        }),
      ],
      exports: [TypeOrmModule],
    };
  }

  // Conexion SQL para el modulo points-timescale.
  static forTimescalePointsApplication(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          name: TIMESCALE_CONNECTION_NAME,
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: getTimescaleDatabaseConfig,
        }),
      ],
      exports: [TypeOrmModule],
    };
  }

  static forDeltaDispatchApplication(_uri: string): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        MongooseModule.forRoot(_uri, {
          connectionName: DELTA_DISPATCH_DB_NAME,
        }),
      ],
      exports: [MongooseModule],
    };
  }

  static forAuthSoftwareApplication(_uri: string): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        MongooseModule.forRoot(_uri, {
          connectionName: AUTHSOFTWARE_SERVER_DB_NAME,
        }),
      ],
      exports: [MongooseModule],
    };
  }

  static forRobinApplication(_uri: string): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [MongooseModule.forRoot(_uri, { connectionName: ROBIN_SERVER_DB_NAME })],
      exports: [MongooseModule]
    }
  };
}
