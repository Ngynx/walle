import * as dotenv from 'dotenv';
dotenv.config();

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CompressionCodecs, CompressionTypes } from 'kafkajs';
import { AppModule } from './app.module';
import { PartitionManagerService } from './app/points/partition-manager.service';
import { TimescaleBootstrapService } from './app/points-timescale/timescale-bootstrap.service';

// 1. REGISTRO INMEDIATO DE SNAPPY
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const snappy = require('kafkajs-snappy');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const snappyCodec = snappy.default || snappy;
  if (snappyCodec) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    CompressionCodecs[CompressionTypes.Snappy] = snappyCodec;
    console.log('Kafka Snappy codec registered successfully at startup.');
  }
} catch {
  console.warn(
    'No se pudo cargar kafkajs-snappy. Los mensajes comprimidos fallarán.',
  );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({ origin: true });

  // Configura el consumer Kafka dentro de la misma app Nest (modo hibrido HTTP + microservicio).
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.KAFKA_CLIENT_ID || 'walle-client',
        brokers: [
          `${process.env.KAFKA_BROKER_IP || 'localhost'}:${process.env.KAFKA_BROKER_PORT || '9092'}`,
        ],
      },
      consumer: {
        groupId: process.env.KAFKA_GROUP_ID || 'walle-consumer',
        sessionTimeout: 30000,
        heartbeatInterval: 3000,
        maxWaitTimeInMs: 5000,
        maxBytesPerPartition: 1048576,
        minBytes: 1,
        maxBytes: 10485760,
      },
      run: {
        autoCommit: true,
        autoCommitInterval: 5000,
        autoCommitThreshold: 100,
        partitionsConsumedConcurrently: 1,
      },
      subscribe: {
        fromBeginning: false,
      },
    },
  });

  // Prepara almacenamiento de puntos antes de iniciar el consumo Kafka.
  const pointsBackend = (process.env.POINTS_BACKEND ?? 'legacy').toLowerCase();
  if (pointsBackend === 'timescale') {
    // Timescale: crea extensiones, hypertable, indices y politicas.
    const timescaleBootstrap = app.get(TimescaleBootstrapService);
    await timescaleBootstrap.bootstrap();
  } else {
    // Legacy: crea tabla padre y particiones diarias.
    const partitionManager = app.get(PartitionManagerService);
    await partitionManager.createParentTableIfNotExists();
    await partitionManager.createPartitionForDate(new Date());
    await partitionManager.createPartitionForDate(
      new Date(Date.now() + 86_400_000),
    );
  }

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3700);
}

void bootstrap();
