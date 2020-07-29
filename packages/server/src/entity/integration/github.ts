import Integration from './base';

interface GithubConfig {
  token: string;
}

class GithubIntegration extends Integration {
  public listDestinationOptions(): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
  public listOriginOptions(): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
  async listOptions() {
    return ['asd'];
  }
  getArtifact() {}

  publish() {}
}

export default GithubIntegration;
