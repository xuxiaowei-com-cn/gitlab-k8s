# Kubernetes（k8s）安装

## 文档

1. [等等，Docker 被 Kubernetes 弃用了?](https://dev.to/inductor/wait-docker-is-deprecated-in-kubernetes-now-what-do-i-do-e4m)
2. [容器运行时](https://kubernetes.io/zh-cn/docs/setup/production-environment/container-runtimes/)
3. [端口和协议](https://kubernetes.io/zh-cn/docs/reference/networking/ports-and-protocols/)
4. [kubeadm init](https://kubernetes.io/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/)
5. [kubeadm init phase](https://kubernetes.io/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/)
6. [kubeadm reset](https://kubernetes.io/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-reset/)
7. [kubeadm config](https://kubernetes.io/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-config/)
8. [安装网络策略驱动](https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/network-policy-provider/)
9. [使用 kubeadm 创建集群](https://kubernetes.io/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
    1. [控制平面节点隔离](https://kubernetes.io/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#control-plane-node-isolation)
10. [持久卷](https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes/)
11. [为容器设置环境变量](https://kubernetes.io/zh-cn/docs/tasks/inject-data-application/define-environment-variable-container/)
12. [在CentOS上安装Docker引擎](https://docs.docker.com/engine/install/centos/)
13. [Pod 网络无法访问排查处理](https://cloud.tencent.com/document/product/457/40332)

## 说明

1. 本文以 CentOS 7.9、k8s 1.25.3（文章首次发布于2022-10-30，是当时的最新版）为例
2. 本文固定了 k8s 的版本，防止不同版本存在差异，当你了解了某一版本的安装与使用，自己就可以尝试其他版本的安装了
3. 2022-11-18，经过测试，当前时间的最新版：1.25.4，同样适用于本文章
4. 由于 k8s 1.24 及之后的版本使用的是 containerd，之前的版本是 docker，故此文都安装并配置了，可以修改 k8s 的版本号进行学习、测试。

|     | 控制面板          | node 节点       |
|-----|---------------|---------------|
| 主机名 | k8s           | node-1        |
| IP  | 192.168.80.60 | 192.168.80.16 |

## 视频演示

<iframe src="//player.bilibili.com/player.html?aid=268082510&bvid=BV1zY41167aa&cid=1042231549&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="height: 500px;"></iframe>

# 安装

1. 安装所需工具

   ```shell
   sudo yum -y install vim
   sudo yum -y install wget
   ```

2. 将主机名指向本机IP，**主机名只能包含：字母、数字、-（横杠）、.（点）**
    1. 获取主机名

       ```shell
       hostname
       ```

    2. 临时设置主机名

       ```shell
       hostname 主机名
       ```

    3. 永久设置主机名

       ```shell
       sudo echo '主机名' > /etc/hostname
       ```

    4. 编辑 hosts

       ```shell
       sudo vim /etc/hosts
       ```

       控制面板：设置IP

       ```shell
       192.168.80.60 	k8s
       ```

       node 节点：设置IP

       ```shell
       192.168.80.16 	node-1
       ```

3. 安装并配置 ntpdate，同步时间

    ```shell
    sudo yum -y install ntpdate
    sudo ntpdate ntp1.aliyun.com
    sudo systemctl status ntpdate
    sudo systemctl start ntpdate
    sudo systemctl status ntpdate
    sudo systemctl enable ntpdate
    ```

4. 安装并配置 bash-completion，添加命令自动补充

    ```shell
    sudo yum -y install bash-completion
    source /etc/profile
    ```

5. 关闭防火墙、或者开通指定端口

    ```shell
    sudo systemctl stop firewalld.service 
    sudo systemctl disable firewalld.service
    ```

    ```shell
    # 控制面板
    firewall-cmd --zone=public --add-port=6443/tcp --permanent # Kubernetes API server	所有
    firewall-cmd --zone=public --add-port=2379/tcp --permanent # etcd server client API	kube-apiserver, etcd
    firewall-cmd --zone=public --add-port=2380/tcp --permanent # etcd server client API	kube-apiserver, etcd
    firewall-cmd --zone=public --add-port=10250/tcp --permanent # Kubelet API	自身, 控制面
    firewall-cmd --zone=public --add-port=10259/tcp --permanent # kube-scheduler	自身
    firewall-cmd --zone=public --add-port=10257/tcp --permanent # kube-controller-manager	自身
    firewall-cmd --zone=trusted --add-source=192.168.80.60 --permanent # 信任集群中各个节点的IP
    firewall-cmd --zone=trusted --add-source=192.168.80.16 --permanent # 信任集群中各个节点的IP
    firewall-cmd --add-masquerade --permanent # 端口转发
    firewall-cmd --reload
    firewall-cmd --list-all
    firewall-cmd --list-all --zone=trusted
    
    # 工作节点
    firewall-cmd --zone=public --add-port=10250/tcp --permanent # Kubelet API	自身, 控制面
    firewall-cmd --zone=public --add-port=30000-32767/tcp --permanent # NodePort Services†	所有
    firewall-cmd --zone=trusted --add-source=192.168.80.60 --permanent # 信任集群中各个节点的IP
    firewall-cmd --zone=trusted --add-source=192.168.80.16 --permanent # 信任集群中各个节点的IP
    firewall-cmd --add-masquerade --permanent # 端口转发
    firewall-cmd --reload
    firewall-cmd --list-all
    firewall-cmd --list-all --zone=trusted
    ```

6. 关闭交换空间

    ```shell
    free -h
    sudo swapoff -a
    sudo sed -i 's/.*swap.*/#&/' /etc/fstab
    free -h
    ```

7. 关闭 selinux

    ```shell
    getenforce
    cat /etc/selinux/config
    sudo setenforce 0
    sudo sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config
    cat /etc/selinux/config
    ```

8. 安装 Containerd、Docker
   **Docker 不是必须的，k8s 1.24.0 开始使用 Containerd 替代 Docker，但还是推荐安装 Docker，原因：在k8s中构建Docker镜像时使用，需要在GitLab
   Runner 中配置如下，详情参见：
   **[GitLab Runner、kubernetes（k8s）配置](../gitlab-runner/k8s-configuration.md)**

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

   /etc/containerd/config.toml 中的 SystemdCgroup = true 的优先级高于 /etc/docker/daemon.json 中的 cgroupdriver

    ```shell
    # https://docs.docker.com/engine/install/centos/
    # 经过测试，可不安装 docker 也可使 k8s 正常运行
    # 只需要不安装 docker-ce、docker-ce-cli、docker-compose-plugin 即可
    
    # 卸载旧 docker
    sudo yum remove docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine
    sudo yum install -y yum-utils
    sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
    # yum --showduplicates list docker-ce
    sudo yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # 启动 docker 时，会启动 containerd
    # sudo systemctl status containerd.service
    sudo systemctl stop containerd.service
    
    sudo cp /etc/containerd/config.toml /etc/containerd/config.toml.bak
    sudo containerd config default > $HOME/config.toml
    sudo cp $HOME/config.toml /etc/containerd/config.toml
    # 修改 /etc/containerd/config.toml 文件后，要将 docker、containerd 停止后，再启动
    sudo sed -i "s#registry.k8s.io/pause#registry.aliyuncs.com/google_containers/pause#g" /etc/containerd/config.toml
    # https://kubernetes.io/zh-cn/docs/setup/production-environment/container-runtimes/#containerd-systemd
    # 确保 /etc/containerd/config.toml 中的 disabled_plugins 内不存在 cri
    sudo sed -i "s#SystemdCgroup = false#SystemdCgroup = true#g" /etc/containerd/config.toml
    
    # containerd 忽略证书验证的配置
    #      [plugins."io.containerd.grpc.v1.cri".registry.configs]
    #        [plugins."io.containerd.grpc.v1.cri".registry.configs."192.168.0.12:8001".tls]
    #          insecure_skip_verify = true
    
    
    sudo systemctl enable --now containerd.service
    # sudo systemctl status containerd.service
    
    # sudo systemctl status docker.service
    sudo systemctl start docker.service
    # sudo systemctl status docker.service
    sudo systemctl enable docker.service
    sudo systemctl enable docker.socket
    sudo systemctl list-unit-files | grep docker
    
    sudo mkdir -p /etc/docker
    
    sudo tee /etc/docker/daemon.json <<-'EOF'
    {
      "registry-mirrors": ["https://hnkfbj7x.mirror.aliyuncs.com"],
      "exec-opts": ["native.cgroupdriver=systemd"]
    }
    EOF
    
    sudo systemctl daemon-reload
    sudo systemctl restart docker
    sudo docker info
    
    sudo systemctl status docker.service
    sudo systemctl status containerd.service
    ```

9. 添加阿里云 k8s 镜像仓库

    ```shell
    # 文档：https://developer.aliyun.com/mirror/kubernetes
    
    cat <<EOF > /etc/yum.repos.d/kubernetes.repo
    [kubernetes]
    name=Kubernetes
    baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
    # 是否开启本仓库
    enabled=1
    # 是否检查 gpg 签名文件
    gpgcheck=0
    # 是否检查 gpg 签名文件
    repo_gpgcheck=0
    gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
    
    EOF
    ```

10. 安装 k8s 1.25.3 所需依赖

    ```shell
    cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
    overlay
    br_netfilter
    EOF
    
    sudo modprobe overlay
    sudo modprobe br_netfilter
    ```

    ```shell
    # 设置所需的 sysctl 参数，参数在重新启动后保持不变
    cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
    net.bridge.bridge-nf-call-iptables  = 1
    net.bridge.bridge-nf-call-ip6tables = 1
    net.ipv4.ip_forward                 = 1
    
    EOF
    
    # 应用 sysctl 参数而不重新启动
    sudo sysctl --system
    ```

    ```shell
    # 通过运行以下指令确认 br_netfilter 和 overlay 模块被加载：
    lsmod | grep br_netfilter
    lsmod | grep overlay
    ```

    ```shell
    # 通过运行以下指令确认 net.bridge.bridge-nf-call-iptables、net.bridge.bridge-nf-call-ip6tables 和 net.ipv4.ip_forward 系统变量在你的 sysctl 配置中被设置为 1：
    sysctl net.bridge.bridge-nf-call-iptables net.bridge.bridge-nf-call-ip6tables net.ipv4.ip_forward
    ```

    ```shell
    # yum --showduplicates list kubelet --nogpgcheck
    # yum --showduplicates list kubeadm --nogpgcheck
    # yum --showduplicates list kubectl --nogpgcheck
    
    # 2023-02-07，经过测试，版本号：1.24.0，同样适用于本文章
    # sudo yum install -y kubelet-1.24.0-0 kubeadm-1.24.0-0 kubectl-1.24.0-0 --disableexcludes=kubernetes --nogpgcheck
    
    # 如果你看到有人说 node 节点不需要安装 kubectl，其实这种说法是错的，kubectl 会被当做依赖安装，如果安装过程没有指定 kubectl 的版本，则会安装最新版的 kubectl，可能会导致程序运行异常
    sudo yum install -y kubelet-1.25.3-0 kubeadm-1.25.3-0 kubectl-1.25.3-0 --disableexcludes=kubernetes --nogpgcheck
    
    # 2022-11-18，经过测试，版本号：1.25.4，同样适用于本文章
    # sudo yum install -y kubelet-1.25.4-0 kubeadm-1.25.4-0 kubectl-1.25.4-0 --disableexcludes=kubernetes --nogpgcheck
    
    # 2023-02-07，经过测试，版本号：1.25.5，同样适用于本文章
    # sudo yum install -y kubelet-1.25.5-0 kubeadm-1.25.5-0 kubectl-1.25.5-0 --disableexcludes=kubernetes --nogpgcheck
    
    # 2023-02-07，经过测试，版本号：1.25.6，同样适用于本文章
    # sudo yum install -y kubelet-1.25.6-0 kubeadm-1.25.6-0 kubectl-1.25.6-0 --disableexcludes=kubernetes --nogpgcheck
    
    # 2023-02-07，经过测试，版本号：1.26.0，同样适用于本文章
    # sudo yum install -y kubelet-1.26.0-0 kubeadm-1.26.0-0 kubectl-1.26.0-0 --disableexcludes=kubernetes --nogpgcheck
    
    # 2023-02-07，经过测试，版本号：1.26.1，同样适用于本文章
    # sudo yum install -y kubelet-1.26.1-0 kubeadm-1.26.1-0 kubectl-1.26.1-0 --disableexcludes=kubernetes --nogpgcheck
    
    # 2023-03-02，经过测试，版本号：1.26.2，同样适用于本文章
    # sudo yum install -y kubelet-1.26.2-0 kubeadm-1.26.2-0 kubectl-1.26.2-0 --disableexcludes=kubernetes --nogpgcheck
    
    # 2023-03-21，经过测试，版本号：1.26.3，同样适用于本文章
    # sudo yum install -y kubelet-1.26.3-0 kubeadm-1.26.3-0 kubectl-1.26.3-0 --disableexcludes=kubernetes --nogpgcheck
    
    # 2023-06-26，经过测试，版本号：1.26.6，同样适用于本文章
    # sudo yum install -y kubelet-1.26.6-0 kubeadm-1.26.6-0 kubectl-1.26.6-0 --disableexcludes=kubernetes --nogpgcheck
    
    # 2023-04-13，经过测试，版本号：1.27.0，同样适用于本文章
    # sudo yum install -y kubelet-1.27.0-0 kubeadm-1.27.0-0 kubectl-1.27.0-0 --disableexcludes=kubernetes --nogpgcheck
    
    # 2023-04-19，经过测试，版本号：1.27.1，同样适用于本文章
    # sudo yum install -y kubelet-1.27.1-0 kubeadm-1.27.1-0 kubectl-1.27.1-0 --disableexcludes=kubernetes --nogpgcheck
    
    # 2023-05-26，经过测试，版本号：1.27.2，同样适用于本文章
    # sudo yum install -y kubelet-1.27.2-0 kubeadm-1.27.2-0 kubectl-1.27.2-0 --disableexcludes=kubernetes --nogpgcheck
    
    # 2023-06-26，经过测试，版本号：1.27.3，同样适用于本文章
    # sudo yum install -y kubelet-1.27.3-0 kubeadm-1.27.3-0 kubectl-1.27.3-0 --disableexcludes=kubernetes --nogpgcheck
    
    # 安装最新版，生产时不建议
    # sudo yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes --nogpgcheck
    
    systemctl daemon-reload
    sudo systemctl restart kubelet
    sudo systemctl enable kubelet
    ```

11. 查看kubelet日志

    ```shell
    # k8s 未初始化时，kubelet 可能无法启动
    journalctl -xefu kubelet
    ```

12. 查看kubelet状态

    ```shell
    # k8s 未初始化时，kubelet 可能无法启动
    sudo systemctl status kubelet
    ```

13. **已上命令需要在控制面板与node节点执行，并确保没有错误与警告**

    **已上命令需要在控制面板与node节点执行，并确保没有错误与警告**

    **已上命令需要在控制面板与node节点执行，并确保没有错误与警告**

14. 控制面板：初始化

    ```shell
    kubeadm init --image-repository=registry.aliyuncs.com/google_containers
    # 指定集群的IP
    # kubeadm init --image-repository=registry.aliyuncs.com/google_containers --apiserver-advertise-address=192.168.80.60
    
    # --apiserver-advertise-address：API 服务器所公布的其正在监听的 IP 地址。如果未设置，则使用默认网络接口。存在多个网卡时推荐设置此参数
    # --pod-network-cidr：指明 pod 网络可以使用的 IP 地址段。如果设置了这个参数，控制平面将会为每一个节点自动分配 CIDRs。
    # --service-cidr：默认值："10.96.0.0/12"，为服务的虚拟 IP 地址另外指定 IP 地址段
    
    mkdir -p $HOME/.kube
    sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
    sudo chown $(id -u):$(id -g) $HOME/.kube/config
    
    # 或者在环境变量中添加：export KUBECONFIG=/etc/kubernetes/admin.conf
    # 添加完环境变量后，刷新环境变量：source /etc/profile
    
    kubectl cluster-info
    
    # 初始化失败后，可进行重置，重置命令：kubeadm reset
    
    # 执行成功后，会出现类似下列内容：
    # kubeadm join 192.168.80.60:6443 --token f9lvrz.59mykzssqw6vjh32 \
    # --discovery-token-ca-cert-hash sha256:4e23156e2f71c5df52dfd2b9b198cce5db27c47707564684ea74986836900107 	
    
    #
    # kubeadm token create --print-join-command
    ```

15. node 节点：加入集群

    ```shell
    # 运行的内容来自上方执行结果
    kubeadm join 192.168.80.60:6443 --token f9lvrz.59mykzssqw6vjh32 \
    --discovery-token-ca-cert-hash sha256:4e23156e2f71c5df52dfd2b9b198cce5db27c47707564684ea74986836900107 
    
    #
    # kubeadm token create --print-join-command
    
    # kubeadm join 192.168.80.60:6443 --token f9lvrz.59mykzssqw6vjh32 \
    # --discovery-token-unsafe-skip-ca-verification
    ```

16. 控制面板：

    ```shell
    kubectl get pods --all-namespaces -o wide
    ```

    可以查看到 coredns-* 的状态是 Pending，nodes 为 NotReady，原因是网络还未配置

    ```shell
    [root@k8s ~]# kubectl get pods --all-namespaces -o wide
    NAMESPACE     NAME                          READY   STATUS    RESTARTS   AGE     IP              NODE            NOMINATED NODE   READINESS GATES
    kube-system   coredns-c676cc86f-4lncg       0/1     Pending   0          3m19s   <none>          <none>          <none>           <none>
    kube-system   coredns-c676cc86f-7n9wv       0/1     Pending   0          3m19s   <none>          <none>          <none>           <none>
    kube-system   etcd-k8s                      1/1     Running   0          3m26s   192.168.80.60   k8s             <none>           <none>
    kube-system   kube-apiserver-k8s            1/1     Running   0          3m23s   192.168.80.60   k8s             <none>           <none>
    kube-system   kube-controller-manager-k8s   1/1     Running   0          3m23s   192.168.80.60   k8s             <none>           <none>
    kube-system   kube-proxy-87lx5              1/1     Running   0          81s     192.168.0.18    centos-7-9-16   <none>           <none>
    kube-system   kube-proxy-rctn6              1/1     Running   0          3m19s   192.168.80.60   k8s             <none>           <none>
    kube-system   kube-scheduler-k8s            1/1     Running   0          3m23s   192.168.80.60   k8s             <none>           <none>
    [root@k8s ~]#
    ```

    ```shell
    kubectl get nodes -o wide
    ```

    ```shell
    [root@k8s ~]# kubectl get nodes -o wide
    NAME            STATUS     ROLES           AGE     VERSION   INTERNAL-IP     EXTERNAL-IP   OS-IMAGE                KERNEL-VERSION           CONTAINER-RUNTIME
    centos-7-9-16   NotReady   <none>          7m58s   v1.25.3   192.168.0.18    <none>        CentOS Linux 7 (Core)   3.10.0-1160.el7.x86_64   containerd://1.6.9
    k8s             NotReady   control-plane   10m     v1.25.3   192.168.80.60   <none>        CentOS Linux 7 (Core)   3.10.0-1160.el7.x86_64   containerd://1.6.9
    [root@k8s ~]#
    ```

17. 控制面板：配置网络，选择 Calico 配置，归档文档：[https://docs.tigera.io/archive/](https://docs.tigera.io/archive/)

    | Kubernetes 版本       | Calico 版本                        | Calico 文档                                                                                                                                                       | Calico 配置                                                                                                                                                                    |
    |---------------------|----------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | 1.18、1.19、1.20      | 3.18                             | [https://docs.tigera.io/archive/v3.18/getting-started/kubernetes/requirements](https://docs.tigera.io/archive/v3.18/getting-started/kubernetes/requirements)    | [https://docs.tigera.io/archive/v3.18/manifests/calico.yaml](https://docs.tigera.io/archive/v3.18/manifests/calico.yaml)                                                     |
    | 1.19、1.20、1.21      | 3.19                             | [https://docs.tigera.io/archive/v3.19/getting-started/kubernetes/requirements](https://docs.tigera.io/archive/v3.19/getting-started/kubernetes/requirements)    | [https://docs.tigera.io/archive/v3.19/manifests/calico.yaml](https://docs.tigera.io/archive/v3.19/manifests/calico.yaml)                                                     |
    | 1.19、1.20、1.21      | 3.20                             | [https://docs.tigera.io/archive/v3.20/getting-started/kubernetes/requirements](https://docs.tigera.io/archive/v3.20/getting-started/kubernetes/requirements)    | [https://docs.tigera.io/archive/v3.20/manifests/calico.yaml](https://docs.tigera.io/archive/v3.20/manifests/calico.yaml)                                                     |
    | 1.20、1.21、1.22      | 3.21                             | [https://docs.tigera.io/archive/v3.21/getting-started/kubernetes/requirements](https://docs.tigera.io/archive/v3.21/getting-started/kubernetes/requirements)    | [https://docs.tigera.io/archive/v3.21/manifests/calico.yaml](https://docs.tigera.io/archive/v3.21/manifests/calico.yaml)                                                     |
    | 1.21、1.22、1.23      | 3.22                             | [https://docs.tigera.io/archive/v3.22/getting-started/kubernetes/requirements](https://docs.tigera.io/archive/v3.22/getting-started/kubernetes/requirements)    | [https://docs.tigera.io/archive/v3.22/manifests/calico.yaml](https://docs.tigera.io/archive/v3.22/manifests/calico.yaml)                                                     |
    | 1.21、1.22、1.23      | 3.23                             | [https://docs.tigera.io/archive/v3.23/getting-started/kubernetes/requirements](https://docs.tigera.io/archive/v3.23/getting-started/kubernetes/requirements)    | [https://docs.tigera.io/archive/v3.23/manifests/calico.yaml](https://docs.tigera.io/archive/v3.23/manifests/calico.yaml)                                                     |
    | 1.22、1.23、1.24、1.25 | 3.24                             | [https://docs.tigera.io/archive/v3.24/getting-started/kubernetes/requirements](https://docs.tigera.io/archive/v3.24/getting-started/kubernetes/requirements)    | [https://docs.tigera.io/archive/v3.24/manifests/calico.yaml](https://docs.tigera.io/archive/v3.24/manifests/calico.yaml)                                                     |
    | 1.22、1.23、1.24      | 3.25                             | [https://docs.tigera.io/archive/v3.25/getting-started/kubernetes/requirements](https://docs.tigera.io/archive/v3.25/getting-started/kubernetes/requirements)    | [https://docs.tigera.io/archive/v3.25/manifests/calico.yaml](https://docs.tigera.io/archive/v3.25/manifests/calico.yaml)                                                     |
    | 1.24、1.25、1.26、1.27 | 3.26（最新版，从 2023 年 5 月开始正式更新，未测试） | [https://docs.tigera.io/calico/latest/getting-started/kubernetes/requirements](https://docs.tigera.io/calico/latest/getting-started/kubernetes/requirements)    | [https://raw.githubusercontent.com/projectcalico/calico/v3.26.1/manifests/calico.yaml](https://raw.githubusercontent.com/projectcalico/calico/v3.26.1/manifests/calico.yaml) |

    ```shell
    # 下载
    # 此处一直使用的是 3.25，关于 3.25 可以在哪些 k8s 上使用，参见：上述第 10 步：安装 k8s 1.25.3 所需依赖
    wget --no-check-certificate https://docs.tigera.io/archive/v3.25/manifests/calico.yaml
    ```

    ```shell
    # 修改 calico.yaml 文件
    vim calico.yaml
    ```

    ```shell
    # 在 - name: CLUSTER_TYPE 下方添加如下内容
    - name: CLUSTER_TYPE
      value: "k8s,bgp"
      # 下方为新增内容
    - name: IP_AUTODETECTION_METHOD
      value: "interface=网卡名称"
    
    
    # INTERFACE_NAME=ens33
    # sed -i '/k8s,bgp/a \            - name: IP_AUTODETECTION_METHOD\n              value: "interface=INTERFACE_NAME"' calico.yaml
    # sed -i "s#INTERFACE_NAME#$INTERFACE_NAME#g" calico.yaml
    ```

    ```shell
    # 配置网络
    kubectl apply -f calico.yaml
    ```

18. 控制面板：查看 pods、nodes

    ```shell
    kubectl get nodes -o wide
    ```

    ```shell
    [root@k8s ~]# kubectl get nodes -o wide
    NAME            STATUS     ROLES           AGE     VERSION   INTERNAL-IP     EXTERNAL-IP   OS-IMAGE                KERNEL-VERSION           CONTAINER-RUNTIME
    centos-7-9-16   NotReady   <none>          7m58s   v1.25.3   192.168.0.18    <none>        CentOS Linux 7 (Core)   3.10.0-1160.el7.x86_64   containerd://1.6.9
    k8s             NotReady   control-plane   10m     v1.25.3   192.168.80.60   <none>        CentOS Linux 7 (Core)   3.10.0-1160.el7.x86_64   containerd://1.6.9
    [root@k8s ~]# 
    ```

    ```shell
    kubectl get pods --all-namespaces -o wide
    ```

    ```shell
    [root@k8s ~]# kubectl get pods --all-namespaces -o wide
    NAMESPACE     NAME                                      READY   STATUS     RESTARTS   AGE     IP              NODE            NOMINATED NODE   READINESS GATES
    kube-system   calico-kube-controllers-f79f7749d-rkqgw   0/1     Pending    0          11s     <none>          <none>          <none>           <none>
    kube-system   calico-node-7698p                         0/1     Init:0/3   0          11s     192.168.80.60   k8s             <none>           <none>
    kube-system   calico-node-tvhnb                         0/1     Init:0/3   0          11s     192.168.0.18    centos-7-9-16   <none>           <none>
    kube-system   coredns-c676cc86f-4lncg                   0/1     Pending    0          8m14s   <none>          <none>          <none>           <none>
    kube-system   coredns-c676cc86f-7n9wv                   0/1     Pending    0          8m14s   <none>          <none>          <none>           <none>
    kube-system   etcd-k8s                                  1/1     Running    0          8m21s   192.168.80.60   k8s             <none>           <none>
    kube-system   kube-apiserver-k8s                        1/1     Running    0          8m18s   192.168.80.60   k8s             <none>           <none>
    kube-system   kube-controller-manager-k8s               1/1     Running    0          8m18s   192.168.80.60   k8s             <none>           <none>
    kube-system   kube-proxy-87lx5                          1/1     Running    0          6m16s   192.168.0.18    centos-7-9-16   <none>           <none>
    kube-system   kube-proxy-rctn6                          1/1     Running    0          8m14s   192.168.80.60   k8s             <none>           <none>
    kube-system   kube-scheduler-k8s                        1/1     Running    0          8m18s   192.168.80.60   k8s             <none>           <none>
    [root@k8s ~]# 
    ```

    **控制面板：等待几分钟后，再次查看 pods、nodes**

    ```shell
    kubectl get nodes -o wide
    ```

    ```shell
    [root@k8s ~]# kubectl get nodes -o wide
    NAME            STATUS   ROLES           AGE   VERSION   INTERNAL-IP     EXTERNAL-IP   OS-IMAGE                KERNEL-VERSION           CONTAINER-RUNTIME
    centos-7-9-16   Ready    <none>          23m   v1.25.3   192.168.80.16   <none>        CentOS Linux 7 (Core)   3.10.0-1160.el7.x86_64   containerd://1.6.9
    k8s             Ready    control-plane   25m   v1.25.3   192.168.80.60   <none>        CentOS Linux 7 (Core)   3.10.0-1160.el7.x86_64   containerd://1.6.9
    [root@k8s ~]# 
    ```

    ```shell
    kubectl get pods --all-namespaces -o wide
    ```

    ```shell
    [root@k8s ~]# kubectl get pods --all-namespaces -o wide
    NAMESPACE     NAME                                      READY   STATUS    RESTARTS            AGE   IP              NODE            NOMINATED NODE   READINESS GATES
    kube-system   calico-kube-controllers-f79f7749d-rkqgw   1/1     Running   2 (52s ago)         17m   172.16.77.9     k8s             <none>           <none>
    kube-system   calico-node-7698p                         0/1     Running   2 (52s ago)         17m   192.168.80.60   k8s             <none>           <none>
    kube-system   calico-node-tvhnb                         0/1     Running   0                   17m   192.168.80.16   centos-7-9-16   <none>           <none>
    kube-system   coredns-c676cc86f-4lncg                   1/1     Running   2 (52s ago)         25m   172.16.77.8     k8s             <none>           <none>
    kube-system   coredns-c676cc86f-7n9wv                   1/1     Running   2 (52s ago)         25m   172.16.77.7     k8s             <none>           <none>
    kube-system   etcd-k8s                                  1/1     Running   2 (52s ago)         25m   192.168.80.60   k8s             <none>           <none>
    kube-system   kube-apiserver-k8s                        1/1     Running   2 (52s ago)         25m   192.168.80.60   k8s             <none>           <none>
    kube-system   kube-controller-manager-k8s               1/1     Running   2 (52s ago)         25m   192.168.80.60   k8s             <none>           <none>
    kube-system   kube-proxy-87lx5                          1/1     Running   1 (<invalid> ago)   23m   192.168.80.16   centos-7-9-16   <none>           <none>
    kube-system   kube-proxy-rctn6                          1/1     Running   2 (52s ago)         25m   192.168.80.60   k8s             <none>           <none>
    kube-system   kube-scheduler-k8s                        1/1     Running   2 (52s ago)         25m   192.168.80.60   k8s             <none>           <none>
    [root@k8s ~]# 
    ```

19. 至此，k8s安装与配置已完成，下面内容是测试。
20. 控制面板：创建 nginx 服务

    ```shell
    # 带 命名空间、Service 的完整版参见：https://jihulab.com/xuxiaowei-cloud/xuxiaowei-cloud/-/blob/main/docs/deployment/nginx-deployment.yaml
    cat > nginx.yaml << EOF
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: nginx-deployment
      labels:
        app: nginx
    spec:
      replicas: 2
      selector:
        matchLabels:
          app: nginx
      template:
        metadata:
          labels:
            app: nginx
        spec:
          containers:
          - name: nginx
            image: nginx:1.23.2
            ports:
            - containerPort: 80
    
    EOF
    
    cat nginx.yaml
    
    kubectl apply -f nginx.yaml
    
    # 编辑
    # kubectl edit deployment nginx-deployment
    ```

    ```shell
    kubectl get pods --all-namespaces -o wide
    ```

    ```shell
    [root@k8s ~]# kubectl get pods --all-namespaces -o wide
    NAMESPACE     NAME                                      READY   STATUS              RESTARTS            AGE   IP              NODE            NOMINATED NODE   READINESS GATES
    default       nginx-deployment-86956f97b8-nfv2l         0/1     ContainerCreating   0                   15s   <none>          centos-7-9-16   <none>           <none>
    default       nginx-deployment-86956f97b8-x26kx         0/1     ContainerCreating   0                   15s   <none>          centos-7-9-16   <none>           <none>
    kube-system   calico-kube-controllers-f79f7749d-rkqgw   1/1     Running             2 (6m22s ago)       23m   172.16.77.9     k8s             <none>           <none>
    kube-system   calico-node-7698p                         0/1     Running             2 (6m22s ago)       23m   192.168.80.60   k8s             <none>           <none>
    kube-system   calico-node-tvhnb                         0/1     Running             0                   23m   192.168.80.16   centos-7-9-16   <none>           <none>
    kube-system   coredns-c676cc86f-4lncg                   1/1     Running             2 (6m22s ago)       31m   172.16.77.8     k8s             <none>           <none>
    kube-system   coredns-c676cc86f-7n9wv                   1/1     Running             2 (6m22s ago)       31m   172.16.77.7     k8s             <none>           <none>
    kube-system   etcd-k8s                                  1/1     Running             2 (6m22s ago)       31m   192.168.80.60   k8s             <none>           <none>
    kube-system   kube-apiserver-k8s                        1/1     Running             2 (6m22s ago)       31m   192.168.80.60   k8s             <none>           <none>
    kube-system   kube-controller-manager-k8s               1/1     Running             2 (6m22s ago)       31m   192.168.80.60   k8s             <none>           <none>
    kube-system   kube-proxy-87lx5                          1/1     Running             1 (<invalid> ago)   29m   192.168.80.16   centos-7-9-16   <none>           <none>
    kube-system   kube-proxy-rctn6                          1/1     Running             2 (6m22s ago)       31m   192.168.80.60   k8s             <none>           <none>
    kube-system   kube-scheduler-k8s                        1/1     Running             2 (6m22s ago)       31m   192.168.80.60   k8s             <none>           <none>
    [root@k8s ~]#
    ```

    ```shell
    kubectl get pods -o wide
    ```

    ```shell
    [root@k8s ~]# kubectl get pods -o wide
    NAME                                READY   STATUS              RESTARTS   AGE   IP       NODE            NOMINATED NODE   READINESS GATES
    nginx-deployment-86956f97b8-nfv2l   0/1     ContainerCreating   0          35s   <none>   centos-7-9-16   <none>           <none>
    nginx-deployment-86956f97b8-x26kx   0/1     ContainerCreating   0          35s   <none>   centos-7-9-16   <none>           <none>
    [root@k8s ~]# 
    ```

    控制面板：**几分钟后再查看**

    ```shell
    kubectl get pods --all-namespaces -o wide
    ```

    ```shell
    [root@k8s ~]# kubectl get pods --all-namespaces -o wide
    NAMESPACE     NAME                                      READY   STATUS    RESTARTS            AGE     IP               NODE            NOMINATED NODE   READINESS GATES
    default       nginx-deployment-86956f97b8-nfv2l         1/1     Running   0                   3m30s   172.16.132.193   centos-7-9-16   <none>           <none>
    default       nginx-deployment-86956f97b8-x26kx         1/1     Running   0                   3m30s   172.16.132.194   centos-7-9-16   <none>           <none>
    kube-system   calico-kube-controllers-f79f7749d-rkqgw   1/1     Running   2 (9m37s ago)       26m     172.16.77.9      k8s             <none>           <none>
    kube-system   calico-node-7698p                         0/1     Running   2 (9m37s ago)       26m     192.168.80.60    k8s             <none>           <none>
    kube-system   calico-node-tvhnb                         0/1     Running   0                   26m     192.168.80.16    centos-7-9-16   <none>           <none>
    kube-system   coredns-c676cc86f-4lncg                   1/1     Running   2 (9m37s ago)       34m     172.16.77.8      k8s             <none>           <none>
    kube-system   coredns-c676cc86f-7n9wv                   1/1     Running   2 (9m37s ago)       34m     172.16.77.7      k8s             <none>           <none>
    kube-system   etcd-k8s                                  1/1     Running   2 (9m37s ago)       34m     192.168.80.60    k8s             <none>           <none>
    kube-system   kube-apiserver-k8s                        1/1     Running   2 (9m37s ago)       34m     192.168.80.60    k8s             <none>           <none>
    kube-system   kube-controller-manager-k8s               1/1     Running   2 (9m37s ago)       34m     192.168.80.60    k8s             <none>           <none>
    kube-system   kube-proxy-87lx5                          1/1     Running   1 (<invalid> ago)   32m     192.168.80.16    centos-7-9-16   <none>           <none>
    kube-system   kube-proxy-rctn6                          1/1     Running   2 (9m37s ago)       34m     192.168.80.60    k8s             <none>           <none>
    kube-system   kube-scheduler-k8s                        1/1     Running   2 (9m37s ago)       34m     192.168.80.60    k8s             <none>           <none>
    [root@k8s ~]# 
    ```

    ```shell
    kubectl get pods -o wide
    ```

    ```shell
    [root@k8s ~]# kubectl get pods -o wide
    NAME                                READY   STATUS    RESTARTS   AGE     IP               NODE            NOMINATED NODE   READINESS GATES
    nginx-deployment-86956f97b8-nfv2l   1/1     Running   0          4m31s   172.16.132.193   centos-7-9-16   <none>           <none>
    nginx-deployment-86956f97b8-x26kx   1/1     Running   0          4m31s   172.16.132.194   centos-7-9-16   <none>           <none>
    [root@k8s ~]# 
    ```

    ```shell
    # 控制面板：查看pod,svc
    kubectl get pod,svc -o wide
    ```

    ```shell
    [root@k8s ~]# kubectl get pod,svc -o wide
    NAME                                    READY   STATUS    RESTARTS   AGE     IP               NODE            NOMINATED NODE   READINESS GATES
    pod/nginx-deployment-86956f97b8-nfv2l   1/1     Running   0          4m59s   172.16.132.193   centos-7-9-16   <none>           <none>
    pod/nginx-deployment-86956f97b8-x26kx   1/1     Running   0          4m59s   172.16.132.194   centos-7-9-16   <none>           <none>
    
    NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE   SELECTOR
    service/kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   36m   <none>
    [root@k8s ~]# 
    ```

    ```shell
    # 控制面板：设置服务（将多个 nginx-deployment 的 pod 绑定在一起，通过一个 Service 端口统一对外提供）
    kubectl expose deployment nginx-deployment --type=NodePort --name=nginx-service
    
    # 带 命名空间、Service 的完整版参见：https://jihulab.com/xuxiaowei-cloud/xuxiaowei-cloud/-/blob/main/docs/deployment/nginx-deployment.yaml
    ```

    ```shell
    # 控制面板：查看pod,svc
    kubectl get pod,svc -o wide
    ```

    ```shell
    [root@k8s ~]# kubectl get pod,svc -o wide
    NAME                                    READY   STATUS    RESTARTS   AGE     IP               NODE            NOMINATED NODE   READINESS GATES
    pod/nginx-deployment-86956f97b8-nfv2l   1/1     Running   0          7m58s   172.16.132.193   centos-7-9-16   <none>           <none>
    pod/nginx-deployment-86956f97b8-x26kx   1/1     Running   0          7m58s   172.16.132.194   centos-7-9-16   <none>           <none>
    
    NAME                    TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE   SELECTOR
    service/kubernetes      ClusterIP   10.96.0.1       <none>        443/TCP        39m   <none>
    service/nginx-service   NodePort    10.109.120.77   <none>        80:30593/TCP   55s   app=nginx
    [root@k8s ~]# 
    ```

    ```shell
    # 重启控制面板、node节点
    # 控制面板：查看pod,svc
    kubectl get pod,svc -o wide
    ```

    ```shell
    [root@k8s ~]# kubectl get pod,svc -o wide
    NAME                                    READY   STATUS    RESTARTS            AGE   IP               NODE            NOMINATED NODE   READINESS GATES
    pod/nginx-deployment-86956f97b8-nfv2l   1/1     Running   1 (<invalid> ago)   11m   172.16.132.196   centos-7-9-16   <none>           <none>
    pod/nginx-deployment-86956f97b8-x26kx   1/1     Running   1 (<invalid> ago)   11m   172.16.132.195   centos-7-9-16   <none>           <none>
    
    NAME                    TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE    SELECTOR
    service/kubernetes      ClusterIP   10.96.0.1       <none>        443/TCP        42m    <none>
    service/nginx-service   NodePort    10.109.120.77   <none>        80:30593/TCP   4m8s   app=nginx
    [root@k8s ~]# 
    ```

    可以看到：**重启前后 pod/nginx-deployment-* IP 发生了变化，service/nginx-service 的 IP 与 端口没有发生变化，可在后面使用
    service/nginx-service 的 端口（即：外部访问时，使用的是 service/nginx-service 的 端口）**

# CentOS 命令自动补充

1. 安装 bash-completion

    ```shell
    yum install -y bash-completion
    ```

2. 拷贝 kubernetes 的自动补全脚本到系统补全目录中

    ```shell
    source <(kubectl completion bash)
    echo "source <(kubectl completion bash)" >> ~/.bashrc
    ```

3. 重新加载环境变量，使设置生效

    ```shell
    source ~/.bashrc
    ```

# Token 相关命令

1. 控制平面节点上运行以下命令来获取令牌

    ```shell
    kubeadm token list
    ```

2. 默认情况下，令牌会在 24 小时后过期，可以通过在控制平面节点上运行以下命令来创建新令牌

    ```shell
    kubeadm token create
    ```

# 相关命令

1. 查看更多信息

    ```shell
     -o wide
    ```

2. 查看所有命名空间

    ```shell
    --all-namespaces
    ```

3. 查看指定命名空间

    ```shell
    -n 命名空间
    ```

4. 查看所有 pod

    ```shell
    kubectl get pods --all-namespaces -o wide
    ```

5. 查看 pod 描述

    ```shell
    kubectl -n 命名空间 describe pod 名称
    ```

6. 删除 pod

    ```shell
    kubectl -n 命名空间 delete pod 名称
    ```

7. 进入 pod

    ```shell
    kubectl exec -it pod名称 bash
    ```

8. 查看 Service Account

    ```shell
    kubectl get sa --all-namespaces
    ```

    ```shell
    kubectl -n 命名空间 get sa
    ```

9. 查看 pv

    ```shell
    kubectl get pv
    ```

10. 查看 pvc

    ```shell
    kubectl get pvc
    ```

11. 查看角色绑定

    ```shell
    kubectl get rolebinding --all-namespaces -o wide
    ```

# 错误说明

1. 提示：/proc/sys/net/bridge/bridge-nf-call-iptables

    ```shell
    error execution phase preflight: [preflight] Some fatal errors occurred:
        [ERROR FileContent--proc-sys-net-bridge-bridge-nf-call-iptables]: /proc/sys/net/bridge/bridge-nf-call-iptables contents are not set to 1
    [preflight] If you know what you are doing, you can make a check non-fatal with `--ignore-preflight-errors=...`
    To see the stack trace of this error execute with --v=5 or higher
    ```

    ```shell
    # 执行命令
    # 如果报错 sysctl: cannot stat /proc/sys/net/bridge/bridge-nf-call-iptables: No such file or directory，可以先执行 modprobe br_netfilter
    sysctl -w net.bridge.bridge-nf-call-iptables=1
    ```

2. 提示：/proc/sys/net/ipv4/ip_forward

    ```shell
    error execution phase preflight: [preflight] Some fatal errors occurred:
        [ERROR FileContent--proc-sys-net-ipv4-ip_forward]: /proc/sys/net/ipv4/ip_forward contents are not set to 1
    [preflight] If you know what you are doing, you can make a check non-fatal with `--ignore-preflight-errors=...`
    To see the stack trace of this error execute with --v=5 or higher
    ```

    ```shell
    # 执行命令
    sysctl -w net.ipv4.ip_forward=1
    ```

3. 控制面板（master）作为node使用（去污）
   注意：**此处的命令可能和你在网上看到去污命令不同，原因是k8s的版本不同**

    ```shell
    # https://kubernetes.io/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#control-plane-node-isolation
    kubectl taint nodes --all node-role.kubernetes.io/control-plane-
    
    # 1.24.0 版本需要使用下列命令去污
    # kubectl taint nodes --all node-role.kubernetes.io/master-
    ```

   **可使用下列命令查看当前软件的去污的命令参数**

    ```shell
    kubectl get no -o yaml | grep taint -A 10
    ```
