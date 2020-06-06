import axios from 'axios';
import User from '../entity/user-extra';
import Application from '../entity/application';
import { default as filesystem } from 'fs';

import { Octokit } from '@octokit/rest';
import octokat from 'github/octokat';

const { promises: fs } = filesystem;

export const getGithubRepository = (repositoryName: string) => {
  return axios(`https://api.github.com/repos/${repositoryName}`).then((response: any) => response.data);
};

export const getFoldersFromGithub = async (url: string, user: User) => {
  return axios({
    method: 'GET',
    url: `https://api.github.com${url}?ref=versions`,
    headers: {
      Authorization: `token ${user.githubToken}`,
    },
  }).then((response: any) => response.data);
};

export const getBranch = async (repo: string, branch: string, user: User) => {
  return axios({
    method: 'GET',
    url: `https://api.github.com/repos/${repo}/branches/${branch}`,
    headers: {
      Authorization: `token ${user.githubToken}`,
    },
  }).then((response: any) => response.data);
};

export const getTree = async (repo: string, treeSha: string, user: User) => {
  return axios({
    method: 'GET',
    url: `https://api.github.com/repos/${repo}/git/trees/${treeSha}?recursive=true`,
    headers: {
      Authorization: `token ${user.githubToken}`,
    },
  }).then((response: any) => response.data);
};

export const downloadTree = async (path: string, tree: any, user: User) => {
  for (var i = 0; i < tree.tree.length; i++) {
    const object = tree.tree[i];

    if (object.type === 'blob') {
      const { data } = await axios({
        url: object.url,
        headers: {
          Authorization: `token ${user.githubToken}`,
        },
      });

      const filePath = `${path}/${object.path}`;
      const folderPath = filePath.substring(0, filePath.lastIndexOf('/'));
      await fs.mkdir(folderPath, { recursive: true });
      await fs.writeFile(filePath, data.content, { encoding: 'base64' });
    }
  }
};

export const uploadTree = async (githubId: string, tree: any, user: User, version: string) => {
  const a = await octokat({
    username: githubId.split('/')[0],
    reponame: githubId.split('/')[1],
    token: user.githubToken,
    branchName: 'gh-pages',
  }).commit(
    tree.map((t: any) => ({
      path: t.path,
      content: t.content,
    })),
    'my commit'
  );
};
