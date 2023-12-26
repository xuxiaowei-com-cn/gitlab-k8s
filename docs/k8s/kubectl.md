---
sidebar_position: 3
---

# kubectl 命令行工具

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
- [在 Windows 上安装 kubectl](https://kubernetes.io/zh-cn/docs/tasks/tools/install-kubectl-windows/)

## 在 k8s 集群的 Control Plane（Master） 节点上运行 kubectl

### 正常情况下 Control Plane（Master）节点 可以直接运行 `kubectl` 命令

1. 个人建议仅在管理员直接操作集群时，才在 Control Plane（Master）节点上执行
2. 流水线操作 k8s 时（比如：发布项目）参见下方：
   [在 GitLab Runner 流水线中运行 kubectl](#在-dockerk8s-中运行-kubectl)

### <strong><font color="red">强烈不建议执行流水线</font></strong>时直接在 Control Plane（Master） 节点 上 运行

1. 因为这样是直接操作 宿主机，此方式是不安全的，比如：

    1. 拥有流水线权限的人，如果在流水线中写了 `rm -rf /` 并运行了流水线，使宿主机文件被删除，导致宿主机数据丢失并宕机。如果是在容器内，将不会影响到宿主机的安全。

2. 流水线操作 k8s 时（比如：发布项目）参见下方：
   [在 GitLab Runner 流水线中运行 kubectl](#在-dockerk8s-中运行-kubectl)

## 在 k8s 集群的 Node 节点上运行 kubectl（不推荐）

### 方案1

1. 将主节点的配置文件 `/etc/kubernetes/admin.conf` 复制到工作节点的 `$HOME/.kube/config`

### 方案2

1. `/etc/kubernetes/admin.conf` 复制到磁盘的某个位置
2. 设置环境变量 `KUBECONFIG` 指向上述文件

## 在 Linux 中运行 kubectl

- 参见 [阿里云 Kubernetes镜像](https://developer.aliyun.com/mirror/kubernetes)
- 以 CentOS 为例
- 仅安装 kubectl（请使用与集群相同版本的 kubectl）即可

### 添加 k8s 仓库

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

### 安装 kubectl

```shell
# 搜索 kubectl 可用版本
# yum --showduplicates list kubectl

# 安装 kubectl 指定版本，比如：1.27.3-0
# yum install -y kubectl-1.27.3-0

# 安装最新版本（可能不兼容）
yum install -y kubectl
```

### [启用 shell 自动补全功能](https://kubernetes.io/zh-cn/docs/tasks/tools/install-kubectl-linux/#optional-kubectl-configurations)

```shell
yum install -y bash-completion
source /etc/profile
```

```shell
kubectl completion bash | sudo tee /etc/bash_completion.d/kubectl > /dev/null
sudo chmod a+r /etc/bash_completion.d/kubectl
source ~/.bashrc
```

### 测试 `kubectl` 命令

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

### 剩余配置参见：[在 k8s 集群的 Node 节点上运行 kubectl](#在-k8s-集群的-node-节点上运行-kubectl不推荐)

## 在 docker/k8s 中运行 kubectl

### 使用 [bitnami/kubectl](https://hub.docker.com/r/bitnami/kubectl) 镜像

### 剩余配置参见：[在 k8s 集群的 Node 节点上运行 kubectl](#在-k8s-集群的-node-节点上运行-kubectl不推荐)

## 在 Windows 中运行 kubectl

### 下载 Windows 可执行 kubectl

1. 下载地址：https://dl.k8s.io/release/v1.28.0/bin/windows/amd64/kubectl.exe

   请注意，<strong><font color="red">链接中的 v1.28.0 是 kubectl 的版本号，
   为了防止不可控因素，推荐使用与已安装的 k8s 相同的版本</font></strong>

### 配置自动提示

1. 在 `C:\Users\%USERNAME%\Documents\WindowsPowerShell` 文件夹下添加文件 `Microsoft.PowerShell_profile.ps1`，文件内容为
   `kubectl completion powershell | Out-String | Invoke-Expression`，
   示例：[Microsoft.PowerShell_profile.ps1](static/Microsoft.PowerShell_profile.ps1)

### 剩余配置参见：[在 k8s 集群的 Node 节点上运行 kubectl](#在-k8s-集群的-node-节点上运行-kubectl不推荐)

### 打开 `PowerShell` 即可使用 `kubectl` 命令自动提示了

## 在单台机器使用单个配置文件快速控制多个 k8s 集群

### kubectl 配置文件是 `yaml` 格式

1. 配置示例

    ```yaml
    apiVersion: v1
    # 集群配置
    clusters:
      # 单个集群配置
      - cluster:
          certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0 ...
          server: https://192.168.0.10:6443
        name: kubernetes
    # 上下文配置
    contexts:
      # 单个上下文配置
      - context:
          cluster: kubernetes
          user: kubernetes-admin
        name: kubernetes-admin@kubernetes
    # 当前使用的上下文配置
    current-context: kubernetes-admin@kubernetes
    kind: Config
    preferences: { }
    # 用户配置
    users:
      # 单个用户配置
      - name: kubernetes-admin
        user:
          client-certificate-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FU ...
          client-key-data: LS0tLS1CRUdJTiBSU0EgUFJ ...
    ```

2. 由上述 kubectl 配置文件示例可知，`集群配置`、`上下文配置`、`用户配置` 均可以填写多个，
   当前使用的配置是由 `current-context`（当前上下文） 控制的，所以可以将多个 k8s 集群的配置文件合并成一个，
   并使用 `current-context`（当前上下文） 控制当前正在使用的 k8s 集群

3. 修改 `current-context`（当前上下文） 的命令为

    ```shell
    kubectl config use-context 当前上下文名称
    
    # 如果有必要，可以使用下列命令控制某个文件进行修改 current-context（当前上下文）
    # kubectl config use-context 当前上下文名称 --kubeconfig=文件名
    ```

4. 多个 k8s 配置文件合并示例

    ```yaml
    apiVersion: v1
    # 集群配置
    clusters:
      # 单个集群配置
      - cluster:
          certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0 ...
          server: https://192.168.0.10:6443
        name: kubernetes
      # 单个集群配置
      - cluster:
          certificate-authority-data: URBTkJna3Foa2lHOXcwQkFRc0Z ...
          server: https://192.168.0.20:6443
        name: test-cluster
    # 上下文配置
    contexts:
      # 单个上下文配置
      - context:
          cluster: kubernetes
          user: kubernetes-admin
        name: kubernetes-admin@kubernetes
      # 单个上下文配置
      - context:
          cluster: test-cluster
          namespace: test-namespace
          user: test-user
        name: test-context
    # 当前使用的上下文配置
    current-context: kubernetes-admin@kubernetes
    kind: Config
    preferences: { }
    # 用户配置
    users:
      # 单个用户配置
      - name: kubernetes-admin
        # 注意：用户凭证可能使用不同的形式
        user:
          client-certificate-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FU ...
          client-key-data: LS0tLS1CRUdJTiBSU0EgUFJ ...
      # 单个用户配置
      - name: test-user
        # 注意：用户凭证可能使用不同的形式
        user:
          token: eyJhbGciOiJSUzI1NiIsImt ...
    ```

5. 获取当前的 Kubernetes 配置

    ```shell
    kubectl config current-context
    ```

   返回示例，如：`kubernetes-admin@kubernetes` 或 `test-context`

6. 查看完整的配置信息

    ```shell
    kubectl config view
    ```

   返回示例，如：

    ```yaml
    apiVersion: v1
    clusters:
      - cluster:
          certificate-authority-data: DATA+OMITTED
          server: https://192.168.0.10:6443
        name: kubernetes
      - cluster:
          certificate-authority-data: DATA+OMITTED
          server: https://192.168.0.20:6443
        name: test-cluster
    contexts:
      - context:
          cluster: kubernetes
          user: kubernetes-admin
        name: kubernetes-admin@kubernetes
      - context:
          cluster: test-cluster
          namespace: test-namespace
          user: test-user
        name: test-context
    current-context: kubernetes-admin@kubernetes
    kind: Config
    preferences: { }
    users:
      - name: kubernetes-admin
        user:
          client-certificate-data: DATA+OMITTED
          client-key-data: DATA+OMITTED
      - name: test-user
        user:
          token: REDACTED
    ```
