import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "GitLab/Kubernetes 知识库",
  description: "为简化开发工作、提高生产率、解决常见问题而生",
  lang: 'zh-CN',
  base: '/gitlab-k8s',
  head: [
    [ 'link', { rel: 'icon', href: '/gitlab-k8s/favicon.ico' } ],
    [ 'script', { id: 'baidu' },
      `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?2173e1f7d3ce3dce80b34490272e7b79";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();
      `
    ],
    [ 'style', {},
      `
      td, th {
        padding: 8px !important;
      }
      @media only screen and (min-width: 1440px) {
        :root {
          --vp-layout-max-width: 100%;
        }
        .VPDoc.has-aside .content-container {
          max-width: 100% !important;
        }
      }
      `
    ]
  ],
  lastUpdated: true,
  srcExclude: [ 'README.md', 'README-repository.md' ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '导读', link: '/docs/guide/gitlab', activeMatch: '/docs/guide/' },
      {
        text: '其他文档',
        activeMatch: `^/(guide|style-guide|cookbook|examples)/`,
        items: [
          {
            text: '徐晓伟',
            link: 'https://xuxiaowei.com.cn'
          },
          {
            text: '徐晓伟微服务',
            link: 'https://docs.xuxiaowei.cloud'
          },
          {
            text: 'Kubernetes（k8s）一键安装配置脚本',
            link: 'https://gitee.com/xuxiaowei-com-cn/k8s.sh'
          },
          {
            text: 'kubernetes（k8s）一键安装交互式网站',
            link: 'https://k8s-sh.xuxiaowei.com.cn'
          },
          {
            text: 'Kubernetes（k8s）文档国内镜像',
            link: 'https://kubernetes.xuxiaowei.com.cn/zh-cn/'
          },
          {
            text: 'Docker 文档国内镜像',
            link: 'https://docker-docs.xuxiaowei.com.cn'
          },
          {
            text: '网盾',
            link: 'https://gateway-shield.xuxiaowei.com.cn'
          },
          {
            text: '根据 IP 获取地理信息',
            link: 'https://ip.xuxiaowei.com.cn'
          },
          {
            text: '短网址',
            link: 'https://xxw.ac.cn'
          },
          {
            text: 'GitLab',
            link: 'https://gitlab.xuxiaowei.com.cn/xuxiaowei-com-cn/readme/-/blob/main/README.md'
          },
          {
            text: 'Jenkins',
            link: 'https://jenkins.xuxiaowei.com.cn'
          },
          {
            text: 'markdown-it',
            link: 'https://markdown-it.xuxiaowei.com.cn'
          },
          {
            text: '工具',
            link: 'https://tools.xuxiaowei.com.cn'
          },
        ]
      },
    ],
    logo: { src: '/favicon.ico', width: 24, height: 24 },
    search: {
      provider: 'local'
    },
    sidebar: [
      {
        text: '导读',
        collapsed: true,
        // 由于下方链接使用了其他域名，所以此处不能使用基础地址
        // base: '/docs/guide/',
        items: [
          { text: 'GitLab 导读', link: '/docs/guide/gitlab' },
          { text: 'GitLab Runner 导读', link: '/docs/guide/gitlab-runner' },
          { text: 'Kubernetes（k8s） 导读', link: '/docs/guide/k8s' },
          { text: '极狐GitLab 与 码云Gitee 价格对比', link: '/docs/guide/gitlab-gitee' },
          { text: 'GitLab 部署方式对比', link: '/docs/guide/gitlab-install-compare' },
          // 由于此处链接使用了其他域名，所以上方不能使用基础地址
          { text: '联系我们', link: 'https://docs.xuxiaowei.cloud/spring-cloud-xuxiaowei/guide/contact-us.html' },
          { text: '赞助', link: 'https://docs.xuxiaowei.cloud/spring-cloud-xuxiaowei/guide/contributes.html' },
          { text: '视频', link: 'https://docs.xuxiaowei.cloud/spring-cloud-xuxiaowei/guide/video.html' },
        ]
      },
      {
        text: 'GitLab',
        collapsed: true,
        base: '/docs/gitlab/',
        items: [
          { text: 'GitLab 安装', link: 'install' },
          { text: 'GitLab 使用 Docker Compose 部署', link: 'gitlab-docker-compose' },
          { text: 'GitLab 配置 SSL/https', link: 'https-configuration' },
          { text: 'GitLab Pages 配置 SSL/https', link: 'pages-https-configuration' },
        ]
      },
      {
        text: 'GitLab 对象储存',
        collapsed: true,
        base: '/docs/gitlab-object-store/',
        items: [
          { text: 'artifacts', link: 'artifacts-configuration' },
          { text: 'pages', link: 'pages-configuration' },
          { text: 'uploads', link: 'uploads-configuration' },
          { text: 'backup_upload', link: 'backup_upload-configuration' },
          { text: 'ci_secure_files', link: 'ci_secure_files-configuration' },
          { text: 'dependency_proxy', link: 'dependency_proxy-configuration' },
          { text: 'external_diffs', link: 'external_diffs-configuration' },
          { text: 'LFS', link: 'lfs-configuration' },
          { text: 'object_storage', link: 'object-store-configuration' },
          { text: 'packages', link: 'packages-configuration' },
          { text: 'terraform_state', link: 'terraform_state-configuration' },
        ]
      },
      {
        text: 'GitLab 软件包库',
        collapsed: true,
        base: '/docs/gitlab-packages/',
        items: [
          { text: 'GitLab Docker 容器镜像仓库', link: 'docker-configuration' },
          { text: 'GitLab Maven 仓库', link: 'maven-configuration' },
          { text: 'GitLab npm 仓库（未完成）', link: 'npm-configuration' },
        ]
      },
      {
        text: 'GitLab Runner CI/CD',
        collapsed: true,
        base: '/docs/gitlab-runner/',
        items: [
          { text: 'GitLab Runner 安装', link: 'install' },
          { text: 'GitLab Runner Kubernetes（k8s）配置', link: 'k8s-configuration' },
          { text: 'GitLab Runner Cache 缓存配置', link: 'cache-s3-configuration' },
          { text: 'Docker-in-Docker', link: 'docker-in-docker-configuration' },
          { text: 'GitLab Runner 制作 Docker 镜像的 5 种方案', link: 'build-docker' },
          { text: 'fatal: git fetch-pack: expected shallow list', link: 'fatal-git-fetch-pack' },
        ]
      },
      {
        text: 'GitLab Dependabot',
        collapsed: true,
        base: '/docs/gitlab-dependabot/',
        items: [
          { text: 'GitLab 依赖机器人 安装', link: 'dependabot-gitlab-install' },
        ]
      },
      {
        text: 'GitLab Ultimate',
        collapsed: true,
        base: '/docs/gitlab-ultimate/',
        items: [
          { text: 'GitLab 旗舰版 简介', link: 'intro' },
          { text: '流水线使用量配额', link: 'pipelines-quota-tab' },
          { text: '仓库受保护分支和标签', link: 'repository-protected-branches-tags' },
          { text: '待命计划管理（未完成）', link: 'oncall-schedules' },
          { text: '审计事件', link: 'audit-events' },
          { text: '依赖列表', link: 'dependency-list' },
          { text: '安全仪表盘', link: 'security-dashboard' },
          { text: '漏洞报告', link: 'vulnerability-report' },
          { text: '许可证合规', link: 'license-compliance' },
          { text: '默认分支文件和目录锁', link: 'file-lock' },
          { text: 'Secret 检测（未完成）', link: 'secret-detection' },
        ]
      },
      {
        text: 'Docker',
        collapsed: true,
        base: '/docs/docker/',
        items: [
          { text: 'CentOS 安装 Docker', link: 'centos-install' },
          { text: 'Docker 自定义数据储存路径', link: 'docker-root-dir' },
          { text: 'Docker 安装 PostgreSQL 15', link: 'postgresql-15-install' },
          { text: 'Docker 安装 sonarqube', link: 'sonarqube-install' },
        ]
      },
      {
        text: 'Kubernetes',
        collapsed: true,
        base: '/docs/k8s/',
        items: [
          { text: 'Kubernetes（k8s）安装', link: 'centos-install' },
          { text: '支持 IPv4/IPv6 双协议栈', link: 'dual-stack' },
          { text: 'kubectl 命令行工具', link: 'kubectl' },
          { text: 'Metrics Server 安装', link: 'metrics-server-install' },
          { text: 'Kube Prometheus 普罗米修斯 安装', link: 'kube-prometheus-install' },
          { text: 'Pod、Deployment、Service（未完成）', link: 'pod-deployment-service' },
          { text: 'Kubernetes（k8s）探针 配置', link: 'probe-configuration' },
          { text: 'Ingress 安装', link: 'ingress-install' },
          { text: 'Containerd 镜像配置', link: 'containerd-mirrors' },
          { text: '批量删除 k8s（ctr）使用的历史镜像', link: 'containerd-rm' },
          { text: '使用 openssl 生成 Kubernetes 新证书', link: 'ca-openssl' },
          { text: '使用 kubeadm 生成 Kubernetes 新证书', link: 'ca-kubeadm' },
          { text: '创建指定命名空间权限的 KUBECONFIG 文件', link: 'kubeconfig' },
        ]
      },
      {
        text: 'Kubernetes 高可用',
        collapsed: true,
        base: '/docs/k8s-availability/',
        items: [
          { text: 'k8s 高可用集群：导读', link: 'guide' },
          { text: 'k8s 高可用集群1：前提条件', link: 'prerequisite' },
          { text: 'k8s 高可用集群2：etcd 高可用集群（非必须）', link: 'etcd-install' },
          { text: 'k8s 高可用集群3：VIP：HAProxy、keepalived', link: 'vip' },
          { text: 'k8s 高可用集群4：利用 kubeadm 创建高可用集群-堆叠（Stacked） etcd 拓扑', link: 'stacked-etcd' },
          { text: 'k8s 高可用集群5：利用 kubeadm 创建高可用集群-外部 etcd 拓扑', link: 'external-etcd' },
          { text: 'k8s 高可用集群6：NFS 高可用（未完成）', link: 'nfs' },
        ]
      },
      {
        text: 'Kubernetes UI',
        collapsed: true,
        base: '/docs/k8s-ui/',
        items: [
          { text: 'Kubernetes Dashboard 安装', link: 'dashboard-install' },
        ]
      },
      {
        text: 'Kubernetes CSI',
        collapsed: true,
        base: '/docs/k8s-csi/',
        items: [
          { text: 'Kubernetes CSI 插件列表', link: 'csi-list' },
          { text: '阿里云 Kubernetes OSS CSI 插件（未完成）', link: 'aliyun-oss-csi-configuration' },
        ]
      },
      {
        text: 'Kubernetes Volumes',
        collapsed: false,
        base: '/docs/k8s-volumes/',
        items: [
          {
            text: 'local',
            collapsed: true,
            base: '/docs/k8s-volumes/local/',
            items: [
              { text: 'EmptyDir 空目录', link: 'empty-dir' },
              { text: 'HostPath 宿主机路径', link: 'host-path' },
            ]
          },
          {
            text: 'resource-mapping',
            collapsed: true,
            base: '/docs/k8s-volumes/resource-mapping/',
            items: [
              { text: 'ConfigMap', link: 'configmap' },
              { text: 'Downward API', link: 'downward-api' },
              { text: 'Projected Volume 投射卷', link: 'projected-volume' },
              { text: 'Secret', link: 'secret' },
            ]
          },
          { text: 'Kubernetes 挂载卷/储存卷 介绍', link: 'volumes-intro' },
        ]
      },
      {
        text: 'Kubernetes SC',
        collapsed: true,
        base: '/docs/k8s-sc/',
        items: [
          { text: 'SC（StorageClass）（未完成）', link: 'persistent-volume' },
        ]
      },
      {
        text: 'Kubernetes PV',
        collapsed: true,
        base: '/docs/k8s-pv/',
        items: [
          { text: '持久卷（Persistent Volume）', link: 'persistent-volume' },
          { text: 'NFS（Network File System）网络文件系统', link: 'nfs' },
          { text: 'CentOS 7 中安装 NFS', link: 'centos-7-nfs-install' },
          { text: 'AnolisOS 23 中安装 NFS', link: 'anolis-23-nfs-install' },
        ]
      },
      {
        text: 'Kubernetes PVC',
        collapsed: true,
        base: '/docs/k8s-pvc/',
        items: [
          { text: '持久卷的请求和申领（Persistent Volume Claim）（未完成）', link: 'persistent-volume-claim' },
        ]
      },
      {
        text: 'helm',
        collapsed: false,
        base: '/docs/helm/',
        items: [
          { text: 'helm 安装配置', link: 'helm-install' },
          {
            text: '使用 helm 安装/配置 GitLab',
            collapsed: true,
            base: '/docs/helm/gitlab/',
            items: [
              { text: '使用 Helm 安装 GitLab', link: 'install' },
              { text: 'GitLab Runner 添加 GitLab 域名 host', link: 'gitlab-runner-host' },
              { text: 'GitLab Runner 信任域名证书', link: 'gitlab-runner-trust-ssl' },
              { text: 'GitLab Runner Job 添加 域名 host', link: 'gitlab-runner-kubernetes-host' },
              { text: 'GitLab Runner 配置帮助镜像', link: 'gitlab-runner-helper-image' },
              { text: 'GitLab Runner 添加 MinIO 域名 host', link: 'gitlab-runner-cache-host' },
              { text: 'GitLab Runner 信任缓存域名证书', link: 'gitlab-runner-cache-trust-ssl' },
              { text: 'GitLab Runner 修改日志大小限制', link: 'gitlab-runner-output-limit' },
              { text: 'GitLab Runner 特权身份运行', link: 'gitlab-runner-privileged' },
              { text: 'GitLab 启用 Pages', link: 'gitlab-pages' },
              { text: 'GitLab 自定义 Pages 根域名', link: 'gitlab-pages-host' },
              { text: 'GitLab 自定义 Pages 域名、SSL/TLS 证书', link: 'gitlab-pages-custom-domains-ssl-tls' },
              { text: 'GitLab 配置 邮件功能', link: 'gitlab-smtp' },
              { text: 'GitLab Maven 仓库使用', link: 'gitlab-maven' },
              { text: 'GitLab 启用 自动备份功能', link: 'gitlab-backups' },
              { text: 'GitLab 备份 信任域名证书', link: 'gitlab-backups-trust-ssl' },
              { text: 'GitLab 在 helm 中恢复数据', link: 'gitlab-helm-restore' },
              { text: 'GitLab Docker 仓库', link: 'gitlab-register' },
              { text: 'GitLab 启用 依赖代理功能', link: 'gitlab-dependency-proxy' },
            ]
          },
        ]
      },
      {
        text: 'Nexus 私库',
        collapsed: true,
        base: '/docs/nexus/',
        items: [
          { text: 'Nexus 简介', link: 'intro' },
          { text: '在 Docker 中安装 Nexus', link: 'docker-install-nexus' },
          { text: 'Docker 容器 Nexus 配置 SSL/https', link: 'docker-https-configuration' },
          { text: '使用 Maven 私库', link: 'use-maven-repository' },
          { text: 'S3 Blob Stores 配置', link: 's3-blob-stores' },
          { text: 'Maven 私库 自定义配置', link: 'maven-repository' },
          { text: 'Docker 私库 自定义配置', link: 'docker-repository' },
          { text: 'yum 私库 自定义配置', link: 'yum-repository' },
          { text: 'apt 私库 自定义配置', link: 'apt-repository' },
          { text: 'npm 私库 自定义配置（未完成）', link: 'npm-repository' },
          { text: '压缩 Blob 存储区', link: 'compact-blob-store' },
        ]
      },
      {
        text: '离线安装',
        collapsed: true,
        base: '/docs/offline/',
        items: [
          { text: '离线安装：导读', link: 'guide' },
          { text: '在 CentOS 7.9 上离线安装 GitLab', link: 'centos-7-gitlab-install' },
          { text: '在 CentOS 上离线安装 Docker（未完成）', link: 'centos-docker-install' },
          { text: '在 CentOS 上离线安装 GitLab Runner（未完成）', link: 'centos-7-gitlab-runner-install' },
          { text: '在 CentOS 上离线安装 Kubernetes（k8s）', link: 'centos-k8s-install' },
          { text: 'Kubernetes（k8s）Dashboard 离线安装（未完成）', link: 'k8s-dashboard-install' },
          { text: 'GitLab Runner、Kubernetes（k8s）离线配置（未完成）', link: 'gitlab-runner-k8s' },
          { text: '在 乌班图 Ubuntu 上离线安装 GitLab', link: 'ubuntu-gitlab-install' },
          { text: '在 乌班图 Ubuntu 上离线安装 Docker（未完成）', link: 'ubuntu-docker-install' },
          { text: '在 乌班图 Ubuntu 上离线安装 GitLab Runner（未完成）', link: 'ubuntu-gitlab-runnner-install' },
          { text: '在 乌班图 Ubuntu 上离线安装 Kubernetes（k8s）（未完成）', link: 'ubuntu-k8s-install' },
          { text: '在 乌班图 Ubuntu 上离线安装 Nginx', link: 'ubuntu-nginx-install' },
        ]
      },
      {
        text: 'WSL',
        collapsed: true,
        base: '/docs/wsl/',
        items: [
          { text: 'Windows 10 WSL Ubuntu 运行 Docker', link: 'windows-10-install-ubuntu-docker' },
        ]
      },
      {
        text: '小工具',
        collapsed: true,
        base: '/docs/tools/',
        items: [
          { text: '小工具：Windows curl.exe', link: 'windows-curl' },
          { text: '小工具：Windows tail.exe', link: 'windows-tail' },
          { text: '小工具：Windows tcping.exe', link: 'windows-tcping' },
        ]
      },
      {
        text: '源码编译',
        collapsed: true,
        base: '/docs/make/',
        items: [
          { text: 'CentOS、Anolis 龙蜥 源码编译 异常处理', link: 'centos' },
          { text: 'Ubuntu 乌班图 源码编译 异常处理', link: 'ubuntu' },
        ]
      },
      {
        text: '下载',
        collapsed: true,
        base: '/docs/download/',
        items: [
          { text: 'Anolis 龙蜥 下载', link: 'anolis' },
          { text: 'CentOS 下载', link: 'centos' },
          { text: 'MySQL 下载、安装', link: 'mysql' },
          { text: 'Ubuntu 乌班图 下载', link: 'ubuntu' },
        ]
      },
      {
        text: 'SSL/TLS/HTTPS 证书',
        collapsed: true,
        base: '/docs/ssl/',
        items: [
          { text: '使用 acme.sh 生成证书', link: 'acme.sh' },
          { text: '使用 certbot 生成证书（未完成）', link: 'certbot' },
          { text: '', link: '' },
        ]
      },
      {
        text: 'Elasticsearch',
        collapsed: true,
        base: '/docs/es/',
        items: [
          { text: 'Anolis 23 中安装 Elasticsearch 7.x', link: 'anolis-23-install-es-7.x' },
          { text: 'Anolis 23 中安装 Kibana 7.x', link: 'anolis-23-install-kibana-7.x' },
          { text: 'Anolis 23 中安装 Filebeat 7.x', link: 'anolis-23-install-filebeat-7.x' },
          { text: 'Docker 安装 Elasticsearch 8.x', link: 'docker-install-es-8.x' },
        ]
      },
    ],

    outline: {
      level: 'deep',
      label: '在此页面上'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/xuxiaowei-com-cn/gitlab-k8s/' },
      { link: 'https://gitee.com/xuxiaowei-com-cn/gitlab-k8s/', icon: { svg: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1711680016792" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5075" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M512 1024C229.222 1024 0 794.778 0 512S229.222 0 512 0s512 229.222 512 512-229.222 512-512 512z m259.149-568.883h-290.74a25.293 25.293 0 0 0-25.292 25.293l-0.026 63.206c0 13.952 11.315 25.293 25.267 25.293h177.024c13.978 0 25.293 11.315 25.293 25.267v12.646a75.853 75.853 0 0 1-75.853 75.853h-240.23a25.293 25.293 0 0 1-25.267-25.293V417.203a75.853 75.853 0 0 1 75.827-75.853h353.946a25.293 25.293 0 0 0 25.267-25.292l0.077-63.207a25.293 25.293 0 0 0-25.268-25.293H417.152a189.62 189.62 0 0 0-189.62 189.645V771.15c0 13.977 11.316 25.293 25.294 25.293h372.94a170.65 170.65 0 0 0 170.65-170.65V480.384a25.293 25.293 0 0 0-25.293-25.267z" fill="#C71D23" p-id="5076"></path></svg>' } },
      { link: 'https://space.bilibili.com/198580655', icon: { svg: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1711680570691" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6989" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M0 0m184.32 0l655.36 0q184.32 0 184.32 184.32l0 655.36q0 184.32-184.32 184.32l-655.36 0q-184.32 0-184.32-184.32l0-655.36q0-184.32 184.32-184.32Z" fill="#EC5D85" p-id="6990"></path><path d="M512 241.96096h52.224l65.06496-96.31744c49.63328-50.31936 89.64096 0.43008 63.85664 45.71136l-34.31424 51.5072c257.64864 5.02784 257.64864 43.008 257.64864 325.03808 0 325.94944 0 336.46592-404.48 336.46592S107.52 893.8496 107.52 567.90016c0-277.69856 0-318.80192 253.14304-324.95616l-39.43424-58.368c-31.26272-54.90688 37.33504-90.40896 64.68608-42.37312l60.416 99.80928c18.18624-0.0512 41.18528-0.0512 65.66912-0.0512z" fill="#EF85A7" p-id="6991"></path><path d="M512 338.5856c332.8 0 332.8 0 332.8 240.64s0 248.39168-332.8 248.39168-332.8-7.75168-332.8-248.39168 0-240.64 332.8-240.64z" fill="#EC5D85" p-id="6992"></path><path d="M281.6 558.08a30.72 30.72 0 0 1-27.47392-16.97792 30.72 30.72 0 0 1 13.73184-41.216l122.88-61.44a30.72 30.72 0 0 1 41.216 13.74208 30.72 30.72 0 0 1-13.74208 41.216l-122.88 61.44a30.59712 30.59712 0 0 1-13.73184 3.23584zM752.64 558.08a30.60736 30.60736 0 0 1-12.8512-2.83648l-133.12-61.44a30.72 30.72 0 0 1-15.04256-40.7552 30.72 30.72 0 0 1 40.76544-15.02208l133.12 61.44A30.72 30.72 0 0 1 752.64 558.08zM454.656 666.88a15.36 15.36 0 0 1-12.288-6.1952 15.36 15.36 0 0 1 3.072-21.49376l68.5056-50.91328 50.35008 52.62336a15.36 15.36 0 0 1-22.20032 21.23776l-31.5904-33.024-46.71488 34.72384a15.28832 15.28832 0 0 1-9.13408 3.04128z" fill="#EF85A7" p-id="6993"></path><path d="M65.536 369.31584c15.03232 101.90848 32.84992 147.17952 44.544 355.328 14.63296 2.18112 177.70496 10.04544 204.05248-74.62912a16.14848 16.14848 0 0 0 1.64864-10.87488c-30.60736-80.3328-169.216-60.416-169.216-60.416s-10.36288-146.50368-11.49952-238.83776zM362.25024 383.03744l34.816 303.17568h34.64192L405.23776 381.1328zM309.52448 536.28928h45.48608l16.09728 158.6176-31.82592 1.85344zM446.86336 542.98624h45.80352V705.3312h-33.87392zM296.6016 457.97376h21.39136l5.2736 58.99264-18.91328 2.26304zM326.99392 457.97376h21.39136l2.53952 55.808-17.408 1.61792zM470.62016 459.88864h19.456v62.27968h-19.456zM440.23808 459.88864h22.20032v62.27968h-16.62976z" fill="#FFFFFF" p-id="6994"></path><path d="M243.56864 645.51936a275.456 275.456 0 0 1-28.4672 23.74656 242.688 242.688 0 0 1-29.53216 17.52064 2.70336 2.70336 0 0 1-4.4032-1.95584 258.60096 258.60096 0 0 1-5.12-29.57312c-1.41312-12.1856-1.95584-25.68192-2.16064-36.36224 0-0.3072 0-2.5088 3.01056-1.90464a245.92384 245.92384 0 0 1 34.22208 9.5744 257.024 257.024 0 0 1 32.3584 15.17568c0.52224 0.256 2.51904 1.4848 0.09216 3.77856z" fill="#EB5480" p-id="6995"></path><path d="M513.29024 369.31584c15.03232 101.90848 32.84992 147.17952 44.544 355.328 14.63296 2.18112 177.70496 10.04544 204.05248-74.62912a16.14848 16.14848 0 0 0 1.64864-10.87488c-30.60736-80.3328-169.216-60.416-169.216-60.416s-10.36288-146.50368-11.49952-238.83776zM810.00448 383.03744l34.816 303.17568h34.64192L852.992 381.1328zM757.27872 536.28928h45.48608l16.09728 158.6176-31.82592 1.85344zM894.6176 542.98624h45.80352V705.3312H906.5472zM744.35584 457.97376h21.39136l5.2736 58.99264-18.91328 2.26304zM774.74816 457.97376h21.39136l2.53952 55.808-17.408 1.61792zM918.3744 459.88864h19.456v62.27968h-19.456zM887.99232 459.88864h22.20032v62.27968h-16.62976z" fill="#FFFFFF" p-id="6996"></path><path d="M691.32288 645.51936a275.456 275.456 0 0 1-28.4672 23.74656 242.688 242.688 0 0 1-29.53216 17.52064 2.70336 2.70336 0 0 1-4.4032-1.95584 258.60096 258.60096 0 0 1-5.12-29.57312c-1.41312-12.1856-1.95584-25.68192-2.16064-36.36224 0-0.3072 0-2.5088 3.01056-1.90464a245.92384 245.92384 0 0 1 34.22208 9.5744 257.024 257.024 0 0 1 32.3584 15.17568c0.52224 0.256 2.51904 1.4848 0.09216 3.77856z" fill="#EB5480" p-id="6997"></path></svg>' } }
    ],

    editLink: {
      text: '在 Gitee 上编辑此页面',
      pattern: ({ filePath }) => {
        return `https://gitee.com/xuxiaowei-com-cn/gitlab-k8s/edit/main/${filePath}`
        // return `https://framagit.org/xuxiaowei-com-cn/gitlab-k8s/-/edit/main/${filePath}`
        // return `https://github.com/xuxiaowei-com-cn/gitlab-k8s/edit/main/${filePath}`
      },
    },

    footer: {
      copyright: 'Copyright © 2023-present 徐晓伟 <a href="mailto:xuxiaowei@xuxiaowei.com.cn">xuxiaowei@xuxiaowei.com.cn</a>' +
          '<br><a target="_blank" href="https://beian.miit.gov.cn">鲁ICP备19009036号-1</a>'
    }
  }
})
