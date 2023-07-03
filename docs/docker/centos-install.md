# CentOS 安装 Docker

## 文档

1. [在CentOS上安装Docker Engine]([https://docs.docker.com/engine/install/centos/](https://docs.docker.com/engine/install/centos/))

## 说明

1. GitLab Runner 执行器可以选择 Docker
2. GitLab Pages 运行环境需要 Docker

## 视频演示

<iframe src="//player.bilibili.com/player.html?aid=225598588&bvid=BV1T8411c78e&cid=1042170079&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="height: 500px;"></iframe>

## 安装 Docker

1. 安装 Docker

    ```shell
    sudo yum install -y yum-utils device-mapper-persistent-data lvm2
    sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo 
    sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    sudo systemctl enable docker.service
    sudo systemctl enable docker.socket
    
    systemctl list-unit-files | grep docker
    
    sudo systemctl start docker.service
    sudo systemctl start docker.socket
    
    docker info
    ```

    ```shell
    sudo systemctl status docker.service
    ```

    ```shell
    sudo systemctl status docker.socket
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
