import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './app/user/user.module';
import { AuthModule } from './app/auth/auth.module';
import { DatabaseModule } from './app/database/database.module';
import { PointsModule } from './app/points/points.module';
import { PointsTimescaleModule } from './app/points-timescale/points-timescale.module';
// import { LoggerModule } from 'nestjs-pino';

const pointsBackend = (process.env.POINTS_BACKEND ?? 'legacy').toLowerCase();

// Selecciona la conexion SQL segun el backend de puntos.
const pointsSqlDatabaseModule =
  pointsBackend === 'timescale'
    ? DatabaseModule.forTimescalePointsApplication()
    : DatabaseModule.forLegacyPointsApplication();

// Selecciona el modulo de negocio que procesara points.
const pointsFeatureModule =
  pointsBackend === 'timescale' ? PointsTimescaleModule : PointsModule;

@Module({
  imports: [
    //** Dotenv */
    ConfigModule.forRoot({
      load: [],
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    ScheduleModule.forRoot(),
    // LoggerModule.forRoot({
    //   pinoHttp: {
    //     autoLogging: false,
    //     transport: {
    //       target: 'pino-pretty',
    //       options: {
    //         colorize: true,
    //         translateTime: 'SYS:standard',
    //         ignore: 'req,res,headers'
    //       },
    //     }
    //   }
    // }),

    //** DATABASE */
    DatabaseModule.forDeltaDispatchApplication(
      process.env.MONGO_DELTA_DISPATCH_URI!,
    ),
    DatabaseModule.forAuthSoftwareApplication(
      process.env.MONGO_AUTHSOFTWARE_URI!,
    ),
    pointsSqlDatabaseModule,

    UserModule,
    AuthModule,
    pointsFeatureModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
