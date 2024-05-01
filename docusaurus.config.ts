import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config = {
  title: 'GitLab/Kubernetes 知识库',
  tagline: '为简化开发工作、提高生产率、解决常见问题而生',
  favicon: 'img/favicon.ico',

  plugins: ['./src/js/redirect.js', './src/js/baidu.js', "./src/js/beian.js"],

  // Set the production url of your site here
  url: 'https://gitlab-k8s.xuxiaowei.com.cn',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/gitlab-k8s/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'xuxiaowei-com-cn', // Usually your GitHub org/user name.
  projectName: 'gitlab-k8s', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
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
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: ({
    metadata: [{
      name: 'keywords',
      content: 'gitlab, k8s, kubernetes, docker, shell, VIP, haproxy, keepalived, etcd, nfs, pv, runner, ' +
          'gitlab runner, CI, CD, CI/CD, Maven, npm, Nexus, SSL, https, UI, dependabot, gitlab-dependabot, ' +
          'volumes, centos, anolis, 龙蜥, 持续集成, 持续交付, 持续部署, 高可用, 集群, 流水线, 对象储存, 私库, 安装, 编译, ' +
          '文档, 博客, 徐晓伟, xuxiaowei, xuxiaowei@xuxiaowei.com.cn'
    }],
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
        {to: '/blog', label: '博客', position: 'left'},
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
            {
              label: '重构微服务文档',
              href: 'https://xuxiaowei-cloud.gitee.io/spring-cloud-xuxiaowei/',
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
              label: 'QQ群',
              href: 'https://qm.qq.com/cgi-bin/qm/qr?k=ZieC6s1WB4njfVbrDHYgoNS8YpT26VtF&jump_from=webapi',
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
            {
              label: '博客',
              to: '/blog',
            },
            {
              label: 'Kubernetes（k8s）全自动安装配置脚本',
              href: 'https://framagit.org/xuxiaowei-com-cn/k8s.sh',
            },
            {
              label: '工具箱',
              href: 'https://xuxiaowei-tools.gitee.io',
            },
            {
              label: '程序开发常用网址',
              href: 'https://gitee.com/xuxiaowei-com-cn/link',
            },
          ],
        },
      ],
      copyright: `Copyright © 2023 <a target="_blank" href="http://xuxiaowei.com.cn">徐晓伟工作室</a>`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig)
};

export default config;
