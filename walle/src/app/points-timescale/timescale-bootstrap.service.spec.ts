import {
  buildCreatePointsTimescaleHypertableSql,
  CREATE_POINTS_TIMESCALE_INDEXES_SQL,
  CREATE_POINTS_TIMESCALE_TABLE,
  CREATE_TIMESCALE_EXTENSIONS_SQL,
  ENABLE_POINTS_TIMESCALE_COMPRESSION_SQL,
  REMOVE_POINTS_TIMESCALE_COMPRESSION_POLICY_SQL,
  REMOVE_POINTS_TIMESCALE_RETENTION_POLICY_SQL,
} from '../database/constants/points-timescale.sql';
import { TimescaleBootstrapService } from './timescale-bootstrap.service';

describe('TimescaleBootstrapService', () => {
  const originalEnv = process.env;

  const buildService = () => {
    const queryRunner = {
      connect: jest.fn().mockResolvedValue(undefined),
      query: jest.fn().mockResolvedValue(undefined),
      release: jest.fn().mockResolvedValue(undefined),
    };
    const dataSource = {
      createQueryRunner: jest.fn().mockReturnValue(queryRunner),
    };

    const service = new TimescaleBootstrapService(dataSource as any);
    return { service, queryRunner, dataSource };
  };

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.TIMESCALE_CHUNK_MS;
    delete process.env.TIMESCALE_ENABLE_COMPRESSION;
    delete process.env.TIMESCALE_COMPRESSION_AFTER_DAYS;
    delete process.env.TIMESCALE_ENABLE_RETENTION;
    delete process.env.TIMESCALE_RETENTION_DAYS;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('runs default bootstrap with compression and no retention policy', async () => {
    const { service, queryRunner } = buildService();

    await service.bootstrap();

    const calls = queryRunner.query.mock.calls.map((call) => call[0] as string);

    expect(queryRunner.connect).toHaveBeenCalledTimes(1);
    expect(queryRunner.release).toHaveBeenCalledTimes(1);
    expect(calls[0]).toBe(CREATE_TIMESCALE_EXTENSIONS_SQL[0]);
    expect(calls[1]).toBe(CREATE_TIMESCALE_EXTENSIONS_SQL[1]);
    expect(calls[2]).toBe(CREATE_TIMESCALE_EXTENSIONS_SQL[2]);
    expect(calls).toContain(CREATE_POINTS_TIMESCALE_TABLE);
    expect(calls).toContain(
      buildCreatePointsTimescaleHypertableSql(86_400_000),
    );
    for (const indexQuery of CREATE_POINTS_TIMESCALE_INDEXES_SQL) {
      expect(calls).toContain(indexQuery);
    }
    expect(calls).toContain(ENABLE_POINTS_TIMESCALE_COMPRESSION_SQL);
    expect(
      calls.some((query) => query.includes('compress_after => 86400000')),
    ).toBe(true);
    expect(calls).toContain(REMOVE_POINTS_TIMESCALE_RETENTION_POLICY_SQL);
  });

  it('enables retention policy when configured', async () => {
    process.env.TIMESCALE_ENABLE_RETENTION = 'true';
    process.env.TIMESCALE_RETENTION_DAYS = '7';
    const { service, queryRunner } = buildService();

    await service.bootstrap();

    const calls = queryRunner.query.mock.calls.map((call) => call[0] as string);
    expect(
      calls.some((query) => query.includes('drop_after => 604800000')),
    ).toBe(true);
    expect(calls).not.toContain(REMOVE_POINTS_TIMESCALE_RETENTION_POLICY_SQL);
  });

  it('removes compression policy when disabled', async () => {
    process.env.TIMESCALE_ENABLE_COMPRESSION = 'false';
    const { service, queryRunner } = buildService();

    await service.bootstrap();

    const calls = queryRunner.query.mock.calls.map((call) => call[0] as string);
    expect(calls).toContain(REMOVE_POINTS_TIMESCALE_COMPRESSION_POLICY_SQL);
    expect(
      calls.some((query) => query.includes('add_compression_policy')),
    ).toBe(false);
  });

  it('falls back to defaults when numeric env values are invalid', async () => {
    process.env.TIMESCALE_CHUNK_MS = 'invalid';
    process.env.TIMESCALE_COMPRESSION_AFTER_DAYS = 'invalid';
    const { service, queryRunner } = buildService();

    await service.bootstrap();

    const calls = queryRunner.query.mock.calls.map((call) => call[0] as string);
    expect(calls).toContain(
      buildCreatePointsTimescaleHypertableSql(86_400_000),
    );
    expect(
      calls.some((query) => query.includes('compress_after => 86400000')),
    ).toBe(true);
  });

  it('releases query runner when bootstrap fails', async () => {
    const { service, queryRunner } = buildService();
    queryRunner.query.mockRejectedValueOnce(new Error('bootstrap failure'));

    await expect(service.bootstrap()).rejects.toThrow('bootstrap failure');
    expect(queryRunner.release).toHaveBeenCalledTimes(1);
  });
});
