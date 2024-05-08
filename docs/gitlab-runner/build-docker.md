# GitLab Runner 制作 Docker 镜像的 5 种方案 {id=20240508}

[[toc]]

## 参考示例 {id=demo}

### 源码 {id=source}

- [极狐 GitLab](https://jihulab.com/xuxiaowei-jihu/xuxiaowei-com-cn/gitlab-build-docker/)
- [码云 Gitee](https://gitee.com/xuxiaowei-com-cn/gitlab-build-docker)

### 理论执行效率

`shell` > `docker_sock` > `docker_host` > `using_docker_build` > `using_kaniko`

| 分支                   | 关键流程                                                                     | 优点            |
|----------------------|--------------------------------------------------------------------------|---------------|
| `shell`              | 无需创建容器，直接使用宿主机的 docker 服务                                                | 可使用历史镜像、构建缓存  |
| `docker_sock`        | 使用 `docker:cli` 镜像 创建容器 时 挂载宿主机的 `docker.sock`，直接利用宿主机的 `docker.sock` 服务 | 可使用历史镜像、构建缓存  |
| `docker_host`        | 使用 `docker:cli` 镜像 创建容器 后，使用网络与 docker 服务进行通信                            | 可使用历史镜像、构建缓存  |
| `using_docker_build` | 使用 `docker:cli` 镜像 创建容器 后，再使用 `docker:dind` 镜像创建 docker 服务               | 不可使用历史镜像、构建缓存 |
| `using_kaniko`       | 使用 `gcr.io/kaniko-project/executor` 镜像 创建容器，模拟 docker 功能                 | 不可使用历史镜像、构建缓存 |

## 修改 GitLab Runner 运行时用户 {id=service-running}

- 根据需要进行调整

```shell
# 查看当前runner用户
ps aux | grep gitlab-runner

# 删除gitlab-runner
sudo gitlab-runner uninstall

# 安装并设置--user(例如我想设置为root)
gitlab-runner install --working-directory /home/gitlab-runner --user root

# 重启gitlab-runner
sudo service gitlab-runner restart

# 再次执行会发现--user的用户名已经更换成root了 
ps aux | grep gitlab-runner
```

## 方案 1：使用 Docker-in-Docker 构建 Docker 镜像 {id=plan-1}

### 文档 {id=plan-1-docs}

- 极狐 GitLab：[中文文档](https://docs.gitlab.cn/jh/ci/docker/using_docker_images.html)

### 介绍 {id=plan-1-intro}

在 Docker 中使用 Docker 镜像创建 Docker 容器，并在该容器内构建 Docker 镜像

1. Docker 构建时的环境是一个独立的、隔离的 Docker 环境
2. 需要 <strong><font color="red">特权身份</font></strong> 运行 GitLab 流水线，
   <strong><font color="red">可能存在越权行为</font></strong>
3. GitLab Runner 流水线 使用 Docker-in-Docker 执行时需要创建两个容器
    1. 使用 `docker:cli` 创建一个 Docker 客户端容器，也就是流水线执行时的容器
        1. 在早期相关文档介绍时，使用 `docker:latest`（最新版Docker命令行镜像）、
           `docker:26.1.1`（指定版本的Docker命令行镜像）、
           `26.1.1-alpine3.19`（指定版本的使用 `alpine` 为基础镜像的Docker命令行镜像）
        2. 在比较新的相关文档介绍时，使用 `docker:cli`（最新版、最小化Docker命令行镜像）、
           `docker:26.1.1-cli`（指定版本的、最小化Docker命令行镜像）、
           `docker:26.1.1-cli-alpine3.19`（指定版本的、最小化使用 `alpine` 为基础镜像的Docker命令行镜像）
    2. 使用 `docker:dind` 创建一个 Docker 服务端容器，此容器需要使用 <strong><font color="red">特权身份</font></strong>
       运行
        1. 在流水线中，使用关键字 [services](https://docs.gitlab.cn/jh/ci/yaml/#services) 来创建流水线执行时所需的服务
        2. GitLab Runner Docker 执行器 <strong><font color="red">特权身份</font></strong> 配置，其他执行器配置雷同
            ```yaml
            # 配置文件位置：/etc/gitlab-runner/config.toml
            [[runners]]
              name = "lighthouse-docker"
              url = "https://jihulab.com/"
              ...省略
              executor = "docker"
              [runners.docker]
                # 此处配置 privileged = true，让流水线使用特权身份执行
                privileged = true
                ...省略
            ```
4. 支持 GitLab Runner 执行器：`docker`、`docker+machine`、`kubernetes` 等等
5. 具体配置请参见 [参考示例](#demo) 的 `using_docker_build` 分支

## 方案 2：使用 kaniko 构建 Docker 镜像 {id=plan-2}

### 文档 {id=plan-2-docs}

- 极狐 GitLab：[中文文档](https://docs.gitlab.cn/jh/ci/docker/using_docker_images.html)

### 介绍 {id=plan-2-intro}

使用 `gcr.io/kaniko-project/executor:debug` 模拟 Docker 环境制作 Docker 镜像，无需特权身份运行

1. Docker 构建时的环境是一个独立的、隔离的 Docker 环境
2. 不需要 特权身份 运行 GitLab 流水线，不存在越权行为
3. GitLab Runner 流水线 使用 kaniko 执行时只需要创建一个容器
4. 支持 GitLab Runner 执行器：`docker`、`docker+machine`、`kubernetes` 等等
5. `gcr.io/kaniko-project/executor:debug` 是最新版的镜像，推荐使用
   具体版本（为了防止某天镜像进行不兼容更新造成异常）的 `kaniko` 镜像，
   如：`gcr.io/kaniko-project/executor:v1.21.0-debug`，可访问
   [kaniko 仓库](https://github.com/GoogleContainerTools/kaniko) 仓库的
   [标签](https://github.com/GoogleContainerTools/kaniko/tags) 来选择具体的版本
6. 由于国内可能无法访问 `gcr.io` 域名，推荐大家使用作者个人镜像
   [xuxiaoweicomcn/kaniko-project-executor](https://hub.docker.com/r/xuxiaoweicomcn/kaniko-project-executor/tags)
    1. 镜像标签名与原始标签保持一致即可
    2. 使用 GitLab [流水线](https://gitlab.com/xuxiaowei-com-cn/kaniko/-/pipelines) 每周自动同步一次，镜像内容未做任何修改
7. 具体配置请参见 [参考示例](#demo) 的 `using_kaniko` 分支

## 方案 3：使用 `DOCKER_HOST` 环境变量 指定现存的 Docker 服务 构建 Docker 镜像 {id=plan-3}

### 文档 {id=plan-3-docs}

- [Use the Docker command line](https://docs.docker.com/engine/reference/commandline/cli/)

### 介绍 {id=plan-3-intro}

执行 Docker 命令 时，Docker 命令行工具 会 检查 环境变量 `DOCKER_HOST` 是否存在，如果存在时，Docker 命令行工具会与之通信，
用于完成 Docker 执行的命令

1. Docker 构建时的环境是一个已经存在的环境，非独立环境
2. 不需要 特权身份 运行 GitLab 流水线，不存在越权行为
3. 环境变量 `DOCKER_HOST` 的示例：`tcp://192.168.5.4:2375`（即：http）、`tcp://192.168.5.4:2376`（即：https，需要配置证书才能使用）
4. 已安装的 Docker 服务，默认不开启远程调用的端口（即：默认不开启 `2375`、`2376` 端口），如需开启，请参考下列配置：
    1. 以下以 Docker 服务的宿主机的 IP 是 `192.168.5.4` 为例，Docker 服务仅开启 监听 `2375`、`2376` 端口，不监听其他 IP
       （<strong><font color="red">防止云服务器意外暴露 Docker 端口时，被其他人恶意访问，导致信息泄露</font></strong>）
    2. 编辑 Docker 服务
        ```shell
        vim /lib/systemd/system/docker.service
        ```
    3. 默认 Docker 服务
        ```shell
        [Unit]
        ... 省略
        
        [Service]
        Type=notify
        ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
        
        ... 省略
        
        [Install]
        
        ... 省略
        ```
    4. 修改 Docker 服务
        ```shell
        [Unit]
        ... 省略
        
        [Service]
        Type=notify
        # 此处配置 Docker 监听的 端口 对应的 IP 是服务器的 内网IP，当且仅当使用 192.168.5.4:2375 才能与 Docker 进行远程通信
        # 强烈不建议此处配置为 tcp://0.0.0.0:2375，是为了防止云服务器意外暴露 Docker 端口时，被其他人使用 公网IP 恶意访问，导致信息泄露
        # 强烈不建议此处配置为 tcp://公网IP:2375，是为了防止云服务器意外暴露 Docker 端口时，被其他人使用 公网IP 恶意访问，导致信息泄露
        # 如需监听公网 IP，请使用云服务安全组、服务器防火墙限制 IP 访问 Docker 端口，用于提高安全性
        ExecStart=/usr/bin/dockerd -H tcp://192.168.5.4:2375 -H unix:///var/run/docker.sock
        
        ... 省略
        
        [Install]
        
        ... 省略
        ```
5. 支持 GitLab Runner 执行器：`docker`、`docker+machine`、`kubernetes` 等等
6. 具体配置请参见 [参考示例](#demo) 的 `docker_host` 分支

## 方案 4：使用宿主机 `docker.sock` 提供 Docker 服务 构建 Docker 镜像 {id=plan-4}

### 文档 {id=plan-4-docs}

- [Use the Docker command line](https://docs.docker.com/engine/reference/commandline/cli/)

### 介绍 {id=plan-4-intro}

执行 Docker 命令 时，Docker 命令行工具 会 检查 目录 `/var/run/docker.sock`、`/run/docker.sock` 是否存在，如果存在时，Docker
命令行工具会与之通信，用于完成 Docker 执行的命令

1. Docker 构建时的环境是一个已经存在的环境，非独立环境
2. 不需要 特权身份 运行 GitLab 流水线，不存在越权行为
3. 需要在 GitLab Runner 执行器所在的宿主机安装 Docker 服务，并保持 Docker 正常运行
4. 需要在 GitLab Runner 执行器配置文件（夹）路径挂载
    1. GitLab Runner Docker 执行器 文件（夹）路径挂载 配置，其他执行器配置雷同
        ```yaml
        # 配置文件位置：/etc/gitlab-runner/config.toml
        [[runners]]
          name = "lighthouse-docker"
          url = "https://jihulab.com/"
          ...省略
          executor = "docker"
          [runners.docker]
            ...省略
            volumes = ["/run/docker.sock:/run/docker.sock"]
            ...省略
        ```
5. 支持 GitLab Runner 执行器：`docker`、`docker+machine`、`kubernetes` 等等
6. 具体配置请参见 [参考示例](#demo) 的 `docker_sock` 分支

## 方案 5：使用 Shell 直接构建 Docker 镜像 {id=plan-5}

直接使用 Shell 执行器构建 Docker 镜像，无需镜像

1. Docker 构建时的环境是一个已经存在的环境，非独立环境，在 GitLab Runner 执行器宿主机上直接执行
2. 需要在 GitLab Runner 执行器所在的宿主机安装 Docker 服务，并保持 Docker 正常运行
3. 需要 GitLab Runner 运行时用户可正常执行 Docker 命令
4. 支持 GitLab Runner 执行器：`shell`
