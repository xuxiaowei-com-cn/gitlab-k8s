---
sidebar_position: 2
---

# kubectl 命令行工具（未完成）

Kubernetes 提供 kubectl 是使用 Kubernetes API 与 Kubernetes 集群的控制面进行通信的命令行工具。

## 文档

- [kubectl 命令行工具](https://kubernetes.io/zh-cn/docs/reference/kubectl/)
    - [集群内身份验证和命名空间覆盖](https://kubernetes.io/zh-cn/docs/reference/kubectl/#in-cluster-authentication-and-namespace-overrides)
- [kubectl-commands](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands)
- [github](https://github.com/kubernetes/kubectl)
- docker 镜像 bitnami/kubectl
    - [简介](https://hub.docker.com/r/bitnami/kubectl)
    - [标签](https://hub.docker.com/r/bitnami/kubectl/tags)
    - [github](https://github.com/bitnami/containers/tree/main/bitnami/kubectl)

## 说明

## 在 k8s 集群的 Control Plane（Master） 节点上运行 kubectl

1. 正常情况下 Control Plane（Master）节点 可以直接运行 `kubectl` 命令

    1. 个人建议仅在管理员直接操作集群时，才在 Control Plane（Master）节点上执行
    2. 流水线操作 k8s 时（比如：发布项目）参见下方：
       [在 GitLab Runner 流水线中运行 kubectl](#在-gitlab-runner-流水线中运行-kubectl)

2. <strong><font color="red">强烈不建议执行流水线</font></strong>时直接在 Control Plane（Master） 节点 上 运行

    1. 因为这样是直接操作 宿主机，此方式是不安全的，比如：

        1. 拥有流水线权限的人，如果在流水线中写了 `rm -rf /` 并运行了流水线，使宿主机文件被删除，导致宿主机数据丢失并宕机。如果是在容器内，将不会影响到宿主机的安全。

    2. 流水线操作 k8s 时（比如：发布项目）参见下方：
       [在 GitLab Runner 流水线中运行 kubectl](#在-gitlab-runner-流水线中运行-kubectl)

## 在 k8s 集群的 Node 节点上运行 kubectl（不推荐）

## 在 k8s 集群中运行 kubectl（使用 pod、deployment）

## 在 Linux 中运行 kubectl

- 参见 [阿里云 Kubernetes镜像](https://developer.aliyun.com/mirror/kubernetes)
- 以 CentOS 为例
- 仅安装 kubectl（请使用与集群相同版本的 kubectl）即可

1. 添加 k8s 仓库

    ```shell
    cat <<EOF > /etc/yum.repos.d/kubernetes.repo
    [kubernetes]
    name=Kubernetes
    baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
    enabled=1
    gpgcheck=1
    repo_gpgcheck=1
    gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
    
    EOF
    
    cat /etc/yum.repos.d/kubernetes.repo
    ```

2. 安装 kubectl

    ```shell
    # 搜索 kubectl 可用版本
    # yum --showduplicates list kubectl
    
    # 安装 kubectl 指定版本，比如：1.27.3-0
    # yum install -y kubectl-1.27.3-0
    
    # 安装最新版本（可能不兼容）
    yum install -y kubectl
    ```

3. [启用 shell 自动补全功能](https://kubernetes.io/zh-cn/docs/tasks/tools/install-kubectl-linux/#optional-kubectl-configurations)

    ```shell
    yum install -y bash-completion
    source /etc/profile
    ```

    ```shell
    kubectl completion bash | sudo tee /etc/bash_completion.d/kubectl > /dev/null
    sudo chmod a+r /etc/bash_completion.d/kubectl
    source ~/.bashrc
    ```

4. 测试 `kubectl` 命令

    ```shell
    [root@anolis ~]# kubectl get pod
    E0823 11:17:35.888322    1630 memcache.go:265] couldn't get current server API group list: Get "http://localhost:8080/api?timeout=32s": dial tcp [::1]:8080: connect: connection refused
    E0823 11:17:35.889920    1630 memcache.go:265] couldn't get current server API group list: Get "http://localhost:8080/api?timeout=32s": dial tcp [::1]:8080: connect: connection refused
    E0823 11:17:35.890325    1630 memcache.go:265] couldn't get current server API group list: Get "http://localhost:8080/api?timeout=32s": dial tcp [::1]:8080: connect: connection refused
    E0823 11:17:35.896153    1630 memcache.go:265] couldn't get current server API group list: Get "http://localhost:8080/api?timeout=32s": dial tcp [::1]:8080: connect: connection refused
    E0823 11:17:35.896688    1630 memcache.go:265] couldn't get current server API group list: Get "http://localhost:8080/api?timeout=32s": dial tcp [::1]:8080: connect: connection refused
    The connection to the server localhost:8080 was refused - did you specify the right host or port?
    [root@anolis ~]#
    ```

## 在 docker 中运行 kubectl

## 在 GitLab Runner 流水线中运行 kubectl
