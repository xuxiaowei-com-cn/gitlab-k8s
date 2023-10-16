---
sidebar_position: 5
---

# 在 CentOS 上离线安装 Kubernetes（k8s）

## 说明

1. [Kubernetes（k8s）全自动安装配置脚本](https://jihulab.com/xuxiaowei-com-cn/k8s.sh)
2. 本文以 CentOS 7.9 最小化安装、Kubernetes（k8s）1.25.3 为例（其他 CentOS、k8s
   版本类似），离线包（免费下载）：[https://download.csdn.net/download/qq_32596527/87127488](https://download.csdn.net/download/qq_32596527/87127488)。
3. 如果没有在有网的环境下安装 Kubernetes（k8s）成功过，也不影响本文离线安装的阅读与学习。
4. yum 包准备：可通过查阅 [Kubernetes（k8s）安装](/docs/k8s/centos-install.md)
   文中的 `yum install ***` 命令在后面添加 `--downloadonly --downloaddir=./下载的文件夹` 下载到指定文件夹中获取，或者使用作者提供安装包。
5. Docker 镜像准备：可通过学习 [Kubernetes（k8s）安装](/docs/k8s/centos-install.md)
   安装成功后，使用命令 `ctr -n=k8s.io image list` 查询 k8s 安装成功后，当前使用的 Docker
   镜像，使用命令 `ctr -n=k8s.io image export 导出Docker镜像到磁盘的文件名 Docker镜像名`
6. Docer 镜像导入：`ctr -n=k8s.io image import Docker镜像导出到磁盘的文件名 Docker镜像名`
7. 一键生成所需命令参见：[Docker 镜像迁移](https://xuxiaowei-tools.gitee.io/#/docker/images/migrate)

## 准备

1. 已整理的安装包：，下载所需的离线安装包。
2. 将云盘中的软件安装包解压在一台没有网络的 CentOS 7.9 最小化安装的电脑上。
3. 如果你的环境不是 CentOS 7.9 最小化安装，或者所需安装的 k8s、Docker、Containerd 的等版本不同时，可以根据下面的命令在有网的电脑上提前下载准备
    1. 准备 vim

        ```shell
        sudo yum -y install vim --downloadonly --downloaddir=./vim
        ```

    2. 准备 wget（可忽略）

        ```shell
        sudo yum -y install wget --downloadonly --downloaddir=./wget
        ```

    3. 准备 ntpdate（可忽略）

        ```shell
        sudo yum -y install ntpdate --downloadonly --downloaddir=./ntpdate
        ```

    4. 准备 bash-completion（可忽略，推荐）

        ```shell
        sudo yum -y install bash-completion --downloadonly --downloaddir=./bash-completion
        ```

    5. 准备 Docker、Containerd 安装前的依赖

        ```shell
        sudo yum install -y yum-utils device-mapper-persistent-data lvm2 --downloadonly --downloaddir=./docker-before
        ```

    6. 准备 Docker 安装包

        ```shell
        sudo curl https://download.docker.com/linux/centos/docker-ce.repo > /etc/yum.repos.d/docker-ce.repo
        sudo yum makecache
        # sudo yum clean all && yum makecache
        ```

        ```shell
        sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin containerd --downloadonly --downloaddir=./docker
        ```

    7. 准备 k8s 安装包

        ```shell
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

        ```shell
        sudo yum makecache
        # sudo yum clean all && yum makecache
        ```

        ```shell
        # yum --showduplicates list kubelet --nogpgcheck
        # yum --showduplicates list kubeadm --nogpgcheck
        # yum --showduplicates list kubectl --nogpgcheck
        sudo yum install -y kubelet-1.25.3-0 kubeadm-1.25.3-0 kubectl-1.25.3-0 --disableexcludes=kubernetes --nogpgcheck --downloadonly --downloaddir=./k8s
        ```

    8. 准备 k8s 初始化 Docker 镜像包，准备 containerd 所需的 Docker 镜像包 pause
        1. k8s 1.25.3 所需 pause 的版本是 3.8
        2. 当前使用的 containerd 版本是 1.6.10（最新版，2022-11-22），containerd 1.6.10 所需的 pause 版本是 3.6
        3. 根据上面的描述，需要下载两个 pause 版本
        4. 可以使用 `sudo containerd config default` 查看当前 containerd 所需的 pause 版本。
        5. 如果要修改 containerd 使用的 pause 版本，可以在 `/etc/containerd/config.toml` 文件中将 pause 的版本与 k8s
           设置成一样的。
        6. 默认安装时， `/etc/containerd/config.toml` 文件内容较少，并且配置不支持
           k8s，需要使用 `sudo containerd config default > /etc/containerd/config.toml`重新生成配置文件。生成前请备份源文件。
        7. `--kubernetes-version`
            1. kubeadm 的参数，用于控制镜像的版本
            2. 如果不使用 `--kubernetes-version` 参数，k8s
               初始化下载镜像时，会使用<strong><font color="red">`当前次级版本号`</font></strong>
               的<strong><font color="red">`最新版镜像`</font></strong>，例如：
                - 安装的 k8s 版本是 1.26.<strong><font color="red">1</font></strong>-0，但是初始化时，下载的镜像版本是
                  v1.26.<strong><font color="red">6</font></strong>
                - 如果需要安装的 k8s 是 1.26.<strong><font color="red">1</font></strong>-0，下载的镜像版本也是
                  1.26.<strong><font color="red">1</font></strong>
                  ，则需要运行命令 `kubeadm init --kubernetes-version=v1.26.1`，其他参数加在后面即可
                - 如果想提前查看镜像，运行 `kubeadm config images list --kubernetes-version=v1.26.1`，其他参数加在后面即可
                - 如果想提前下载镜像，运行 `kubeadm config images pull --kubernetes-version=v1.26.1`，其他参数加在后面即可
                - 部分镜像举例：
                    1. registry.k8s.io/kube-apiserver:v1.26.6
                    2. registry.k8s.io/kube-controller-manager:v1.26.6
                    3. registry.k8s.io/kube-scheduler:v1.26.6
                    4. registry.k8s.io/kube-proxy:v1.26.6

        ```shell
        # 在有网的电脑上安装 k8s 后，运行下列命令就可以获取到 k8s 初始化时所需的 docker 镜像了
        kubeadm config images list
     
        # k8s 1.25.3 执行结果如下
        # registry.k8s.io/kube-apiserver:v1.25.3
        # registry.k8s.io/kube-controller-manager:v1.25.3
        # registry.k8s.io/kube-scheduler:v1.25.3
        # registry.k8s.io/kube-proxy:v1.25.3
        # registry.k8s.io/pause:3.8
        # registry.k8s.io/etcd:3.5.4-0
        # registry.k8s.io/coredns/coredns:v1.9.3
        ```

        ```shell
        # 使用 Docker 拉取镜像：k8s 1.25.3 初始化所需 Docker 镜像如下
     
        # 如果你的网络可以直接拉取 registry.k8s.io 域名下的包，则可以直接使用下列命令，并且可以节省操作 Docker 镜像标签的命令
        # docker pull registry.k8s.io/kube-apiserver:v1.25.3
        # docker pull registry.k8s.io/kube-controller-manager:v1.25.3
        # docker pull registry.k8s.io/kube-scheduler:v1.25.3
        # docker pull registry.k8s.io/kube-proxy:v1.25.3
        # docker pull registry.k8s.io/pause:3.8
        # containerd 所需
        # docker pull registry.k8s.io/pause:3.6
        # docker pull registry.k8s.io/etcd:3.5.4-0
        # docker pull registry.k8s.io/coredns/coredns:v1.9.3
     
        # 在这里我们使用阿里云Docker镜像来拉取上面的 Docker image
        docker pull registry.aliyuncs.com/google_containers/kube-apiserver:v1.25.3
        docker pull registry.aliyuncs.com/google_containers/kube-controller-manager:v1.25.3
        docker pull registry.aliyuncs.com/google_containers/kube-scheduler:v1.25.3
        docker pull registry.aliyuncs.com/google_containers/kube-proxy:v1.25.3
        docker pull registry.aliyuncs.com/google_containers/pause:3.8
        # containerd 所需
        docker pull registry.aliyuncs.com/google_containers/pause:3.6
        docker pull registry.aliyuncs.com/google_containers/etcd:3.5.4-0
        docker pull registry.aliyuncs.com/google_containers/coredns:v1.9.3
     
        docker images
     
        # 将上述的 registry.aliyuncs.com 修改为 registry.k8s.io
        docker tag registry.aliyuncs.com/google_containers/kube-apiserver:v1.25.3            registry.k8s.io/kube-apiserver:v1.25.3
        docker tag registry.aliyuncs.com/google_containers/kube-scheduler:v1.25.3            registry.k8s.io/kube-scheduler:v1.25.3
        docker tag registry.aliyuncs.com/google_containers/kube-controller-manager:v1.25.3   registry.k8s.io/kube-controller-manager:v1.25.3
        docker tag registry.aliyuncs.com/google_containers/kube-proxy:v1.25.3                registry.k8s.io/kube-proxy:v1.25.3
        docker tag registry.aliyuncs.com/google_containers/pause:3.8                         registry.k8s.io/pause:3.8
        # containerd 所需
        docker tag registry.aliyuncs.com/google_containers/pause:3.6                         registry.k8s.io/pause:3.6
        docker tag registry.aliyuncs.com/google_containers/etcd:3.5.4-0                      registry.k8s.io/etcd:3.5.4-0
        # 注意这里的名称为 coredns/coredns:v1.9.3 
        docker tag registry.aliyuncs.com/google_containers/coredns:v1.9.3                    registry.k8s.io/coredns/coredns:v1.9.3
     
        # 保存镜像到磁盘
        docker save -o kube-apiserver-v1.25.3.tar            registry.k8s.io/kube-apiserver:v1.25.3
        docker save -o kube-controller-manager-v1.25.3.tar   registry.k8s.io/kube-controller-manager:v1.25.3
        docker save -o kube-scheduler-v1.25.3.tar            registry.k8s.io/kube-scheduler:v1.25.3
        docker save -o kube-proxy-v1.25.3.tar                registry.k8s.io/kube-proxy:v1.25.3
        docker save -o pause-3.8.tar                         registry.k8s.io/pause:3.8
        # containerd 所需
        docker save -o pause-3.6.tar                         registry.k8s.io/pause:3.6
        docker save -o etcd-3.5.4-0.tar                      registry.k8s.io/etcd:3.5.4-0
        docker save -o coredns-v1.9.3.tar                    registry.k8s.io/coredns/coredns:v1.9.3
     
        # 将上述镜像复制到已安装 k8s、待初始化 k8s 的系统上
        ```

       下面是 k8s 1.25.3 初始化所需要的 Docker 镜像包

    9. 准备 网络 calico 初始化 Docker 镜像包

       本文使用 calico 3.24.5，可以从下面链接中获取

       如果要使用其他版本的 calico，请查看 calico.yaml 文件中的 calico/node、calico/cni、calico/kube-controllers 版本，下载对应的
       Docker 镜像就可

       不同 calico 支持的 k8s 版本不同，请查看 calico 与 k8s
       版本的对应关系：[Kubernetes（k8s）安装](/docs/k8s/centos-install.md)

        1. [GitHub](https://github.com/projectcalico/calico/blob/v3.24.5/manifests/calico.yaml)
        2. [JiHuLab 个人镜像](https://jihulab.com/mirrors-github/projectcalico/calico/-/blob/v3.24.5/manifests/calico.yaml)

        ```shell
        docker pull docker.io/calico/node:v3.24.5
        docker pull docker.io/calico/cni:v3.24.5
        docker pull docker.io/calico/kube-controllers:v3.24.5
        
        docker images
        
        docker save -o node-v3.24.5.tar                    docker.io/calico/node:v3.24.5
        docker save -o cni-v3.24.5.tar                     docker.io/calico/cni:v3.24.5
        docker save -o kube-controllers-v3.24.5.tar        docker.io/calico/kube-controllers:v3.24.5
        ```

## 安装

1. 安装 vim

    ```shell
    cd ./vim
    yum -y localinstall *.rpm
    # yum -y install *.rpm
    cd ..
    ```

2. 安装 wget（可忽略）

    ```shell
    cd ./wget
    yum -y localinstall *.rpm
    # yum -y install *.rpm
    cd ..
    ```

3. 安装 ntpdate（可忽略）

    ```shell
    cd ./ntpdate
    yum -y localinstall *.rpm
    # yum -y install *.rpm
    cd ..
    ```

4. 安装 bash-completion（可忽略，推荐）

    ```shell
    cd ./bash-completion
    yum -y localinstall *.rpm
    # yum -y install *.rpm
    source /etc/profile
    cd ..
    ```

5. 安装 Docker、Containerd 安装前的依赖

    ```shell
    cd ./docker-before
    yum -y localinstall *.rpm
    # yum -y install *.rpm
    cd ..
    ```

6. 安装 Docker、Containerd

    ```shell
    cd ./docker
    yum -y localinstall *.rpm
    # yum -y install *.rpm
    cd ..
    
    # 启动 docker 时，会启动 containerd
    # sudo systemctl status containerd.service --no-pager
    sudo systemctl stop containerd.service
    
    sudo cp /etc/containerd/config.toml /etc/containerd/config.toml.bak
    sudo containerd config default > $HOME/config.toml
    sudo cp $HOME/config.toml /etc/containerd/config.toml
    
    # 由于是离线安装，提前准备了Docker镜像，所以此处不用修改 pause
    
    # https://kubernetes.io/zh-cn/docs/setup/production-environment/container-runtimes/#containerd-systemd
    # 确保 /etc/containerd/config.toml 中的 disabled_plugins 内不存在 cri
    sudo sed -i "s#SystemdCgroup = false#SystemdCgroup = true#g" /etc/containerd/config.toml
    
    sudo systemctl enable --now containerd.service
    # sudo systemctl status containerd.service --no-pager
    
    # sudo systemctl status docker.service --no-pager
    sudo systemctl start docker.service
    # sudo systemctl status docker.service --no-pager
    sudo systemctl enable docker.service
    sudo systemctl enable docker.socket
    sudo systemctl list-unit-files | grep docker
    
    sudo tee /etc/docker/daemon.json <<-'EOF'
    {
      "registry-mirrors": ["https://hnkfbj7x.mirror.aliyuncs.com"],
        "exec-opts": ["native.cgroupdriver=systemd"]
    }
    EOF
    
    sudo systemctl daemon-reload
    sudo systemctl restart docker
    sudo docker info
    ```

    ```shell
    sudo systemctl status docker.service --no-pager
    ```

    ```shell
    sudo systemctl status containerd.service --no-pager
    ```

7. 安装 k8s

    ```shell
    # 设置所需的 sysctl 参数，参数在重新启动后保持不变
    cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
    net.bridge.bridge-nf-call-iptables  = 1
    net.bridge.bridge-nf-call-ip6tables = 1
    net.ipv4.ip_forward                 = 1
    EOF
    ```

    ```shell
    # 应用 sysctl 参数而不重新启动
    sudo sysctl --system
    ```

    ```shell
    cd k8s
    yum -y localinstall *.rpm
    # yum -y install *.rpm
    cd ..
    
    systemctl daemon-reload
    sudo systemctl restart kubelet
    sudo systemctl enable kubelet
    ```

8. 导入k8s 初始化时所需的Docker镜像

    ```shell
    cd init-images
    
    # 注意这里指定了命名空间为 k8s.io
    ctr -n=k8s.io image import kube-apiserver-v1.25.3.tar
    ctr -n=k8s.io image import kube-controller-manager-v1.25.3.tar
    ctr -n=k8s.io image import kube-scheduler-v1.25.3.tar
    ctr -n=k8s.io image import kube-proxy-v1.25.3.tar
    ctr -n=k8s.io image import pause-3.8.tar
    #  containerd 使用
    ctr -n=k8s.io image import pause-3.6.tar
    ctr -n=k8s.io image import etcd-3.5.4-0.tar
    ctr -n=k8s.io image import coredns-v1.9.3.tar
    
    ctr -n=k8s.io images list
    ctr i list
    
    cd ..
    ```

9. 将主机名指向本机IP，**主机名只能包含：字母、数字、-（横杠）、.（点）**
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
         当前机器的IP 	当前机器的主机名
         ```

10. 关闭防火墙、或者开通指定端口

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

11. 关闭交换空间

    ```shell
    sudo swapoff -a
    sudo sed -i 's/.*swap.*/#&/' /etc/fstab
    ```

12. k8s 初始化

    ```shell
    # 由于导入的 Docker 镜像已经修改为原始的名称，故此处初始化无需增加 --image-repository=registry.aliyuncs.com/google_containers
    kubeadm init
    # 指定集群的IP
    # kubeadm init --image-repository=registry.aliyuncs.com/google_containers --apiserver-advertise-address=192.168.80.60
    
    mkdir -p $HOME/.kube
    sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
    sudo chown $(id -u):$(id -g) $HOME/.kube/config
    
    kubectl cluster-info
    
    # 初始化失败后，可进行重置，重置命令：kubeadm reset
    
    # 执行成功后，会出现类似下列内容：
    # kubeadm join 192.168.80.60:6443 --token f9lvrz.59mykzssqw6vjh32 \
    # --discovery-token-ca-cert-hash sha256:4e23156e2f71c5df52dfd2b9b198cce5db27c47707564684ea74986836900107 	
    ```

13. 网络初始化，下载 calico.yaml 文件，复制到电脑上
    1. [GitHub](https://github.com/projectcalico/calico/blob/v3.24.5/manifests/calico.yaml)
    2. [JiHuLab 个人镜像](https://jihulab.com/mirrors-github/projectcalico/calico/-/blob/v3.24.5/manifests/calico.yaml)

    ```shell
    cd calico
    ctr -n=k8s.io image import node-v3.24.5.tar
    ctr -n=k8s.io image import cni-v3.24.5.tar
    ctr -n=k8s.io image import kube-controllers-v3.24.5.tar
    cd ..
    ```

    ```shell
    # 增加 DNS
    vim /etc/resolv.conf
    ```

    ```shell
    # 没有DNS时随便写一个
    nameserver 192.168.10.1
    ```

    ```shell
    kubectl apply -f calico.yaml
    ```

14. 查看集群

    ```shell
    kubectl get pods --all-namespaces -o wide
    ```

    ```shell
    kubectl get nodes -o wide
    ```

15. 关于去污、创建实例、其他命令，参见 [Kubernetes（k8s）安装](/docs/k8s/centos-install.md)

