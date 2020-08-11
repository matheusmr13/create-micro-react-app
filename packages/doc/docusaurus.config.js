module.exports = {
  title: 'Create Micro React App',
  tagline: 'Create a microfrontend architecture as simple as CRA.',
  url: 'https://matheusmr13.github.io/',
  baseUrl: '/create-micro-react-app/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'matheusmr00',
  projectName: 'create-micro-react-app',
  themeConfig: {
    navbar: {
      title: 'Create Micro React App',
      logo: {
        alt: 'Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'right',
        },
        {
          href: 'https://github.com/matheusmr13/create-micro-react-app',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: 'docs/',
            },
            {
              label: 'Create React App',
              to: 'https://create-react-app.dev/',
            },
            {
              label: 'Learn React',
              to: 'https://reactjs.org/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/create-react-app',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/matheusmr13/create-micro-react-app',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Matheus Martins.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // It is recommended to set document id as docs home page (`docs/` path).
          homePageId: 'getting-started',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/matheusmr13/create-micro-react-app/tree/master/packages/docs',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
