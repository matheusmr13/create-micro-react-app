import { v4 as uuidv4 } from 'uuid';
import { getTree, downloadTree, uploadTree } from '../github/client';
import User from 'user/user';
import Microfrontend from 'microfrontend/model';
import Version from 'version/model';
import PackageAll from 'external/package-folder';
import getTreeFromFolder from 'external/list-folder';
import Application from './model';

const deploy = async (versionPerMicrofrontend: any, user: User, application: Application) => {
  console.info(versionPerMicrofrontend);
  const a = await Promise.all(
    Object.entries(versionPerMicrofrontend).map(async ([microfrontendId, versionId]) => {
      if (typeof versionId !== 'string') return;

      const [microfrontend] = await Microfrontend.find(microfrontendId);
      const [version] = await Version.find(versionId);
      return {
        microfrontend,
        version,
      };
    })
  );

  const randomUuid = uuidv4();

  const dest = `/tmp/${randomUuid}`;

  await Promise.all(
    a.map(async (m) => {
      if (!m) return;
      const { microfrontend, version } = m;

      if (!microfrontend || !version) return;

      const tree = await getTree(microfrontend.githubId, version.sha, user);
      console.info(tree);

      await downloadTree(`${dest}/builds/${microfrontend.packageName}`, tree, user);
    })
  );

  await PackageAll({ rootFolder: dest });

  const tree = await getTreeFromFolder(`${dest}/build`);
  await uploadTree(application.githubId, tree, user, 'my versiion');
};

export default deploy;
