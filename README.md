### 导读

#### [GitLab 导读](guide/gitlab.md)

#### [GitLab Runner 导读](guide/gitlab-runner.md)

#### [kubernetes（k8s） 导读](guide/k8s.md)

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

#### Kubernetes（k8s） Availability 高可用

##### [导读](k8s/availability/guide.md)

##### [前提条件](k8s/availability/prerequisite.md)

##### [etcd 高可用集群（非必须）](k8s/availability/etcd-install.md)

##### [VIP（HAProxy、keepalived）](k8s/availability/vip.md)

##### [利用 kubeadm 创建高可用集群-堆叠（Stacked） etcd 拓扑](k8s/availability/stacked-etcd.md)

##### [利用 kubeadm 创建高可用集群-外部 etcd 拓扑](k8s/availability/external-etcd.md)

##### [NFS 高可用（未完成）](k8s/availability/nfs.md)

#### Kubernetes（k8s） UI

##### [kubernetes（k8s）Dashboard 安装](k8s/ui/dashboard-install.md)

#### Volumes 挂载卷/储存卷

##### [挂载卷/储存卷 介绍](k8s/volumes/volumes-intro.md)

##### 将资源对象映射为储存卷

###### [ConfigMap](k8s/volumes/resource-mapping/configmap.md)

###### [Secret](k8s/volumes/resource-mapping/secret.md)

###### [Downward API](k8s/volumes/resource-mapping/downward-api.md)

###### [Projected Volume 投射卷](k8s/volumes/resource-mapping/projected-volume.md)

##### Node 本地储存卷

###### [EmptyDir 空目录](k8s/volumes/local/empty-dir.md)

###### [HostPath 宿主机路径](k8s/volumes/local/host-path.md)

#### Kubernetes（k8s） PV

##### [Persistent Volume 持久卷（未完成）](k8s/pv/persistent-volume.md)

##### [CentOS 7 中安装 NFS](k8s/pv/centos-7-nfs-install.md)

#### Kubernetes（k8s） CSI

##### [kubernetes（k8s） CSI 插件列表](k8s/csi/csi-list.md)

##### [阿里云 Kubernetes OSS CSI 插件（未完成）](k8s/csi/aliyun-oss-csi-configuration.md)

#### helm

##### [helm 安装配置（未完成）](k8s/helm/helm-install.md)

### Nexus 私库

#### [在 Docker 中安装 Nexus](nexus/docker-install-nexus.md)

#### [Docker 容器 Nexus 配置 SSL/https](nexus/docker-https-configuration.md)

#### [使用 Maven 私库](nexus/use-maven-repository.md)

#### [S3 Blob Stores 配置](nexus/s3-blob-stores.md)

#### [Maven 私库 自定义配置](nexus/maven-repository.md)

#### [Docker 私库 自定义配置](nexus/docker-repository.md)

#### [yum 私库 自定义配置](nexus/yum-repository.md)

#### [apt 私库 自定义配置（未完成）](nexus/apt-repository.md)

#### [npm 私库 自定义配置（未完成）](nexus/npm-repository.md)

### 离线安装

#### [导读](offline/guide.md)

#### [在 CentOS 7.9 上离线安装 GitLab](offline/centos-7-gitlab-install.md)

#### [在 CentOS 上离线安装 Docker（未完成）](offline/centos-docker-install.md)

#### [在 CentOS 上离线安装 GitLab Runner（未完成）](offline/centos-7-gitlab-runner-install.md)

#### [在 CentOS 上离线安装 kubernetes（k8s）](offline/centos-k8s-install.md)

#### [kubernetes（k8s）Dashboard 离线安装（未完成）](offline/k8s-dashboard-install.md)

#### [GitLab Runner、kubernetes（k8s）离线配置（未完成）](offline/gitlab-runner-k8s.md)

#### [在 乌班图 Ubuntu 上离线安装 GitLab](offline/ubuntu-gitlab-install.md)

#### [在 乌班图 Ubuntu 上离线安装 Docker（未完成）](offline/ubuntu-docker-install.md)

#### [在 乌班图 Ubuntu 上离线安装 GitLab Runner（未完成）](offline/ubuntu-gitlab-runnner-install.md)

#### [在 乌班图 Ubuntu 上离线安装 kubernetes（k8s）（未完成）](offline/ubuntu-k8s-innstall.md)

#### [在 乌班图 Ubuntu 上离线安装 Nginx](offline/ubuntu-nginx-install.md)

### WSL

#### [Windows 10 WSL Ubuntu 运行 Docker](wsl/windows-10-install-ubuntu-docker.md)

### [项目说明](README-repository.md)
