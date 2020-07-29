import GithubIntegration from './github';
import AwsS3Integration from './aws-s3';

export enum INTEGRATION_TYPE {
  GITHUB = 'GITHUB',
  AWS_S3 = 'AWS_S3',
}

export const INTEGRATION_TYPE_CLASS = {
  [INTEGRATION_TYPE.GITHUB]: GithubIntegration,
  [INTEGRATION_TYPE.AWS_S3]: AwsS3Integration,
};
