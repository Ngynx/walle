export interface Mapper<TInput, TOutput> {
  map(input: TInput): TOutput;
}

export class GenericMapper<TInput, TOutput> implements Mapper<TInput, TOutput> {
  constructor(private readonly transform: (input: TInput) => TOutput) {}

  map(input: TInput): TOutput {
    return this.transform(input);
  }
}

export class GenericMapperWithExtras<TInput, TOutput, TExtras = unknown> {
  private readonly mapper: (input: TInput, extras: TExtras) => TOutput;

  constructor(mapper: (input: TInput, extras: TExtras) => TOutput) {
    this.mapper = mapper;
  }

  map(input: TInput, extras: TExtras): TOutput {
    return this.mapper(input, extras);
  }
}
