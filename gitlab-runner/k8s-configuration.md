# GitLab Runner、kubernetes（k8s）配置

## 资料

1. [kubernetes](https://docs.gitlab.com/runner/install/kubernetes)
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

## 说明

1. GitLab Runner 注册到 GitLab 的操作请参见上面章节中的[CentOS 安装 GitLab Runner](/gitlab-runner/centos-install.md)
   ，只需要将**流水线的执行器**设置成**kubernetes**即可，然后执行流水线，会出现问题，按照下方内容去解决
2. 本文采用遇见什么错误，增加对应的配置来介绍 GitLab Runner、kubernetes 的配置

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
    
    vim role.yaml
    
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
    
    kubectl apply -f role.yaml
    
    # 命名空间授权
    kubectl create serviceaccount gitlab-runner -n gitlab
    
    # 创建用户操作命名空间的Token，指定有效时间，单位是秒，315360000s代表10年
    kubectl create token gitlab-runner -n gitlab --duration=315360000s
    
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

9. **如需在 GitLab Runner 中使用执行器 kubernetes 构建 Docker 镜像，需要配置下列内容，并且主机的 docker.socket
   处于运行状态（并设置开机自启）**

   流水线设置参见：[https://gitlab.com/xuxiaowei-com-cn/dragonwell8](https://gitlab.com/xuxiaowei-com-cn/dragonwell8)
    ```shell
    systemctl start docker.socket
    systemctl enable docker.socket
    ```
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
