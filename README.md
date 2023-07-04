# GitLab、kubernetes（k8s）知识库

> 为简化开发工作、提高生产率、解决常见问题而生.

## 导读

### [GitLab 导读](guide/gitlab.md)

### [GitLab Runner 导读](guide/gitlab-runner.md)

### [kubernetes（k8s） 导读](guide/k8s.md)

## 安装配置

### GitLab

#### [CentOS 7.9 中安装 GitLab](gitlab/centos-7.9-install.md)

#### [GitLab 配置 SSL/https](gitlab/https-configuration.md)

#### [GitLab Pages 配置 SSL/https](gitlab/pages-https-configuration.md)

#### GitLab Packages 仓库

##### [GitLab Maven 仓库](gitlab/packages/maven-configuration.md)

##### [GitLab Docker 容器镜像仓库](gitlab/packages/docker-configuration.md)

##### [GitLab npm 仓库（未完成）](gitlab/packages/npm-configuration.md)

#### GitLab Object Store 对象储存 S3（MinIO）

##### [artifacts 使用对象储存](gitlab/object-store/artifacts-configuration.md)

##### [pages 使用对象储存](gitlab/object-store/pages-configuration.md)

##### [uploads 使用对象储存](gitlab/object-store/uploads-configuration.md)

##### [backup_upload 使用对象储存（未完成）](gitlab/object-store/backup_upload-configuration.md)

##### [ci_secure_files 使用对象储存（未完成）](gitlab/object-store/ci_secure_files-configuration.md)

##### [dependency_proxy 使用对象储存（未完成）](gitlab/object-store/dependency_proxy-configuration.md)

##### [external_diffs 使用对象储存（未完成）](gitlab/object-store/external_diffs-configuration.md)

##### [LFS 使用对象储存（未完成）](gitlab/object-store/lfs-configuration.md)

##### [object_storage 使用对象储存（未完成）](gitlab/object-store/object-store-configuration.md)

##### [packages 使用对象储存（未完成）](gitlab/object-store/packages-configuration.md)

##### [terraform_state 使用对象储存（未完成）](gitlab/object-store/terraform_state-configuration.md)

### GitLab Runner

#### [CentOS 安装 GitLab Runner](gitlab-runner/centos-install.md)

#### [kubernetes（k8s）配置](gitlab-runner/k8s-configuration.md)

#### [Cache 配置 S3](gitlab-runner/cache-s3-configuration.md)

#### [Docker-in-Docker（未完成）](gitlab-runner/docker-in-docker-configuration.md)

### GitLab 依赖机器人 dependabot-gitlab

#### [docker compose 安装](dependabot-gitlab/dependabot-gitlab-install.md)

### Docker

#### [Centos 安装 Docker](docker/centos-install.md)

### Kubernetes（k8s）

#### [Kubernetes（k8s）安装](k8s/centos-install.md)

#### [Metrics Server 安装](k8s/metrics-server-install.md)

#### [Kube Prometheus 普罗米修斯 安装](k8s/kube-prometheus-install.md)

#### [kubernetes（k8s）探针 配置](k8s/probe-configuration.md)

#### [Pod、Deployment、Service（未完成）](k8s/pod-deployment-service.md)

#### [Ingress 安装](k8s/ingress-install.md)

#### Kubernetes（k8s） UI

##### [kubernetes（k8s）Dashboard 安装](k8s/ui/dashboard-install.md)

#### Kubernetes（k8s） PV

##### [CentOS 7 中安装 NFS](k8s/pv/centos-7-nfs-install.md)

#### Kubernetes（k8s） CSI

##### [kubernetes（k8s） CSI 插件列表](k8s/csi/csi-list.md)

##### [阿里云 Kubernetes OSS CSI 插件（未完成）](k8s/csi/aliyun-oss-csi-configuration.md)

#### helm

##### [helm 安装配置（未完成）](k8s/helm/helm-install.md)

### Nexus 私库

#### [Docker 容器 Nexus 配置 SSL/https](nexus/https-configuration.md)

### WSL

#### [Windows 10 WSL Ubuntu 运行 Docker](wsl/windows-10-install-ubuntu-docker.md)

### [项目说明](README-repository.md)
