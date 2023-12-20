---
sidebar_position: 3
---

# GitLab Runner Kubernetes（k8s）配置

GitLab Runner 配置 Kubernetes（k8s）执行器运行流水线

## 资料

1. [Kubernetes](https://docs.gitlab.com/runner/install/kubernetes)
    1. [极狐 GitLab 中文文档](https://docs.gitlab.cn/runner/install/kubernetes)
2. [高级配置](https://docs.gitlab.com/runner/configuration/advanced-configuration.html)
    1. [极狐 GitLab 中文文档](https://docs.gitlab.cn/runner/configuration/advanced-configuration.html)
3. [添加额外主机别名](https://docs.gitlab.com/runner/executors/kubernetes.html#adding-extra-host-aliases)
    1. [极狐 GitLab 中文文档](https://docs.gitlab.cn/runner/executors/kubernetes.html#%E6%B7%BB%E5%8A%A0%E9%A2%9D%E5%A4%96%E4%B8%BB%E6%9C%BA%E5%88%AB%E5%90%8D)
4. [Pod 的 DNS 配置](https://docs.gitlab.com/runner/executors/kubernetes.html#pods-dns-config)
    1. [极狐 GitLab 中文文档](https://docs.gitlab.cn/runner/executors/kubernetes.html#pod-%E7%9A%84-dns-%E9%85%8D%E7%BD%AE)
5. [GitLab Runner 的 Kubernetes 执行器](https://docs.gitlab.com/runner/executors/kubernetes.html)
    1. [极狐 GitLab 中文文档](https://docs.gitlab.cn/runner/executors/kubernetes.html)
6. [Docker 执行器](https://docs.gitlab.com/runner/executors/docker.html)
    1. [极狐 GitLab 中文文档](https://docs.gitlab.cn/runner/executors/docker.html)
7. [通过特权模式使用 Docker-in-Docker](https://docs.gitlab.com/runner/executors/docker.html#use-docker-in-docker-with-privileged-mode)
    1. [极狐 GitLab 中文文档](https://docs.gitlab.cn/runner/executors/docker.html#%E9%80%9A%E8%BF%87%E7%89%B9%E6%9D%83%E6%A8%A1%E5%BC%8F%E4%BD%BF%E7%94%A8-docker-in-docker)
8. [GitLab CI/CD Services](https://docs.gitlab.com/ee/ci/services/)
    1. [极狐 GitLab 中文文档](https://docs.gitlab.cn/jh/ci/services/)

## 说明

1. GitLab Runner 注册到 GitLab 的操作请参见上面章节中的
   [CentOS 安装 GitLab Runner](/docs/gitlab-runner/centos-install.md)，
   只需要将**流水线的执行器**设置成**kubernetes**即可，然后执行流水线，会出现问题，按照下方内容去解决
2. 本文采用遇见什么错误，增加对应的配置来介绍 GitLab Runner、Kubernetes 的配置

## 配置

1. 运行流水线，出现问题
    ```shell
    Using Kubernetes namespace: default
    ERROR: Preparation failed: getting Kubernetes config: 
    invalid configuration: 
    no configuration has been provided, 
    try setting KUBERNETES_MASTER environment variable
    ```
   原因：k8s地址未配置
   修改文件
    ```shell
    vim /etc/gitlab-runner/config.toml
    ```
   修改对应流水线的配置内容如下
    ```shell
    [runners.kubernetes]
        # k8s 地址
        host = "https://192.168.80.130:6443"
    ```

2. 运行流水线，出现问题
    ```shell
    ERROR: Job failed (system failure): 
    prepare environment: setting up credentials: 
    Post "https://192.168.61.139:6443/api/v1/namespaces/default/secrets": 
    x509: certificate signed by unknown authority. 
    Check https://docs.gitlab.com/runner/shells/index.html#shell-profile-loading for more information
    ```
   原因：k8s证书未配置
   修改文件
    ```shell
    vim /etc/gitlab-runner/config.toml
    ```
   修改对应流水线的配置内容如下
    ```shell
    [runners.kubernetes]
        # k8s 证书
        ca_file = "/etc/kubernetes/pki/ca.crt"
    ```

3. 运行流水线，出现问题
    ```shell
    ERROR: Job failed (system failure): 
    prepare environment: setting up credentials: secrets is forbidden: 
    User "system:anonymous" cannot create resource "secrets" in API group "" in the namespace "default". 
    Check https://docs.gitlab.com/runner/shells/index.html#shell-profile-loading for more information
    ```
   原因：k8s账户未配置
   修改文件
    ```shell
    vim /etc/gitlab-runner/config.toml
    ```
   修改对应流水线的配置内容如下
    ```shell
    [runners.kubernetes]
        # service 账户配置
        # 设置 服务授权的名称
        service_account = "gitlab-runner"
        bearer_token = "先随便写一个"
        bearer_token_overwrite_allowed = true
    ```

4. 运行流水线，出现问题
    ```shell
    ERROR: Job failed (system failure): 
    prepare environment: setting up credentials: Unauthorized. 
    Check https://docs.gitlab.com/runner/shells/index.html#shell-profile-loading for more information
    ```
   原因：k8s凭证不正确，需要：创建命名空间、创建角色、创建服务账户并授权命名空间、创建服务账户在命名空间的token
   修改文件
    ```shell
    vim /etc/gitlab-runner/config.toml
    ```
   修改对应流水线的配置内容如下
    ```shell
    # 创建命名空间
    kubectl create namespace gitlab
    
    
    # 创建角色 gitlab-runner 前，要求命名空间 gitlab 必须存在
    
    cat > role.yaml << EOF
    
    apiVersion: rbac.authorization.k8s.io/v1
    kind: Role
    metadata:
      name: gitlab-runner
      namespace: gitlab
    rules:
      - apiGroups: ["*"]
        resources: ["pods"]
        verbs: ["list", "get", "watch", "create", "delete"]
      - apiGroups: ["*"]
        resources: ["pods/exec"]
        verbs: ["create"]
      - apiGroups: ["*"]
        resources: ["pods/log"]
        verbs: ["get"]
      - apiGroups: ["*"]
        resources: ["pods/attach"]
        verbs: ["list", "get", "create", "delete", "update"]
      - apiGroups: ["*"]
        resources: ["secrets"]
        verbs: ["list", "get", "create", "delete", "update"]      
      - apiGroups: ["*"]
        resources: ["configmaps"]
        verbs: ["list", "get", "create", "delete", "update"]
    
    EOF
    
    cat role.yaml
    
    kubectl apply -f role.yaml
    
    # 命名空间授权
    kubectl create serviceaccount gitlab-runner -n gitlab
    
    # 创建用户操作命名空间的Token，指定有效时间，单位是秒，315360000s代表10年
    kubectl create token gitlab-runner -n gitlab --duration=315360000s
    
    vim /etc/gitlab-runner/config.toml
    
    [runners.kubernetes]
        # service 账户配置
        # 设置 服务授权的名称
        service_account = "gitlab-runner"
        bearer_token = "填写上述生成的token"
    ```

5. 运行流水线，出现问题
    ```shell
    ERROR: Job failed (system failure): 
    prepare environment: setting up credentials: 
    secrets is forbidden: User "system:serviceaccount:gitlab:gitlab-runner" cannot create resource "secrets" in API group "" in the namespace "default". 
    Check https://docs.gitlab.com/runner/shells/index.html#shell-profile-loading for more information
    ```
   原因：要设置上述创建的命名空间
   修改文件
    ```shell
    vim /etc/gitlab-runner/config.toml
    ```
   修改对应流水线的配置内容如下
    ```shell
    [runners.kubernetes]
        namespace = "gitlab"
    ```

6. 运行流水线，出现问题
    ```shell
    ERROR: Job failed (system failure): 
    prepare environment: setting up credentials: 
    secrets is forbidden: User "system:serviceaccount:gitlab:gitlab-runner" cannot create resource "secrets" in API group "" in the namespace "gitlab". 
    Check https://docs.gitlab.com/runner/shells/index.html#shell-profile-loading for more information
    ```
   原因：创建角色绑定，将角色gitlab-runner、命名空间gitlab设置服务账户gitlab:gitlab-runner并命名为gitlab-runner

   修改对应流水线的配置内容如下
    ```shell
    kubectl create rolebinding gitlab-runner --namespace=gitlab --role=gitlab-runner --serviceaccount=gitlab:gitlab-runner
    ```

7. 运行流水线，出现问题
    ```shell
    WARNING: Failed to pull image with policy "": 
    image pull failed: rpc error: 
    code = Unknown 
    desc = failed to pull and unpack image "registry.gitlab.com/gitlab-org/gitlab-runner/gitlab-runner-helper:x86_64-7178588d": 
    failed to resolve reference "registry.gitlab.com/gitlab-org/gitlab-runner/gitlab-runner-helper:x86_64-7178588d": 
    failed to do request: Head "https://registry.gitlab.com/v2/gitlab-org/gitlab-runner/gitlab-runner-helper/manifests/x86_64-7178588d": 
    dial tcp 35.227.35.254:443: connect: connection refused
    ERROR: Job failed: prepare environment: 
    waiting for pod running: 
    pulling image "registry.gitlab.com/gitlab-org/gitlab-runner/gitlab-runner-helper:x86_64-7178588d": 
    image pull failed: rpc error: 
    code = Unknown 
    desc = failed to pull and unpack image "registry.gitlab.com/gitlab-org/gitlab-runner/gitlab-runner-helper:x86_64-7178588d": 
    failed to resolve reference "registry.gitlab.com/gitlab-org/gitlab-runner/gitlab-runner-helper:x86_64-7178588d": 
    failed to do request: Head "https://registry.gitlab.com/v2/gitlab-org/gitlab-runner/gitlab-runner-helper/manifests/x86_64-7178588d": 
    dial tcp 35.227.35.254:443: connect: connection refused. 
    Check https://docs.gitlab.com/runner/shells/index.html#shell-profile-loading for more information
    ```
   原因：下载gitlab-runner-helper失败，需要手动上设置helper_image
   修改文件
    ```shell
    vim /etc/gitlab-runner/config.toml
    ```
   修改对应流水线的配置内容如下
    ```shell
    # 选择适合的gitlab-runner-helper版本
    
    [runners.kubernetes]
        # helper_image="gitlab/gitlab-runner-helper:x86_64-${CI_RUNNER_REVISION}"
        # 由于 gitlab 将 gitlab-runner-helper 发布到 hub.docker.com 的时间较慢，可以会用 bitnami/gitlab-runner-helper
        # 也可以使用 xuxiaoweicomcn/gitlab-runner-helper：所有镜像均为 registry.gitlab.com/gitlab-org/gitlab-runner/gitlab-runner-helper 中拉取并上传的，未做任何修改
            # bitnami/gitlab-runner-helper:15.6.1
        helper_image = "gitlab/gitlab-runner-helper:x86_64-v14.10.2"
    ```

8. 运行流水线，出现问题
    ```shell
    ERROR: Job failed (system failure): 
    prepare environment: waiting for pod running: 
    timed out waiting for pod to start. 
    Check https://docs.gitlab.com/runner/shells/index.html#shell-profile-loading for more information
    ```
   原因：创建 pod 时需要 helper_image，但是拉取超时，可手动拉取 helper_image；拉取流水线所用的镜像超时，可手动拉取
    ```shell
    # 执行过程可使用 kubectl -n gitlab describe pod pod的名称，查看状态，pod的名称可在流水线中看到
    ctr -n=k8s.io image pull docker.io/gitlab/gitlab-runner-helper:x86_64-v14.10.2
    # ctr -n=k8s.io image pull docker.io/bitnami/gitlab-runner-helper:15.6.1
    # 也可以使用 xuxiaoweicomcn/gitlab-runner-helper：所有镜像均为 registry.gitlab.com/gitlab-org/gitlab-runner/gitlab-runner-helper 中拉取并上传的，未做任何修改
    
    # 假如流水线使用的镜像是 node:16.0.0
    ctr -n=k8s.io image pull docker.io/node:16.0.0
    
    ctr -n=k8s.io image list
    ```

9. 如果要在 k8s 中使用 Docker，方案如下：

    1. 方案 1（**不推荐**）：
       在 k8s 各节点上安装 docker，并设置 docker 开机，流水线运行时挂载 `docker.sock`，需要在 GitLab Runner 中配置如下，详情参见：
       [GitLab Runner、Kubernetes（k8s）配置](/docs/gitlab-runner/k8s-configuration.md)

        ```shell
        [[runners]]
          ...
          [runners.kubernetes]
            ...
            [runners.kubernetes.volumes]
            [[runners.kubernetes.volumes.host_path]]
              name = "docker"
              mount_path = "/var/run/docker.sock"
              host_path = "/var/run/docker.sock"
        ```
    2. 方案 2（**推荐**）：
       以特权身份运行流水线，
       [GitLab CI/CD Services 中文文档](https://docs.gitlab.cn/jh/ci/services/)，
       需要在 GitLab Runner 中配置如下：

        ```shell
        [[runners]]
          ...
          [runners.kubernetes]
            ...
            privileged = true
        ```

       [使用 docker.sock 端口 示例](https://framagit.org/mirrors-gitee/log4j/pig/-/blob/xuxiaowei/k8s/.gitlab-ci.yml)

        ```yaml
        stages:
          # 阶段名称：构建
          - build
        
        # job 名称
        build:
          # 阶段名称
          stage: build
          # 环境变量
          variables:
            # maven 环境变量
            MAVEN_OPTS: >-
              -Dhttps.protocols=TLSv1.2
              -Dmaven.repo.local=$CI_PROJECT_DIR/.m2/repository
              -Dorg.slf4j.simpleLogger.showDateTime=true
              -Djava.awt.headless=true
            # 颜色定义
            COLOR_BLUE: \033[34m
            COLOR_GREEN: \033[92m
            COLOR_RED: \033[31m
            COLOR_RESET: \033[0m
            COLOR_YELLOW: \033[93m
          # 镜像
          image: maven:3.6.3-openjdk-17
          # 使用的服务
          # 如果是基于 k8s 运行流水线，请以特权身份运行（在 /etc/gitlab-runner/config.toml 中配置 privileged = true），否则无法使用 services
          # 由于要访问域名 nexus.xuxiaowei.cn、pig.docker.xuxiaowei.cn，所以在 /etc/gitlab-runner/config.toml 中配置了对应的 runners.kubernetes.host_aliases
          services:
            # 使用 docker 服务，用于构建 docker 镜像
            - name: docker:dind
              # 服务别名
              alias: docker-dind
              variables:
                # 关闭 TLS（仅使用 http）
                DOCKER_TLS_CERTDIR: ""
              # docker 镜像发布域名 pig.docker.xuxiaowei.cn（仅作者局域网可以访问）
              # 默认情况下域名 pig.docker.xuxiaowei.cn 证书可能不受信任（可能是非权威机构颁发的证书，也可能是容器镜像无法识别权威机构颁发的域名证书）
              # 信任域名证书
              command: [ "--insecure-registry=pig.docker.xuxiaowei.cn" ]
          # 执行脚本前的任务
          before_script:
            # 此处使用 http 而非 https，因为 https 证书可能不受信任（可能是非权威机构颁发的证书，也可能是容器镜像无法识别权威机构颁发的域名证书）
            # 下载的 settings-private.xml 配置文件里使用的也是 http 协议
            - echo -e $COLOR_BLUE'下载作者 Maven 私库配置文件（仅作者局域网可用）'$COLOR_RESET && curl -o settings-private.xml http://nexus.xuxiaowei.cn/repository/raw-hosted/maven/settings-private.xml
            - echo -e $COLOR_BLUE'查看作者 Maven 私库配置文件'$COLOR_RESET && cat settings-private.xml
          # 执行脚本
          script:
            - echo -e $COLOR_BLUE'使用作者 Maven 私库配置文件构建 jar 包'$COLOR_RESET && mvn clean -U install -s settings-private.xml
            - echo -e $COLOR_BLUE'将所有 *.xml 文件中的 <image> <name> 标签增加 CI_PIPELINE_ID 变量，CI_PIPELINE_ID 变量代表 流水线ID'$COLOR_RESET
            - find . -type f -name "*.xml" -exec sed -i 's|<name>\${docker.registry}/\${docker.namespace}/\${project.name}:\${project.version}</name>|<name>\${docker.registry}/\${docker.namespace}/\${project.name}:\${project.version}-\${CI_PIPELINE_ID}</name>|g' {} +
            - echo -e $COLOR_BLUE'使用作者 Maven 私库配置文件构建 docker 镜像'$COLOR_RESET && mvn -pl pig-auth docker:build -s settings-private.xml -Ddocker.host=$DOCKER_HOST -Ddocker.registry=$DOCKER_REGISTRY -Ddocker.username=$DOCKER_USERNAME -Ddocker.password=$DOCKER_PASSWORD
            - echo -e $COLOR_BLUE'使用作者 Maven 私库配置文件构建 docker 镜像'$COLOR_RESET && mvn -pl pig-auth docker:push -s settings-private.xml -Ddocker.host=$DOCKER_HOST -Ddocker.registry=$DOCKER_REGISTRY -Ddocker.username=$DOCKER_USERNAME -Ddocker.password=$DOCKER_PASSWORD
            - echo -e $COLOR_BLUE'使用作者 Maven 私库配置文件构建 docker 镜像'$COLOR_RESET && mvn -pl pig-gateway docker:build -s settings-private.xml -Ddocker.host=$DOCKER_HOST -Ddocker.registry=$DOCKER_REGISTRY -Ddocker.username=$DOCKER_USERNAME -Ddocker.password=$DOCKER_PASSWORD
            - echo -e $COLOR_BLUE'使用作者 Maven 私库配置文件构建 docker 镜像'$COLOR_RESET && mvn -pl pig-gateway docker:push -s settings-private.xml -Ddocker.host=$DOCKER_HOST -Ddocker.registry=$DOCKER_REGISTRY -Ddocker.username=$DOCKER_USERNAME -Ddocker.password=$DOCKER_PASSWORD
            - echo -e $COLOR_BLUE'使用作者 Maven 私库配置文件构建 docker 镜像'$COLOR_RESET && mvn -pl pig-upms/pig-upms-biz docker:build -s settings-private.xml -Ddocker.host=$DOCKER_HOST -Ddocker.registry=$DOCKER_REGISTRY -Ddocker.username=$DOCKER_USERNAME -Ddocker.password=$DOCKER_PASSWORD
            - echo -e $COLOR_BLUE'使用作者 Maven 私库配置文件构建 docker 镜像'$COLOR_RESET && mvn -pl pig-upms/pig-upms-biz docker:push -s settings-private.xml -Ddocker.host=$DOCKER_HOST -Ddocker.registry=$DOCKER_REGISTRY -Ddocker.username=$DOCKER_USERNAME -Ddocker.password=$DOCKER_PASSWORD
            - echo -e $COLOR_BLUE'使用作者 Maven 私库配置文件构建 docker 镜像'$COLOR_RESET && mvn -pl pig-visual/pig-codegen docker:build -s settings-private.xml -Ddocker.host=$DOCKER_HOST -Ddocker.registry=$DOCKER_REGISTRY -Ddocker.username=$DOCKER_USERNAME -Ddocker.password=$DOCKER_PASSWORD
            - echo -e $COLOR_BLUE'使用作者 Maven 私库配置文件构建 docker 镜像'$COLOR_RESET && mvn -pl pig-visual/pig-codegen docker:push -s settings-private.xml -Ddocker.host=$DOCKER_HOST -Ddocker.registry=$DOCKER_REGISTRY -Ddocker.username=$DOCKER_USERNAME -Ddocker.password=$DOCKER_PASSWORD
            - echo -e $COLOR_BLUE'使用作者 Maven 私库配置文件构建 docker 镜像'$COLOR_RESET && mvn -pl pig-visual/pig-monitor docker:build -s settings-private.xml -Ddocker.host=$DOCKER_HOST -Ddocker.registry=$DOCKER_REGISTRY -Ddocker.username=$DOCKER_USERNAME -Ddocker.password=$DOCKER_PASSWORD
            - echo -e $COLOR_BLUE'使用作者 Maven 私库配置文件构建 docker 镜像'$COLOR_RESET && mvn -pl pig-visual/pig-monitor docker:push -s settings-private.xml -Ddocker.host=$DOCKER_HOST -Ddocker.registry=$DOCKER_REGISTRY -Ddocker.username=$DOCKER_USERNAME -Ddocker.password=$DOCKER_PASSWORD
            - echo -e $COLOR_BLUE'使用作者 Maven 私库配置文件构建 docker 镜像'$COLOR_RESET && mvn -pl pig-visual/pig-quartz docker:build -s settings-private.xml -Ddocker.host=$DOCKER_HOST -Ddocker.registry=$DOCKER_REGISTRY -Ddocker.username=$DOCKER_USERNAME -Ddocker.password=$DOCKER_PASSWORD
            - echo -e $COLOR_BLUE'使用作者 Maven 私库配置文件构建 docker 镜像'$COLOR_RESET && mvn -pl pig-visual/pig-quartz docker:push -s settings-private.xml -Ddocker.host=$DOCKER_HOST -Ddocker.registry=$DOCKER_REGISTRY -Ddocker.username=$DOCKER_USERNAME -Ddocker.password=$DOCKER_PASSWORD
          # 缓存
          cache:
            # 缓存名称
            # 使用 job 名称
            key: "${CI_JOB_NAME}"
            # 缓存路径
            paths:
              - .m2/repository
          # 流水线标签：选择可执行流水线的机器
          tags:
            - plugin-kubernetes
          # 触发条件：触发流水线执行的条件
          only:
            # 仅在 xuxiaowei/k8s 分支上执行
            - xuxiaowei/k8s
        ```

## 问题

1. 如果克隆镜像时无法解析 GitLab 的域名，可以在 GitLab Runner 中自定义域名的IP（其他自定义域名同理）
    ```shell
    vim /etc/gitlab-runner/config.toml
    ```
    ```shell
    [[runners]]
      ...
      [runners.kubernetes]
        [[runners.kubernetes.host_aliases]]
          # 自定义 GitLab 的 IP
          ip = "192.168.80.14"
          hostnames = ["gitlab.example.com"]
        [[runners.kubernetes.host_aliases]]
          # 自定义 Docker host 的 IP
          ip = "192.168.80.33"
          hostnames = ["host.docker.example.xuxiaowei.cloud"]
        [[runners.kubernetes.host_aliases]]
          # 自定义 Docker 私库的 IP
          ip = "192.168.80.45"
          hostnames = ["registry.docker.example.xuxiaowei.cloud"]
    ```
