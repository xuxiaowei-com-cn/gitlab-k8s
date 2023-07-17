# GitLab Docker 容器镜像仓库

GitLab Docker 私库开启配置与使用方式

## 文档

1. GitLab 容器镜像库
    1. [gitlab-jh 中文文档](https://docs.gitlab.cn/jh/user/packages/container_registry/)
    2. [gitlab-ee](https://docs.gitlab.com/ee/user/packages/container_registry/)
2. 容器镜像库身份验证
    1. [gitlab-jh 中文文档](https://docs.gitlab.cn/jh/user/packages/container_registry/authenticate_with_container_registry.html)
    2. [gitlab-ee](https://docs.gitlab.com/ee/user/packages/container_registry/authenticate_with_container_registry.html)
3. 构建容器镜像并将其推送到容器镜像库
    1. [gitlab-jh 中文文档](https://docs.gitlab.cn/jh/user/packages/container_registry/build_and_push_images.html)
    2. [gitlab-ee](https://docs.gitlab.com/ee/user/packages/container_registry/build_and_push_images.html)
4. 从容器镜像库中删除容器镜像
    1. [gitlab-jh 中文文档](https://docs.gitlab.cn/jh/user/packages/container_registry/delete_container_registry_images.html)
    2. [gitlab-ee](https://docs.gitlab.com/ee/user/packages/container_registry/delete_container_registry_images.html)
5. 减少容器镜像库存储
    1. [gitlab-jh 中文文档](https://docs.gitlab.cn/jh/user/packages/container_registry/reduce_container_registry_storage.html)
    2. [gitlab-ee](https://docs.gitlab.com/ee/user/packages/container_registry/reduce_container_registry_storage.html)

## 说明

1. 在 [GitLab](https://jihulab.com/) 等
   商业 GitLab 中可直接使用
2. 如果是自建 GitLab，需要配置 GitLab 容器镜像库的域名（https/SSL）才能使用（docker 镜像仓库需要使用
   https），如果没有配置，则不能访问 `项目地址/container_registry`（页面会返回 404）
    1. 如果自己有域名，可在阿里云、腾讯云、华为云、百度云等平台申请域名证书，大概在每个平台/账户/域名/年可以免费申请20个
        1. [阿里云SSL(https)证书免费申请](https://yundun.console.aliyun.com/?p=cas#/certExtend/buy)
        2. [腾讯云SSL(https)证书免费申请](https://console.cloud.tencent.com/ssl)
        3. [华为云SSL(https)证书免费申请](https://console.huaweicloud.com/console/#/ccm/scs/certList)
        4. [百度云SSL(https)证书免费申请](https://console.bce.baidu.com/cas/#/cas/purchased/common/list)
    2. 如果没有域名，需要使用下列命令创建域名，以 `registry.example.com` 域名为例（其中 GitLab 实例的 IP 是
       192.168.80.14，也可以使用 IP 生成证书）

    ```shell
    # 以 CentOS 为例
    # 如果出现 -bash: openssl: command not found，请安装 openssl：yum -y install openssl
    
    # 生成指定位数的 RSA 私钥：ca.key
    openssl genrsa -out ca.key 2048
    
    # 根据 RSA 私钥，生成 crt 证书：ca.crt
    # CN：设置你要使用的域名
    # -utf8：支持中文
    # openssl req -new -x509 -days 3650 -key ca.key -subj "/C=CN/ST=山东/L=青岛/O=徐晓伟工作室/OU=徐晓伟工作室/CN=192.168.80.14/emailAddress=xuxiaowei@xuxiaowei.com.cn" -out ca.crt -utf8
    openssl req -new -x509 -days 3650 -key ca.key -subj "/C=CN/ST=山东/L=青岛/O=徐晓伟工作室/OU=徐晓伟工作室/CN=registry.example.com/emailAddress=xuxiaowei@xuxiaowei.com.cn" -out ca.crt -utf8
    
    # 生成 server.csr、server.key
    # CN：设置你要使用的域名
    # -utf8：支持中文
    # openssl req -newkey rsa:2048 -nodes -keyout server.key -subj "/C=CN/ST=山东/L=青岛/O=徐晓伟工作室/CN=192.168.80.14" -out server.csr -utf8
    openssl req -newkey rsa:2048 -nodes -keyout server.key -subj "/C=CN/ST=山东/L=青岛/O=徐晓伟工作室/CN=registry.example.com" -out server.csr -utf8
    
    # 生成 ca.srl、server.crt
    # subjectAltName：设置 DNS、IP
    # openssl x509 -req -extfile <(printf "subjectAltName=IP:192.168.80.14") -days 3650 -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt
    openssl x509 -req -extfile <(printf "subjectAltName=DNS:registry.example.com") -days 3650 -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt
    ```

   最终生成了：ca.crt、ca.key、ca.srl、server.crt、server.csr、server.key，其中 **server.crt** 和 **server.key** 就是 Nginx
   使用的证书

## 配置

1. 设置 容器镜像库 域名

   ```shell
   sudo vim /etc/gitlab/gitlab.rb
   ```

   ```shell
   # 注意这里是 https
   registry_external_url 'https://registry.example.com'
   
   # 限制IP，防止与 GitLab Pages 冲突
   # registry_nginx['listen_addresses'] = ['192.168.80.3']
   
   # 指定证书位置
   # 下面是默认配置
   # registry_nginx['ssl_certificate'] = "/etc/gitlab/ssl/域名.crt"
   # registry_nginx['ssl_certificate_key'] = "/etc/gitlab/ssl/域名.key"
   ```

2. 重新配置

   ```shell
   sudo gitlab-ctl reconfigure
   ```

3. 查看状态是否有异常

   ```shell
   sudo gitlab-ctl status
   ```

4. 查看日志是否有异常

   ```shell
   sudo gitlab-ctl tail nginx
   ```

   ```shell
   # 如果出现下方日志，代表未找到 .crt 证书
   # 如果你使用的是阿里云等平台的Nginx证书，请将 .pem 文件后缀名修改为 .crt
   # 除了后缀名外，证书文件名为 registry_external_url 配置的域名
   # 证书的位置是 /etc/gitlab/ssl，如：/etc/gitlab/ssl/registry.example.com.crt、/etc/gitlab/ssl/registry.example.com.key
   # 如果仅缺少证书报错，将证书文件上传至指定位置后，nginx 会自动启动（推荐手动配置一次）
   ==> /var/log/gitlab/nginx/error.log <==
   2023/06/25 14:55:18 [emerg] 21028#0: cannot load certificate "/etc/gitlab/ssl/registry.example.com.crt": BIO_new_file() failed (SSL: error:02001002:system library:fopen:No such file or directory:fopen('/etc/gitlab/ssl/registry.example.com.crt','r') error:2006D080:BIO routines:BIO_new_file:no such file)
   ```

   日志文件夹：`/var/log/gitlab`

5. 访问 `项目地址/container_registry` ，如果返回的不是 `404` 说明已经配置好了
    1. 如果使用域名，则需要添加DNS（或修改本地 hosts）
    2. 如果是自己生成的证书，使用时需要忽略证书验证：参见：
        1. [Docker 容器 Nexus 配置 SSL/https](/docs/nexus/docker-https-configuration.md)
6. GitLab Docker 容器镜像库凭证（公开项目拉取镜像无需凭证）
   其中 `$CI_REGISTRY` 是 GitLab `registry_external_url` 设置的域名，可访问 `项目地址/container_registry` 看到
    1. 用户名/密码

       ```shell
       # 推荐在个人电脑上使用
       docker login -u 用户名 -p 密码 $CI_REGISTRY
       ```

    2. CI_REGISTRY_USER CI/CD 变量：

       ```shell
       # 此变量对容器镜像库具有读写权限，并且仅对一个作业有效。它的密码也会自动创建并分配给 CI_REGISTRY_PASSWORD。
       docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
       ```

    3. CI 作业令牌：

       ```shell
       # 推荐在 GitLab Runner 流水线中使用
       docker login -u $CI_REGISTRY_USER -p $CI_JOB_TOKEN $CI_REGISTRY
       ```

    4. 部署令牌：

       ```shell
       # 推荐在不是 GitLab Runner 流水线中使用
       # 对于读（拉取）访问，范围为 read_registry。
       # 对于写（推送）访问，范围为 write_registry。
       docker login -u $CI_DEPLOY_USER -p $CI_DEPLOY_PASSWORD $CI_REGISTRY
       ```

    5. 个人访问令牌：

       ```shell
       # 推荐在个人电脑上使用
       # 对于读（拉取）访问，范围为 read_registry。
       # 对于写（推送）访问，范围为 write_registry。
       docker login -u <username> -p <access_token> $CI_REGISTRY
       ```

7. 域名证书验证失败：参见：[Docker 容器 Nexus 配置 SSL/https](/docs/nexus/docker-https-configuration.md)
   先在宿主机上信任域名，然后使用挂载卷映射 `/etc/docker/certs.d` 到容器内即可

    ```shell
    # 此处以 Docker 执行器为例
    
    [[runners]]
      name = "localhost.localdomain"
      url = "http://192.168.61.147/"
      id = 2
      token = "oy1n427tVsyLazho1RR4"
      token_obtained_at = 2023-06-15T07:25:14Z
      token_expires_at = 0001-01-01T00:00:00Z
      executor = "docker"
      [runners.cache]
        MaxUploadedArchiveSize = 0
      [runners.docker]
        tls_verify = false
        image = "ruby:2.7"
        privileged = true
        disable_entrypoint_overwrite = false
        oom_kill_disable = false
        disable_cache = false
        # /etc/hosts:/etc/hosts：用户指定DNS（hosts）
        # /etc/docker/certs.d:/etc/docker/certs.d：信任 docker 域名证书配置的文件夹
        volumes = ["/cache", "/etc/hosts:/etc/hosts", "/etc/docker/certs.d:/etc/docker/certs.d"]
        shm_size = 0
    ```
