# Containerd 镜像配置

## 说明

1. 不推荐在 k8s 网络配置前加速，可能会导致无法拉取镜像（原因可能是镜像的原因，或者是配置的原因，可以考虑事先或报错时手动拉取镜像）

## 安装

```shell
vim /etc/containerd/config.toml
```

```shell
        [plugins."io.containerd.grpc.v1.cri".registry.mirrors."docker.io"]
          endpoint = ["https://hnkfbj7x.mirror.aliyuncs.com", "https://registry-1.docker.io"]
```

```shell
# 重启Containerd
systemctl restart containerd
systemctl restart docker

# 拉取镜像
# ctr i pull docker.io/library/maven:3.6.3-jdk-8

# 查看镜像
# ctr i list
```
