---
sidebar_position: 1
---

# CentOS 安装 Docker

基于 CentOS 和 Docker 官方仓库脚本 安装/配置 Docker

## 文档

1. [在CentOS上安装Docker Engine](https://docs.docker.com/engine/install/centos/)

## 说明

1. GitLab Runner 执行器可以选择 Docker
2. GitLab Pages 运行环境需要 Docker
3. 开始使用 Containerd
    1. [github](https://github.com/containerd/containerd/blob/main/docs/getting-started.md)
    2. [JiHuLab 个人镜像](https://jihulab.com/mirrors-github/containerd/containerd/-/blob/main/docs/getting-started.md)
4. Containerd 配置 Docker 加速镜像
    1. [github](https://github.com/containerd/containerd/blob/main/docs/cri/registry.md)
    2. [JiHuLab 个人镜像](https://jihulab.com/mirrors-github/containerd/containerd/-/blob/main/docs/cri/registry.md)
5. crictl 用户指南
    1. [GitHub](https://github.com/containerd/containerd/blob/main/docs/cri/crictl.md)
    2. [JiHuLab 个人镜像](https://jihulab.com/mirrors-github/containerd/containerd/-/blob/main/docs/cri/crictl.md)
6. Containerd hosts 配置
   1. [GitHub](https://github.com/containerd/containerd/blob/main/docs/hosts.md)
   2. [JiHuLab 个人镜像](https://jihulab.com/mirrors-github/containerd/containerd/-/blob/main/docs/hosts.md)

## 视频演示

<iframe src="//player.bilibili.com/player.html?aid=225598588&bvid=BV1T8411c78e&cid=1042170079&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>

## 安装 Docker

1. 安装 Docker

    ```shell
    # https://docs.docker.com/engine/install/centos/
    
    # 卸载旧 docker
    sudo yum remove docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine
   
    # 安装 docker 仓库
    sudo yum install -y yum-utils
    sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
    
    # 搜索 docker 版本
    # yum --showduplicates list docker-ce
    
    # 安装 docker
    sudo yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    sudo systemctl enable docker.service
    sudo systemctl enable docker.socket
    
    systemctl list-unit-files | grep docker
    
    sudo systemctl start docker.service
    sudo systemctl start docker.socket
    
    docker info
    ```

    ```shell
    sudo systemctl status docker.service --no-pager
    ```

    ```shell
    sudo systemctl status docker.socket --no-pager
    ```

2. 设置 Docker 镜像

    ```shell
    sudo mkdir -p /etc/docker
    
    sudo tee /etc/docker/daemon.json <<-'EOF'
    {
      "registry-mirrors": ["https://hnkfbj7x.mirror.aliyuncs.com"]
    }
    EOF
    ```

3. 重启 Docker，使配置生效

    ```shell
    sudo systemctl restart docker.service
    sudo systemctl restart docker.socket
    
    docker info
    ```
