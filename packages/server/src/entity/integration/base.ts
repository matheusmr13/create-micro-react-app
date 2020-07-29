export interface IIntegration {
  config: any;
  getArtifact(): void;
  publish(): void;
  listDestinationOptions(): Promise<string[]>;
  listOriginOptions(): Promise<string[]>;
}

abstract class Integration implements IIntegration {
  constructor(public config: any) {}

  public abstract getArtifact(): void;

  public abstract publish(): void;

  public abstract async listDestinationOptions(): Promise<string[]>;

  public abstract async listOriginOptions(): Promise<string[]>;
}

export default Integration;
