# Containerd 镜像配置

## 说明

1. 不推荐在 k8s 网络配置前加速，可能会导致无法拉取镜像（原因可能是镜像的原因，或者是配置的原因，可以考虑事先或报错时手动拉取镜像）
2. https://docs.docker.com/build/buildkit/toml-configuration/
3. 开始使用 Containerd
   1. [github](https://github.com/containerd/containerd/blob/main/docs/getting-started.md)
   2. [gitcode](https://gitcode.net/mirrors/containerd/containerd/-/blob/main/docs/getting-started.md)
4. Containerd 配置 Docker 加速镜像
   1. [github](https://github.com/containerd/containerd/blob/main/docs/cri/registry.md)
   2. [gitcode](https://gitcode.net/mirrors/containerd/containerd/-/blob/main/docs/cri/registry.md)

## 配置

编辑 `/etc/containerd/config.toml` 文件

```shell
vim /etc/containerd/config.toml
```

在 `[plugins."io.containerd.grpc.v1.cri".registry.mirrors]` 后面添加镜像，注意前面的缩进（空格），配置 docker.io 的示例

```shell
      [plugins."io.containerd.grpc.v1.cri".registry.mirrors]
        [plugins."io.containerd.grpc.v1.cri".registry.mirrors."docker.io"]
          endpoint = ["https://hnkfbj7x.mirror.aliyuncs.com", "https://registry-1.docker.io"]
```

重启服务

```shell
# 重启Containerd
systemctl restart containerd
systemctl restart docker

# 拉取镜像
# ctr i pull docker.io/library/maven:3.6.3-jdk-8

# 查看镜像
# ctr i list
```
