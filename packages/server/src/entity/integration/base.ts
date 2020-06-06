export enum TYPE {
  GITHUB_PAGES = 'GITHUB_PAGES',
  AWS_S3 = 'AWS_S3',
}

class Integration {
  constructor(protected config: any) {}

  public getArtifact() {
    throw new Error('Not implemented');
  }

  public publish() {
    throw new Error('Not implemented');
  }
}

export default Integration;
