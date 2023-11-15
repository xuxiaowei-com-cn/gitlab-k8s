---
sidebar_position: 9
---

# Containerd 镜像配置

配置 Containerd 镜像加速域名，提高镜像拉取速度

## 说明

1. 不推荐在 k8s 网络配置前加速，可能会导致无法拉取镜像（原因可能是镜像的原因，或者是配置的原因，可以考虑事先或报错时手动拉取镜像）
2. https://docs.docker.com/build/buildkit/toml-configuration/
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

7. <font color="red">在 `[plugins."io.containerd.grpc.v1.cri".registry.mirrors]` 中配置 `域名`，仅支持 `crictl`
   命令</font>
8. <font color="red">在 `[plugins."io.containerd.grpc.v1.cri".registry]` 中配置 `config_path`，同时支持 `ctr`、`crictl`
   命令</font>

    1. 在 `[plugins."io.containerd.grpc.v1.cri".registry]` 中配置 `config_path` 时，需要 文件夹、文件 必须存在，否则命令无法运行
    2. 在 `[plugins."io.containerd.grpc.v1.cri".registry]` 中配置 `config_path`、
       在 `[plugins."io.containerd.grpc.v1.cri".registry.mirrors]` 中配置 `域名` 对于 crictl 是等效的

## 配置 `crictl`

1. 编辑 `/etc/containerd/config.toml` 文件

    ```shell
    vim /etc/containerd/config.toml
    ```

   在 `[plugins."io.containerd.grpc.v1.cri".registry.mirrors]` 后面添加镜像，注意前面的缩进（空格），配置 docker.io 的示例

   如果 `/etc/containerd/config.toml` 配置很少，可能需要使用命令 `containerd config default`
   生成默认配置，替换原始的 `/etc/containerd/config.toml` 文件（慎重操作，注意备份历史配置文件）

    ```shell
          [plugins."io.containerd.grpc.v1.cri".registry.mirrors]
            [plugins."io.containerd.grpc.v1.cri".registry.mirrors."docker.io"]
              # 根据需要，可填写多个，如：["https://hnkfbj7x.mirror.aliyuncs.com", "https://registry-1.docker.io"]
              endpoint = ["https://hnkfbj7x.mirror.aliyuncs.com"]
    ```

2. 重启服务

    ```shell
    systemctl restart containerd
    ```

3. 检查 `crictl` 配置

   查看是否配置 crictl
    ```shell
    cat /etc/crictl.yaml
    ```

   如果没有配置，则执行命令进行配置
    ```shell
    # 开启 crictl 配置
    # 安装完 k8s 后，才有 crictl 命令
    # 参考：
    # GitHub：https://github.com/containerd/containerd/blob/main/docs/cri/crictl.md
    # JiHuLab 个人镜像：https://jihulab.com/mirrors-github/containerd/containerd/-/blob/main/docs/cri/crictl.md
    
    # 生成配置文件
    cat <<EOF > /etc/crictl.yaml
    runtime-endpoint: unix:///run/containerd/containerd.sock
    image-endpoint: unix:///run/containerd/containerd.sock
    timeout: 10
    debug: true
    
    EOF
    
    # 查看生成的配置文件
    cat /etc/crictl.yaml
    ```

   查看配置是否生效
    ```shell
    crictl info
    ```

4. 使用 `crictl` 测试

    ```shell
    # 拉取镜像测试
    crictl pull docker.io/library/maven:3.6.3-openjdk-17
    
    # 查看拉取的结果
    crictl image
    ```

## 配置 `ctr`、`crictl`

1. 以加速 docker.io 为例

2. 创建文件夹

    ```shell
    mkdir -p /etc/containerd/certs.d/docker.io
    ```

3. 创建配置文件

    ```shell
    cat <<EOF > /etc/containerd/certs.d/docker.io/hosts.toml
    server = "https://docker.io"
    [host."https://hnkfbj7x.mirror.aliyuncs.com"]
      capabilities = ["pull", "resolve"]
      # 跳过证书验证
      skip_verify = true
    
    EOF
    
    # 查看生成的配置文件
    cat /etc/crictl.yaml
    ```

4. 使用 `ctr` 测试

    ```shell
    # 拉取镜像
    ctr --debug i pull --hosts-dir "/etc/containerd/certs.d" docker.io/library/maven:3.6.3-jdk-8
    
    # 查看镜像
    # ctr i list
    ```

5. 编辑 `/etc/containerd/config.toml` 文件，使 `crictl` 命令也能生效

    ```shell
    vim /etc/containerd/config.toml
    ```

   修改 `[plugins."io.containerd.grpc.v1.cri".registry]` 的 `config_path`

    ```shell
        [plugins."io.containerd.grpc.v1.cri".registry]
          # 配置 config_path 时，需要 文件夹、文件 必须存在，否则命令无法运行
          # plugins."io.containerd.grpc.v1.cri".registry 中的 config_path 与 plugins."io.containerd.grpc.v1.cri".registry.mirrors 对于 crictl 是等效的
          config_path = "/etc/containerd/certs.d"
    ```

6. 重启服务

    ```shell
    systemctl restart containerd
    ```

7. 检查 `crictl` 配置

   查看是否配置 crictl
    ```shell
    cat /etc/crictl.yaml
    ```

   如果没有配置，则执行命令进行配置
    ```shell
    # 开启 crictl 配置
    # 安装完 k8s 后，才有 crictl 命令
    # 参考：
    # GitHub：https://github.com/containerd/containerd/blob/main/docs/cri/crictl.md
    # JiHuLab 个人镜像：https://jihulab.com/mirrors-github/containerd/containerd/-/blob/main/docs/cri/crictl.md
    
    # 生成配置文件
    cat <<EOF > /etc/crictl.yaml
    runtime-endpoint: unix:///run/containerd/containerd.sock
    image-endpoint: unix:///run/containerd/containerd.sock
    timeout: 10
    debug: true
    
    EOF
    
    # 查看生成的配置文件
    cat /etc/crictl.yaml
    ```

   查看配置是否生效
    ```shell
    crictl info
    ```

8. 使用 `crictl` 测试

    ```shell
    # 拉取镜像测试
    crictl pull docker.io/library/nginx:1.25.1
    
    # 查看拉取的结果
    crictl image
    ```
