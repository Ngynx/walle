import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PartitionManagerService } from './app/points/partition-manager.service';
// import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true });
  // app.useLogger(app.get(Logger));

  //** POINTS entity */
  const partitionManager = app.get(PartitionManagerService);
  await partitionManager.createParentTableIfNotExists();
  await partitionManager.createPartitionForDate(new Date());
  await partitionManager.createPartitionForDate(new Date(Date.now() + 86_400_000));

  await app.listen(process.env.PORT ?? 3700);
}
bootstrap();
