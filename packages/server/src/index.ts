import App from './server';
import AWS from 'aws-sdk';

const { FIREBASE_ADMIN_CONFIG, FIREBASE_CONFIG, DATABASE_CONFIG, AWS_PROFILE, AWS_ARTIFACTS_BUCKET } = process.env;

if (AWS_PROFILE) {
  console.info(`Credentials on AWS set to ${AWS_PROFILE}`);
  var credentials = new AWS.SharedIniFileCredentials({ profile: AWS_PROFILE });
  AWS.config.credentials = credentials;
}

const configJson = {
  firebase: JSON.parse(FIREBASE_CONFIG!),
  firebaseAdmin: JSON.parse(FIREBASE_ADMIN_CONFIG!),
  database: JSON.parse(DATABASE_CONFIG!),
  baseUrl: '',
};

const run = async () => {
  App.withDatabase(configJson.database)
    .withFirebaseConfig({
      ...configJson.firebaseAdmin,
      private_key: JSON.parse(`"${configJson.firebaseAdmin.private_key}"`),
    })
    .customizeApp((app: any) => {
      app.get('/customized', (_: any, res: any) => res.send('Custom hello world!'));
    })
    .run(8080);
};

run();
