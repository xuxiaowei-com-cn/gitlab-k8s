---
sidebar_position: 5
---

# Docker-in-Docker（未完成）

## 说明

1. Docker-in-Docker：GitLab CI/CD 与 Docker、Kubernetes 结合使用来创建 Docker 镜像
2. [使用 Docker-in-Docker](https://docs.gitlab.cn/charts/charts/gitlab/gitlab-runner/#%E4%BD%BF%E7%94%A8-docker-in-docker)
3. [使用 Docker 构建 Docker 镜像](https://docs.gitlab.cn/jh/ci/docker/using_docker_build.html)
    1. [在 CI/CD 作业中启用 Docker 命令](https://docs.gitlab.cn/jh/ci/docker/using_docker_build.html#%E5%9C%A8-cicd-%E4%BD%9C%E4%B8%9A%E4%B8%AD%E5%90%AF%E7%94%A8-docker-%E5%91%BD%E4%BB%A4)
        1. [使用 shell executor](https://docs.gitlab.cn/jh/ci/docker/using_docker_build.html#%E4%BD%BF%E7%94%A8-shell-executor)
        2. [Docker-in-Docker](https://docs.gitlab.cn/jh/ci/docker/using_docker_build.html#%E4%BD%BF%E7%94%A8-docker-in-docker)
        3. [使用 Docker 套接字绑定](https://docs.gitlab.cn/jh/ci/docker/using_docker_build.html#%E4%BD%BF%E7%94%A8-docker-%E5%A5%97%E6%8E%A5%E5%AD%97%E7%BB%91%E5%AE%9A)

## [示例](https://jihulab.com/xuxiaowei-com-cn/docker-in-docker)

### 示例1：使用 docker 命令构建docker镜像

GitLab Runner 支持执行器：docker+machine、docker、Kubernetes

- 分支说明
    1. `main` 分支：直接制作 Docker 镜像
    2. `maven` 分支：编译 Maven 项目后，制作 Docker 镜像
    3. `node` 分支：编译 Node 项目后，制作 Docker 镜像
- **本示例最简单**

### 示例2：使用宿主机 docker.sock 构建docker镜像

GitLab Runner 支持执行器：docker、Kubernetes（docker+machine 请使用 示例1）

- 分支说明
    1. `docker.sock/main`分支： 宿主机 docker.sock 直接制作 Docker 镜像
    2. `docker.sock/maven`分支： 宿主机 docker.sock 编译 Maven 项目后，制作 Docker 镜像
    3. `docker.sock/node`分支： 宿主机 docker.sock 编译 Node 项目后，制作 Docker 镜像
- **本示例主要区别是使用宿主机 docker.sock 来构建 docker 镜像，需要配置 GitLab Runner 的挂载卷（执行器选择 docker 或
  Kubernetes）**

1. GitLab Runner Docker 执行器（GitLab Runner 宿主机需要正常安装docker）

   注册 GitLab Runner Docker 执行器后，配置大致为：

    ```shell
    [[runners]]
      name = "docker.sock"
      url = "http://192.168.61.147/"
      id = 3
      token = "Token凭证"
      token_obtained_at = 2023-06-21T00:22:46Z
      token_expires_at = 0001-01-01T00:00:00Z
      executor = "docker"
      [runners.cache]
        MaxUploadedArchiveSize = 0
      [runners.docker]
        tls_verify = false
        image = "ruby:2.7"
        privileged = false
        disable_entrypoint_overwrite = false
        oom_kill_disable = false
        disable_cache = false
        volumes = ["/cache"]
        shm_size = 0
    ```

   增加挂载卷

    ```shell
    [[runners]]
      name = "docker.sock"
      url = "http://192.168.61.147/"
      id = 3
      token = "Token凭证"
      token_obtained_at = 2023-06-21T00:22:46Z
      token_expires_at = 0001-01-01T00:00:00Z
      executor = "docker"
      [runners.cache]
        MaxUploadedArchiveSize = 0
      [runners.docker]
        tls_verify = false
        image = "ruby:2.7"
        privileged = true
        disable_entrypoint_overwrite = false
        oom_kill_disable = false
        disable_cache = false
        # 增加 /var/run/docker.sock 用于支持 docker 命令
        # 增加 /run/containerd/containerd.sock 用于支持 ctr 命令，可选
        volumes = ["/var/run/docker.sock:/var/run/docker.sock", "/run/containerd/containerd.sock:/run/containerd/containerd.sock", "/cache"]
        shm_size = 0
    ```

2. GitLab Runner Kubernetes 执行器

   注册 GitLab Runner Kubernetes 执行器并正确配置后，配置大致为：

    ```shell
    [[runners]]
      name = "k8s docker.sock"
      url = "http://192.168.61.147/"
      id = 12872
      token = "Token凭证"
      token_obtained_at = 2023-06-21T06:08:59Z
      token_expires_at = 0001-01-01T00:00:00Z
      executor = "kubernetes"
      [runners.cache]
        MaxUploadedArchiveSize = 0
      [runners.kubernetes]
        host = "https://192.168.61.147:6443"
        ca_file = "/etc/kubernetes/pki/ca.crt"
        service_account = "gitlab-runner"
        bearer_token = "k8s Token凭证"
        bearer_token_overwrite_allowed = true
        image = "ruby:2.7"
        namespace = "gitlab"
        # registry.gitlab.com/gitlab-org/gitlab-runner/gitlab-runner-helper:x86_64-85586bd1
        # registry.gitlab.com/gitlab-org/gitlab-runner/gitlab-runner-helper:x86_64-v16.0.2
        # registry.jihulab.com/xuxiaowei-com-cn/docker-in-docker/gitlab-runner/gitlab-runner-helper:x86_64-85586bd1
        # registry.jihulab.com/xuxiaowei-com-cn/docker-in-docker/gitlab-runner/gitlab-runner-helper:x86_64-v16.0.2
        # xuxiaoweicomcn/gitlab-runner-helper:x86_64-85586bd1
        # xuxiaoweicomcn/gitlab-runner-helper:x86_64-v16.0.2
        helper_image = "registry.jihulab.com/xuxiaowei-com-cn/docker-in-docker/gitlab-runner/gitlab-runner-helper:x86_64-v16.0.2" 
        namespace_overwrite_allowed = ""
        node_selector_overwrite_allowed = ""
        pod_labels_overwrite_allowed = ""
        service_account_overwrite_allowed = ""
        pod_annotations_overwrite_allowed = ""
        [runners.kubernetes.pod_security_context]
        [runners.kubernetes.init_permissions_container_security_context]
        [runners.kubernetes.build_container_security_context]
        [runners.kubernetes.helper_container_security_context]
        [runners.kubernetes.service_container_security_context]
        [runners.kubernetes.volumes]
        [runners.kubernetes.dns_config]
    ```

   增加挂载卷

    ```shell
    [[runners]]
      name = "k8s docker.sock"
      url = "http://192.168.61.147/"
      id = 12872
      token = "Token凭证"
      token_obtained_at = 2023-06-21T06:08:59Z
      token_expires_at = 0001-01-01T00:00:00Z
      executor = "kubernetes"
      [runners.cache]
        MaxUploadedArchiveSize = 0
      [runners.kubernetes]
        host = "https://192.168.61.147:6443"
        ca_file = "/etc/kubernetes/pki/ca.crt"
        service_account = "gitlab-runner"
        bearer_token = "k8s Token凭证"
        bearer_token_overwrite_allowed = true
        image = "ruby:2.7"
        namespace = "gitlab"
        # registry.gitlab.com/gitlab-org/gitlab-runner/gitlab-runner-helper:x86_64-85586bd1
        # registry.gitlab.com/gitlab-org/gitlab-runner/gitlab-runner-helper:x86_64-v16.0.2
        # registry.jihulab.com/xuxiaowei-com-cn/docker-in-docker/gitlab-runner/gitlab-runner-helper:x86_64-85586bd1
        # registry.jihulab.com/xuxiaowei-com-cn/docker-in-docker/gitlab-runner/gitlab-runner-helper:x86_64-v16.0.2
        # xuxiaoweicomcn/gitlab-runner-helper:x86_64-85586bd1
        # xuxiaoweicomcn/gitlab-runner-helper:x86_64-v16.0.2
        helper_image = "registry.jihulab.com/xuxiaowei-com-cn/docker-in-docker/gitlab-runner/gitlab-runner-helper:x86_64-v16.0.2" 
        namespace_overwrite_allowed = ""
        node_selector_overwrite_allowed = ""
        pod_labels_overwrite_allowed = ""
        service_account_overwrite_allowed = ""
        pod_annotations_overwrite_allowed = ""
        [runners.kubernetes.pod_security_context]
        [runners.kubernetes.init_permissions_container_security_context]
        [runners.kubernetes.build_container_security_context]
        [runners.kubernetes.helper_container_security_context]
        [runners.kubernetes.service_container_security_context]
        [runners.kubernetes.volumes]
        [[runners.kubernetes.volumes.host_path]]
          # 增加 /var/run/docker.sock 用于支持 docker 命令
          name = "docker"
          mount_path = "/var/run/docker.sock"
          host_path = "/var/run/docker.sock"
        [[runners.kubernetes.volumes.host_path]]
          # 增加 /run/containerd/containerd.sock 用于支持 ctr 命令
          name = "containerd"
          mount_path = "/run/containerd/containerd.sock"
          host_path = "/run/containerd/containerd.sock"
        [[runners.kubernetes.volumes.host_path]]
          # 增加 /usr/bin/kubectl 用于支持 kubectl 命令
          name = "kubectl"
          mount_path = "/usr/bin/kubectl"
          host_path = "/usr/bin/kubectl"
        [runners.kubernetes.dns_config]
    ```

### 示例3：使用 docker 远程调用端口构建docker镜像

- **本示例的主要区别是使用专用的服务器开放 docker 远程调用端口来构建 docker 镜像，即：使用专用服务器构建docker镜像**

