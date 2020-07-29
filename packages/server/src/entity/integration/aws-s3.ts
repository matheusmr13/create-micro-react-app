import Integration from './base';
import AWS from 'aws-sdk';
import { mkdir, mv, rm } from '../../external/utils/fs';
import fs from 'fs';
import tar from 'tar-fs';
import zlib from 'zlib';
import mime from 'mime-types';
import { MicrofrontendDeployPath } from '../deploy/path';

interface AwsS3Config {
  token: string;
}

const s3 = new AWS.S3({ region: 'sa-east-1' });

class AwsS3Integration extends Integration {
  static async downloadArtifact(artifactPath: string, opts: { path: MicrofrontendDeployPath }) {
    const path = opts.path;
    const packageName = path.microfrontend.packageName;

    await mkdir(path.temp);
    const fileName = `${path.temp}/artifact.tar`;
    const folderToExtract = `${path.temp}/extracted`;

    const outputFile = fs.createWriteStream(fileName);
    await new Promise<any[]>((resolve, reject) => {
      s3.getObject(
        {
          Bucket: process.env.AWS_ARTIFACTS_BUCKET || '',
          Key: artifactPath,
        },
        function (error, data) {
          if (error != null) {
            reject(error);
            return;
          }
          outputFile.write(data.Body);
          outputFile.on('finish', () => {
            const readStream = fs.createReadStream(fileName);
            readStream.pipe(zlib.createGunzip()).pipe(tar.extract(folderToExtract));
            readStream.on('close', () => {
              resolve();
            });
          });
          outputFile.close();
        }
      );
    });
    await new Promise((resolve) => setTimeout(resolve, 500));
    await mkdir(path.downloadDestination);
    await rm(path.downloadDestination);
    await mv(`${folderToExtract}/${packageName}`, path.downloadDestination);
  }

  static async uploadFile(opts: { bucket: string; origin: string; dest: string }) {
    try {
      await s3
        .putObject({
          Bucket: opts.bucket,
          Key: opts.dest,
          Body: fs.readFileSync(opts.origin),
          ContentType: mime.contentType(opts.origin.split('/').slice(-1)[0]) || undefined,
        })
        .promise();
    } catch (e) {
      console.info(e);
    }
  }

  static getVersions(folderName: string, packageName: string) {
    const folderPath = `${folderName}${packageName}`;
    return new Promise<any[]>((resolve, reject) => {
      s3.listObjectsV2(
        {
          Bucket: process.env.AWS_ARTIFACTS_BUCKET || '',
          Prefix: folderPath,
        },
        (err, data) => {
          if (err) {
            console.log(err);
            reject(err);
            return;
          }
          const list = data.Contents || [];
          resolve(
            list.map((bucketItem) => ({
              path: bucketItem.Key,
              name: bucketItem.Key?.replace(`${folderPath}/`, '').replace('.tar.gz', ''),
            }))
          );
        }
      );
    });
  }

  getArtifact() {}

  publish() {}

  async listDestinationOptions() {
    return new Promise<string[]>((resolve, reject) => {
      s3.listBuckets(function (err, data) {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }
        const buckets = <any[]>(data.Buckets || []);
        const bucketList = buckets.map(({ Name }) => Name).filter((name: string) => !!name) || [];
        resolve(bucketList);
      });
    });
  }

  async listOriginOptions() {
    return new Promise<string[]>((resolve, reject) => {
      s3.listObjectsV2(
        {
          Bucket: process.env.AWS_ARTIFACTS_BUCKET || '',
          Delimiter: '/',
        },
        (err, data) => {
          if (err) {
            console.log(err);
            reject(err);
            return;
          }
          const list = data.CommonPrefixes || [];
          resolve(list.map((prefix) => <string>prefix.Prefix));
        }
      );
    });
  }
}

export default AwsS3Integration;
