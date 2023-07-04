# helm 安装配置（未完成）

## 问题

1. 第一次发布的服务：A、C、E、H、K 等服务，需要新增配置参数等内容
2. 第二次发布的服务：A、B、H、L、P 等服务，需要删除配置参数等内容
3. 第三次发布的服务：A、Y、E、S、X 等服务，需要新增、删除、修改配置参数等内容
4. ......
5. 无论是发布和回滚（包含对多个环境的发布，比如测试环境、正式环境等），对于操作者，都是一个个噩梦

## 说明

1. Helm
    1. 对于复杂的应用或者中间件系统，在 Kubernetes 上进行容器化部署并非易事，通常需要研究 Docker
       镜像的运行需求、环境变量等内容，为容器配置依赖的储存、网络等资源，并设计编写
       Deployment、ConfigMap、Service、Volume、Ingress 等 YAML 文件，再将其一次提交给 Kubernetes
       部署。总之，微服务架构和容器化复杂应用的部署和管理带来了很大的挑战。
    2. Helm 将 Kubernetes 的资源，如：Deployment、ConfigMap、Service、Volume、Ingress 等，打包到一个 Chart（图表）中，而 Chart
       被保存到 Chart 仓库，由 Chart 仓库储存、分发和共享。
    3. Helm 支持应用 Chart 的版本管理，简化了 Kubernetes 应用部署的应用定义、打包、部署、更新、删除和回滚等操作。
2. [快速入门指南](https://helm.sh/zh/docs/intro/quickstart/)
3. Helm 组件
    1. Chart：Helm 软件包，包含一个应用所需资源对象的 YAML 文件，通常以 .tgz 压缩包的形式存在，也可以是文件夹形式
    2. Repository（仓库）：用于存放和共享 Chart 的仓库
    3. Config（配置数据）：部署时设置到 Chart 中的配置数据
    4. Release：基于 Chart 和 Config 部署到 Kubernetes 集群中运行的一个实例，一个 Chart 可以被部署多次，每次的 Release 都不相同
4. 基于 Helm 的工作流
    1. 开发人员将开发好的 Chart 上传到 Chart 仓库。
    2. 运维人员基于 Chart 的定义，设置必要的配置数据（Config），使用 Helm 命令行工具应用一键部署到 Kubernetes 集群中，以
       Release 概念管理后续的更新、回滚等。
    3. Chart 仓库中的 Chart 可以用于共享和分发。
5. [Helm版本支持策略](https://helm.sh/zh/docs/topics/version_skew/)
   （2023-06-26 更新）

   | Helm 版本 | 支持的 Kubernetes 版本 |
   |---------|-------------------|
   | 3.11.x  | 1.26.x - 1.23.x   |
   | 3.10.x  | 1.25.x - 1.22.x   |
   | 3.9.x   | 1.24.x - 1.21.x   |
   | 3.8.x   | 1.23.x - 1.20.x   |
   | 3.7.x   | 1.22.x - 1.19.x   |
   | 3.6.x   | 1.21.x - 1.18.x   |
   | 3.5.x   | 1.20.x - 1.17.x   |
   | 3.4.x   | 1.19.x - 1.16.x   |
   | 3.3.x   | 1.18.x - 1.15.x   |
   | 3.2.x   | 1.18.x - 1.15.x   |
   | 3.1.x   | 1.17.x - 1.14.x   |
   | 3.0.x   | 1.16.x - 1.13.x   |
   | 2.16.x  | 1.16.x - 1.15.x   |
   | 2.15.x  | 1.15.x - 1.14.x   |
   | 2.14.x  | 1.14.x - 1.13.x   |
   | 2.13.x  | 1.13.x - 1.12.x   |
   | 2.12.x  | 1.12.x - 1.11.x   |
   | 2.11.x  | 1.11.x - 1.10.x   |
   | 2.10.x  | 1.10.x - 1.9.x    |
   | 2.9.x   | 1.10.x - 1.9.x    |
   | 2.8.x   | 1.9.x - 1.8.x     |
   | 2.7.x   | 1.8.x - 1.7.x     |
   | 2.6.x   | 1.7.x - 1.6.x     |
   | 2.5.x   | 1.6.x - 1.5.x     |
   | 2.4.x   | 1.6.x - 1.5.x     |
   | 2.3.x   | 1.5.x - 1.4.x     |
   | 2.2.x   | 1.5.x - 1.4.x     |
   | 2.1.x   | 1.5.x - 1.4.x     |
   | 2.0.x   | 1.4.x - 1.3.x     |

6. [releases](https://github.com/helm/helm/releases)
7. 本文以 k8s 1.26.6、helm 3.12.1 为例

## 安装

1. 根据上述 Helm版本支持策略 与 k8s
   的版本，访问 [releases](https://github.com/helm/helm/releases) 下载所需的版本

   ```shell
   HELM_VERSION=v3.12.1
   
   wget https://get.helm.sh/helm-$HELM_VERSION-linux-amd64.tar.gz
   
   tar -zxvf helm-$HELM_VERSION-linux-amd64.tar.gz
   
   linux-amd64/helm version
   
   mv linux-amd64/helm /usr/local/bin/helm
   
   helm version
   ```

2. 初始化

   ```shell
   helm repo add bitnami https://charts.bitnami.com/bitnami
   
   helm search repo bitnami
   
   helm repo update
   ```

3. 安装Chart示例

   ```shell
   helm install bitnami/mysql --generate-name
   ```

4. 查看chart的基本信息

   ```shell
   helm show chart bitnami/mysql
   ```

5. 查看chart的所有信息

   ```shell
   helm show all bitnami/mysql
   ```

6. 列出所有可被部署的版本

   ```shell
   helm ls
   
   # helm list
   ```

7. 卸载一个版本

   ```shell
   helm uninstall mysql-1612624192
   ```

8. 查看版本信息

   ```shell
   helm status mysql-1612624192
   ```

9. 

