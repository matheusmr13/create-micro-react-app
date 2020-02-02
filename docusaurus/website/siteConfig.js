/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const users = [
  {
    caption: 'Matheus',
    image: 'https://avatars3.githubusercontent.com/u/6358674?s=460&v=4',
    infoLink: 'https://github.com/matheusmr13',
    pinned: true,
  },
];

const siteConfig = {
  title: 'Create Microfrontend React App',
  tagline: 'Create a microfrontend architecture as simple as CRA.',
  url: 'https://matheusmr13.github.io/',
  baseUrl: '/create-microfrontend-react-app/',
  repoUrl: 'https://github.com/matheusmr13/create-microfrontend-react-app',
  projectName: 'create-microfrontend-react-app',
  organizationName: 'matheusmr13',

  users,
  headerLinks: [
    {doc: 'getting-started', label: 'Docs'}
  ],

  users,
  headerIcon: 'img/icon-white.svg',
  favicon: 'img/favicon.ico',

  scripts: ['https://buttons.github.io/buttons.js'],
  colors: {
    primaryColor: '#3f3d55',
    secondaryColor: '#5f8881',
  },

  copyright: `Copyright © ${new Date().getFullYear()} Matheus Martins`,

  highlight: {
    theme: 'default',
  },

  onPageNav: 'separate',
  cleanUrl: true,

  ogImage: 'img/undraw_online.svg',
  twitterImage: 'img/undraw_tweetstorm.svg',

  enableUpdateTime: true
};

module.exports = siteConfig;
