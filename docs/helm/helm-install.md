---
sidebar_position: 1
---

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
5. Helm
    1. 仓库
        1. [GitHub](https://github.com/helm/helm)
        2. [GitCode 加速镜像](https://gitcode.net/mirrors/helm/helm)
    2. 历史发布
        1. [GitHub](https://github.com/helm/helm/releases)
        2. [GitCode 加速镜像](https://gitcode.net/mirrors/helm/helm/-/releases)
6. [Helm版本支持策略](https://helm.sh/zh/docs/topics/version_skew/)（2023-06-26 更新）
   本文以 k8s 1.26.6、helm 3.12.3 为例

| Helm 版本 | 支持的 Kubernetes 版本 |
|---------|-------------------|
| 3.12.x  | 1.27.x - 1.24.x   |
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

## 安装

1. 根据上述 Helm版本支持策略 与 k8s
   的版本，访问 [github releases](https://github.com/helm/helm/releases)
   或 [GitCode releases](https://gitcode.net/mirrors/helm/helm/-/releases) 下载所需的版本

   ```shell
   HELM_VERSION=v3.12.3
   
   wget https://get.helm.sh/helm-$HELM_VERSION-linux-amd64.tar.gz
   
   tar -zxvf helm-$HELM_VERSION-linux-amd64.tar.gz
   
   linux-amd64/helm version
   
   mv linux-amd64/helm /usr/local/bin/helm
   
   helm version
   ```

2. 初始化

   ```shell
   # 添加 bitnami 仓库
   helm repo add bitnami https://charts.bitnami.com/bitnami
   
   # 列举仓库
   helm repo list
   
   # 搜索仓库
   helm search repo bitnami
   
   # 搜索 drupal 最新版
   helm search repo drupal
   
   # 搜索 drupal 更多版本
   helm search repo drupal --versions
   
   # 更新仓库
   helm repo update
   ```

3. 安装Chart示例

    ```shell
    # 卸载使用 uninstall
    # -n：指定命名空间
    helm install mysite bitnami/drupal
    ```
   执行结果
    ```shell
    NAME: mysite
    LAST DEPLOYED: Tue Jul 11 15:01:50 2023
    NAMESPACE: default
    STATUS: deployed
    REVISION: 1
    TEST SUITE: None
    NOTES:
    CHART NAME: drupal
    CHART VERSION: 14.1.5
    APP VERSION: 10.0.9** Please be patient while the chart is being deployed **
    
    1. Get the Drupal URL:
    
    NOTE: It may take a few minutes for the LoadBalancer IP to be available.
    Watch the status with: 'kubectl get svc --namespace default -w mysite-drupal'
    
    export SERVICE_IP=$(kubectl get svc --namespace default mysite-drupal --template "{{ range (index .status.loadBalancer.ingress 0) }}{{ . }}{{ end }}")
    echo "Drupal URL: http://$SERVICE_IP/"
    
    2. Get your Drupal login credentials by running:
    
    echo Username: user
    echo Password: $(kubectl get secret --namespace default mysite-drupal -o jsonpath="{.data.drupal-password}" | base64 -d)
    ```

    ```shell
    # 卸载使用 uninstall
    # --generate-name：根据名称与当前时间戳自动生成 name
    # -n：指定命名空间
    helm install bitnami/mysql --generate-name
    ```
   执行结果
    ```shell
    NAME: mysql-1689058203
    LAST DEPLOYED: Tue Jul 11 14:50:05 2023
    NAMESPACE: default
    STATUS: deployed
    REVISION: 1
    TEST SUITE: None
    NOTES:
    CHART NAME: mysql
    CHART VERSION: 9.10.5
    APP VERSION: 8.0.33
    
    ** Please be patient while the chart is being deployed **
    
    Tip:
    
    Watch the deployment status using the command: kubectl get pods -w --namespace default
    
    Services:
    
    echo Primary: mysql-1689058203.default.svc.cluster.local:3306
    
    Execute the following to get the administrator credentials:
    
    echo Username: root
    MYSQL_ROOT_PASSWORD=$(kubectl get secret --namespace default mysql-1689058203 -o jsonpath="{.data.mysql-root-password}" | base64 -d)
    
    To connect to your database:
    
    1. Run a pod that you can use as a client:
    
       kubectl run mysql-1689058203-client --rm --tty -i --restart='Never' --image  docker.io/bitnami/mysql:8.0.33-debian-11-r28 --namespace default --env MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD --command -- bash
    
    2. To connect to primary service (read/write):
    
       mysql -h mysql-1689058203.default.svc.cluster.local -uroot -p"$MYSQL_ROOT_PASSWORD"
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
   # -n：指定命名空间
   # --all-namespaces：查看所有命名空间
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

