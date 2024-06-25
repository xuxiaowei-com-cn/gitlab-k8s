# GitLab 使用 Docker Compose 部署 {id=gitlab-docker-compose}

[[toc]]

## 文档 {id=doc}

|                  | 中文/国内                                                                           | 英文/国际                                                                            |
|------------------|---------------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| GitLab 源码        | [极狐 GitLab 仓库](https://jihulab.com/gitlab-cn/gitlab)                            | [GitLab 仓库](https://gitlab.com/gitlab-org/gitlab)                                |
| GitLab Docker 镜像 | [文档](https://docs.gitlab.cn/jh/install/docker.html)                             | [文档](https://docs.gitlab.com/ee/install/docker.html)                             |
| Nginx 配置         | [文档](https://docs.gitlab.cn/omnibus/settings/nginx.html)                        | [文档](https://docs.gitlab.com/omnibus/settings/nginx.html)                        |
| SMTP 配置          | [文档](https://docs.gitlab.cn/omnibus/settings/smtp.html)                         | [文档](https://docs.gitlab.com/omnibus/settings/smtp.html)                         |
| SSL 配置           | [文档](https://docs.gitlab.cn/omnibus/settings/ssl/index.html)                    | [文档](https://docs.gitlab.com/omnibus/settings/ssl/index.html)                    |
| GitLab Pages 管理  | [文档](https://docs.gitlab.cn/jh/administration/pages/)                           | [文档](https://docs.gitlab.com/ee/administration/pages/)                           |
| GitLab 容器镜像库管理   | [文档](https://docs.gitlab.cn/jh/administration/packages/container_registry.html) | [文档](https://docs.gitlab.com/ee/administration/packages/container_registry.html) |

## 说明 {id=description}

1. 本文使用 `docker-compose.yml` 部署 GitLab、GitLab Runner
2. 需要服务器上已安装 Docker、Docker Compose
3. 由于本人使用的 Docker 版本比较新（26.1.3），在高版本的 Docker 中，`docker-compose.yml` 无需 `version` 关键字，
   所以本文脚本不会携带 `version`
4. 本人使用了 `TLS`/`SSL`，即：配置了 `https`，如果暂时不想使用 `https`，可将 脚本中的 `https` 修改为 `http`
    1. <strong><font color="red">如果要 GitLab Docker 容器镜像仓库，必须配置 https</font></strong>
    2. 即使你使用权威机构颁发的证书（如：阿里、腾讯等云厂商免费或购买的证书，或者从其他第三方申请、购买的证书），或者自己生成的证书，一般在服务器中都需要配置证书信任
        1. 一个证书是否在当前操作系统中授信，取决于该证书链是否存在于当前系统的授信证书列表中
        2. 比如：在 Windows 7 及更早版本的系统上安装软件时，可能会遇见 Windows 验证软件签名时异常，
           原因是当前 Windows 不存在需要验证软件签名的证书链，这时只要在当前操作系统中安装微软新颁发的证书链后，即可完成软件的安装
           （注意：此处介绍的虽然是软件签名的证书，但是与 https 证书授信原理相同）
        3. 比如：网站证书已配置完成，浏览器访问时 https 正常工作，但是服务器中的 java 程序、curl、wget 无法访问，
           原因是浏览器操作系统包含的证书链包含了访问的域名证书，而服务器中的证书链一般比较旧，需要手动添加证书进行信任
        4. 如果使用自己创建的证书，需要进行证书信任，请按照使用的域名、IP进行创建，不要张冠李戴，
           如：自己创建域名证书是颁发给 `gitlab.xuxiaowei.cn`，而使用时用作 `registry.xuxiaowei.cn` 进行配置，这样无法进行信任。
        5. 自己生成证书时，推荐使用通配符证书，如：`*.xuxiaowei.cn`，可以用于 `gitlab.xuxiaowei.cn`、`registry.xuxiaowei.cn`
           等域名证书的配置
5. 如果要启用 GitLab Pages 功能，需要使用与 GitLab 实例不同的 IP，
   参见文档：[GitLab Pages 管理](https://docs.gitlab.cn/jh/administration/pages/)，下方脚本已完成分配不同IP的配置
6. 如果要启用 GitLab Docker 容器镜像仓库，也需要与 GitLab Pages 一样，与 GitLab 实例使用不同的 IP，下方脚本已完成分配不同IP的配置

## 视频 {id=video}

- 请查看此视频合集中名称带有 docker-compose 的视频：https://www.bilibili.com/video/BV1E1421y718

## 配置 {id=config}

```yaml
services:
  gitlab:
    image: 'registry.gitlab.cn/omnibus/gitlab-jh:17.1.0'
    restart: always
    # hostname: 'gitlab.xuxiaowei.cn'
    # 更新证书 并 启动 gitlab
    entrypoint: /bin/bash -c "update-ca-certificates && /assets/wrapper"
    #healthcheck:
    #  # 用于定义健康检查的命令，这里使用的是curl命令来测试指定URL的可访问性。
    #  test: ["CMD", "curl", "-k", "https://gitlab.xuxiaowei.cn/-/liveness?token=FFWoGWuYJih1Jp9e3zby"]
    #  # 定义了健康检查之间的间隔时间。这个字段可能需要补充完整，以确定健康检查之间的间隔时间。
    #  interval: 5s
    #  # 定义了在判定失败之前尝试健康检查的次数。这个字段可能需要补充完整，以确定允许的重试次数。
    #  retries: 5
    #  # 定义了每次健康检查的超时时间。这个字段可能需要补充完整，以确定每次健康检查的超时时间。
    #  timeout: 5s
    #  # 定义了容器启动后开始进行健康检查之前的等待时间。这个字段可能需要补充完整，以确定健康检查开始之前的等待时间。
    #  start_period: 180s
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'https://gitlab.xuxiaowei.cn'
        # Add any other gitlab.rb configuration here, each on its own line

        # 时区
        gitlab_rails['time_zone'] = 'Asia/Shanghai'

        # http 重定向到 https
        nginx['redirect_http_to_https'] = true
        nginx['redirect_http_to_https_port'] = 80
        # 监听的 IP
        nginx['listen_addresses'] = ['172.26.11.2']

        # 容器镜像库
        registry_external_url 'https://registry.xuxiaowei.cn'
        # 容器镜像库：http 重定向到 https
        registry_nginx['redirect_http_to_https'] = true
        registry_nginx['redirect_http_to_https_port'] = 80
        # 容器镜像库：监听的 IP
        registry_nginx['listen_addresses'] = ['172.26.12.2']

        # Pages
        pages_external_url 'https://pages.xuxiaowei.cn'
        pages_nginx['enable'] = false
        # Pages：http 重定向到 https
        pages_nginx['redirect_http_to_https'] = true
        gitlab_pages['redirect_http'] = true
        # Pages：监听的 IP
        gitlab_pages['external_http'] = ['172.26.13.2:80']
        gitlab_pages['external_https'] = ['172.26.13.2:443']

        # 配置第三方登陆
        # 注意：如果要配置多个第三方登陆，需要合并下列配置
        # 钉钉 配置
        # gitlab_rails['omniauth_providers'] = [{ name: "dingtalk", app_id: "", app_secret: "" }]
        # GitHub 配置
        # gitlab_rails['omniauth_providers'] = [{ name: "github", app_id: "", app_secret: "", args: { scope: "user:email" } }]
        # GitLab 配置
        # gitlab_rails['omniauth_providers'] = [{ name: "gitlab", app_id: "", app_secret: "", args: { scope: "read_user" } }]

        # 邮箱：此处以 Office 365 为例，其他类型的邮箱雷同
        gitlab_rails['smtp_enable'] = true
        gitlab_rails['smtp_address'] = 'smtp.office365.com'
        gitlab_rails['smtp_port'] = 587
        gitlab_rails['smtp_user_name'] = 'xuxiaowei-test@xuxiaowei.com.cn'
        # 邮箱：配置密码，在容器内的 /etc/gitlab/gitlab.rb 中配置
        # gitlab_rails['smtp_password'] = ''
        gitlab_rails['smtp_domain'] = 'xuxiaowei.com.cn'
        gitlab_rails['smtp_authentication'] = 'login'
        gitlab_rails['smtp_enable_starttls_auto'] = true
        gitlab_rails['smtp_openssl_verify_mode'] = 'peer'
        gitlab_rails['gitlab_email_from'] = 'xuxiaowei-test@xuxiaowei.com.cn'

    ports:
      - '80:80'
      - '443:443'
      - '2222:22'
    volumes:
      - '$GITLAB_HOME/config:/etc/gitlab'
      # 挂载证书，启动容器时进行信任
      - '$GITLAB_HOME/config/ssl:/usr/local/share/ca-certificates'
      - '$GITLAB_HOME/logs:/var/log/gitlab'
      - '$GITLAB_HOME/data:/var/opt/gitlab'
    shm_size: '256m'
    container_name: gitlab
    extra_hosts:
      - "gitlab.xuxiaowei.cn:172.26.11.2"
    networks:
      instance:
        ipv4_address: 172.26.11.2
      registry:
        ipv4_address: 172.26.12.2
      pages:
        ipv4_address: 172.26.13.2

  gitlab-runner:
    # image: 'gitlab/gitlab-runner:v17.1.0'
    image: 'registry.cn-qingdao.aliyuncs.com/xuxiaoweicomcn/gitlab-runner:v17.1.0'
    volumes:
      - '$GITLAB_HOME/gitlab-runner/config:/etc/gitlab-runner'
      - '$GITLAB_HOME/config/ssl:/etc/gitlab-runner/certs'
      - '/run/docker.sock:/run/docker.sock'
    container_name: gitlab-runner
    extra_hosts:
      - "gitlab.xuxiaowei.cn:172.26.11.2"
    #depends_on:
    #  gitlab:
    #    condition: service_healthy
    networks:
      instance:
        ipv4_address: 172.26.11.3

networks:
  instance:
    driver: bridge
    name: gitlab-instance
    ipam:
      config:
        - subnet: 172.26.11.0/24
          gateway: 172.26.11.1
  registry:
    driver: bridge
    name: gitlab-registry
    ipam:
      config:
        - subnet: 172.26.12.0/24
          gateway: 172.26.12.1
  pages:
    driver: bridge
    name: gitlab-pages
    ipam:
      config:
        - subnet: 172.26.13.0/24
          gateway: 172.26.13.1
```

### 网络 {id=networks}

| 网卡       | 网卡/网络名称         | 网段               | 范围                          | 说明              | 使用                     |
|----------|-----------------|------------------|-----------------------------|-----------------|------------------------|
| instance | gitlab-instance | `172.26.11.0/24` | 172.26.11.0 ~ 172.26.11.255 | GitLab 实例专用     | 直接使用映射到宿主的端口即可         |
| registry | gitlab-registry | `172.26.12.0/24` | 172.26.12.0 ~ 172.26.12.255 | GitLab 容器镜像库专用  | 必须使用 172.26.12.0/24 才行 |
| pages    | gitlab-pages    | `172.26.13.0/24` | 172.26.13.0 ~ 172.26.13.255 | GitLab Pages 专用 | 必须使用 172.26.13.0/24 才行 |

- 外部访问 `registry`、`pages` 时，请自定义路由
- 因为不同网卡之间网络不通，所以 GitLab Runner 容器使用了 `registry` 网卡，并分配了 172.26.11.3，
  所以 GitLab Runner 能与 GitLab 实例 172.26.11.2 进行通信

### 域名、IP 分配 {id=domain-ip}

| 域名                      | 虚拟 IP       | 说明                                                              |
|-------------------------|-------------|-----------------------------------------------------------------|
| `gitlab.xuxiaowei.cn`   | 172.26.11.2 | GitLab 实例名，此 IP 的端口将映射到宿主机                                      |
| `registry.xuxiaowei.cn` | 172.26.12.2 | GitLab Docker 镜像仓库域名，此 IP 的端口不会映射到宿主机                           |
| `pages.xuxiaowei.cn`    | 172.26.13.2 | GitLab Pages 主域，实际使用：`命令空间.pages.xuxiaowei.cn`，此 IP 的端口不会映射到宿主机 |

### 挂载卷 {id=volumes}

- 挂载卷使用目录形式，根目录是 `/srv/gitlab`
- 主要挂载卷

| 宿主机目录                | 容器内目录             | 说明           |
|----------------------|-------------------|--------------|
| `/srv/gitlab/config` | `/etc/gitlab`     | GitLab 配置文件夹 |
| `/srv/gitlab/data`   | `/var/opt/gitlab` | GitLab 数据文件夹 |
| `/srv/gitlab/logs`   | `/var/log/gitlab` | GitLab 日志文件夹 |

- 其他挂载卷

| 宿主机目录                              | 容器内目录                              | 说明                                                                                                                                |
|------------------------------------|------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| `/srv/gitlab/config/ssl`           | `/etc/gitlab/ssl`                  | 证书文件夹，如果未单独指定，GitLab 默认会查找这个文件夹下的证书，证书名是`域名`，后缀名分别是 `.crt`、`.key`                                                                 |
| `/srv/gitlab/config/ssl`           | `/usr/local/share/ca-certificates` | 用于 GitLab Pages 信任 GitLab 实例证书<strong><font color="red"><sup>1</sup></font></strong>                                              |
| `/srv/gitlab/config/ssl`           | `/etc/gitlab-runner/certs`         | GitLab Runner 在注册和使用时，与 GitLab 实例通信时，可能存在证书信任问题，用于注册 GitLab Runner 时自定义通讯证书<strong><font color="red"><sup>2</sup></font></strong> |
| `/srv/gitlab/gitlab-runner/config` | `/etc/gitlab-runner`               | 用于持久化 GitLab Runner 的配置文件夹                                                                                                        |
| `/run/docker.sock`                 | `/run/docker.sock`                 | 用于 GitLab Runner 使用 Docker 执行器时，使用 Docker 功能                                                                                      |

- <strong><font color="red">1</font></strong>：GitLab 在启用 Pages 后，当用户访问 Pages 功能时，Pages 程序会访问 GitLab 实例，
  确认是否存在此 Pages 域名，由于可能无法信任证书，故此处挂载 GitLab 实例的域名证书，
  在容器创建时的 `entrypoint` 命令 `/assets/wrapper` 前增加 `update-ca-certificates`，
  主动触发信任 `/usr/local/share/ca-certificates` 文件夹下的证书
- <strong><font color="red">2</font></strong>：GitLab Runner 注册时，增加参数 `--tls-ca-file` 指定证书文件位置，
  用于信任 GitLab 实例的 https 证书

### 证书配置 {id=cert}

- 如果使用 `docker-compose.yml` 文件内使用了 `https`，执行创建容器前，需要先存着下列证书文件，如果没有配置 `https`，则无需下列文件

| 域名                      | 位置                                                                                                    | 说明                                                                      |
|-------------------------|-------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| `gitlab.xuxiaowei.cn`   | `/srv/gitlab/config/ssl/gitlab.xuxiaowei.cn.crt`、`/srv/gitlab/config/ssl/gitlab.xuxiaowei.cn.key`     | 用于配置 GitLab 实例的 https，默认读取的文件夹和名称                                       |
| `registry.xuxiaowei.cn` | `/srv/gitlab/config/ssl/registry.xuxiaowei.cn.crt`、`/srv/gitlab/config/ssl/registry.xuxiaowei.cn.key` | 用于配置 GitLab Docker 容器镜像仓库的 https，默认读取的文件夹和名称                            |
| `pages.xuxiaowei.cn`    | `/srv/gitlab/config/ssl/pages.xuxiaowei.cn.crt`、`/srv/gitlab/config/ssl/pages.xuxiaowei.cn.key`       | 用于配置 GitLab Pages 的 https，默认读取的文件夹和名称，推荐使用 `*.pages.xuxiaowei.cn` 通配符证书 |

### 创建 docker 命令 {id=docker-compose}

1. 在服务器安装 docker、docker compose
2. 创建文件 `docker-compose.yml`，内容为上述脚本的内容
3. 在 `docker-compose.yml` 所在的文件夹中执行 `export GITLAB_HOME=/srv/gitlab && docker compose up -d`

### 密码 {id=password}

默认用户名：`root`，默认密码在 `/srv/gitlab/config/initial_root_password` 文件中
