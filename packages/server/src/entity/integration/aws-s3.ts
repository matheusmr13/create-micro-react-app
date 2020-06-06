import Integration from './base';

interface AwsS3Config {
  token: string;
}

class AwsS3Integration extends Integration {
  getArtifact() {}

  publish() {}
}

export default AwsS3Integration;
