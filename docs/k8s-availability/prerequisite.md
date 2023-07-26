---
sidebar_position: 2
---

# k8s 高可用集群1：前提条件

Kubernetes（k8s）高可用集群1：前提条件

## 每台机器均需要执行

1. 命令自动补充

   ```shell
   sudo yum -y install bash-completion
   source /etc/profile
   ```

2. 安装所需工具

   ```shell
   sudo yum -y install vim
   sudo yum -y install wget
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

4. 将主机名指向本机IP，**主机名只能包含：字母、数字、-（横杠）、.（点）**
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
       192.168.*.* 	主机名
       ```

5. 关闭防火墙

   ```shell
   # 关闭防火墙
   systemctl stop firewalld.service
   systemctl disable firewalld.service
   ```

6. 关闭 selinux

   ```shell
   getenforce
   cat /etc/selinux/config
   sudo setenforce 0
   sudo sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config
   cat /etc/selinux/config
   ```

7. 关闭交换空间

   ```shell
   sudo swapoff -a
   sudo sed -i 's/.*swap.*/#&/' /etc/fstab
   ```

8. 调整网络

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

9. 全局变量、修改本机hosts，用于后期使用

    ```shell
    echo "" >> /etc/profile
    
    # 全局变量，一般仅需要修改此处即可，其他均不需要改
    echo "MASTER_1_IP=192.168.80.81" >> /etc/profile
    echo "MASTER_2_IP=192.168.80.82" >> /etc/profile
    echo "MASTER_3_IP=192.168.80.83" >> /etc/profile
    # VIP 负载均衡器IP
    echo "VIP_IP=192.168.80.100" >> /etc/profile
    # 网卡名称
    echo "INTERFACE_NAME=ens33" >> /etc/profile
    
    source /etc/profile
    cat /etc/profile
    ```

10. 安装 Docker

    ```shell
    # https://docs.docker.com/engine/install/centos/
    sudo yum remove docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine
    sudo yum install -y yum-utils device-mapper-persistent-data lvm2
    sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo 
    # yum --showduplicates list docker-ce
    sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    sudo yum install -y containerd
    
    # 启动 docker 时，会启动 containerd
    # sudo systemctl status containerd.service -n 0
    sudo systemctl stop containerd.service
    
    sudo cp /etc/containerd/config.toml /etc/containerd/config.toml.bak
    sudo containerd config default > $HOME/config.toml
    sudo cp $HOME/config.toml /etc/containerd/config.toml
    # 修改 /etc/containerd/config.toml 文件后，要将 docker、containerd 停止后，再启动
    sudo sed -i "s#registry.k8s.io/pause#registry.cn-hangzhou.aliyuncs.com/google_containers/pause#g" /etc/containerd/config.toml
    # https://kubernetes.io/zh-cn/docs/setup/production-environment/container-runtimes/#containerd-systemd
    # 确保 /etc/containerd/config.toml 中的 disabled_plugins 内不存在 cri
    sudo sed -i "s#SystemdCgroup = false#SystemdCgroup = true#g" /etc/containerd/config.toml
    
    # containerd 忽略证书验证的配置
    #      [plugins."io.containerd.grpc.v1.cri".registry.configs]
    #        [plugins."io.containerd.grpc.v1.cri".registry.configs."192.168.0.12:8001".tls]
    #          insecure_skip_verify = true
    
    
    sudo systemctl enable --now containerd.service
    # sudo systemctl status containerd.service -n 0
    
    # sudo systemctl status docker.service -n 0
    sudo systemctl start docker.service
    # sudo systemctl status docker.service -n 0
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
    
    sudo systemctl status docker.service -n 0
    sudo systemctl status containerd.service -n 0
    ```
