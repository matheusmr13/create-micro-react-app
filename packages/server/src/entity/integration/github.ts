import Integration from './base';

interface GithubConfig {
  token: string;
}

class GithubIntegration extends Integration {
  getArtifact() {
    const config: GithubConfig = this.config;
  }

  publish() {}
}

export default GithubIntegration;
