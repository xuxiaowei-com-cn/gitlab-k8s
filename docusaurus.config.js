// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'GitLab/Kubernetes 知识库',
  tagline: '为简化开发工作、提高生产率、解决常见问题而生',
  favicon: 'img/favicon.ico',

  plugins: ['./src/js/redirect.js', './src/js/baidu.js'],

  // Set the production url of your site here
  url: 'https://xuxiaowei-com-cn.gitee.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/gitlab-k8s/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'xuxiaowei-com-cn', // Usually your GitHub org/user name.
  projectName: 'gitlab-k8s', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://gitee.com/xuxiaowei-com-cn/gitlab-k8s/tree/main/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://gitee.com/xuxiaowei-com-cn/gitlab-k8s/tree/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'GitLab/Kubernetes 知识库',
        logo: {
          alt: 'GitLab/Kubernetes 知识库 Logo',
          src: 'img/favicon.ico',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: '文档',
          },
          // {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://gitee.com/xuxiaowei-com-cn/gitlab-k8s',
            label: 'Gitee',
            position: 'right',
          },
          {
            href: 'https://github.com/xuxiaowei-com-cn/gitlab-k8s',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '文档',
            items: [
              {
                label: '文档介绍',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: '社交',
            items: [
              {
                label: '微博',
                href: 'https://weibo.com/u/2946715617',
              },
              {
                label: 'CSDN',
                href: 'https://xuxiaowei.blog.csdn.net',
              },
              {
                label: '微信群',
                href: 'https://work.weixin.qq.com/gm/75cfc47d6a341047e4b6aca7389bdfa8',
              },
              {
                label: '哔哩哔哩',
                href: 'https://space.bilibili.com/198580655',
              },
            ],
          },
          {
            title: '更多',
            items: [
              // {
              //   label: 'Blog',
              //   to: '/blog',
              // },
              {
                label: '工具箱',
                href: 'https://xuxiaowei-tools.gitee.io',
              },
            ],
          },
        ],
        copyright: `Copyright © 2023 <a target="_blank" href="http://xuxiaowei.com.cn">徐晓伟工作室</a>`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
