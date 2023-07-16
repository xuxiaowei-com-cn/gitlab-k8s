---
sidebar_position: 2
---

# Docker 安装 PostgreSQL 15

## 说明

1. 用于创建 sonarqube 时数据永久储存（创建 sonarqube 不指定数据库，仅用于测试，无法升级）

## 命令

```shell
docker \
  run \
  -itd \
  --restart always \
  --privileged=true \
  --name some-postgres \
  -p 5432:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e PGDATA=/var/lib/postgresql/data/pgdata \
  -v /custom/postgresql/mount:/var/lib/postgresql/data \
  -d postgres:15.2
```

| docker                                               | docker 命令                    |
|------------------------------------------------------|------------------------------|
| run                                                  | 运行                           |
| -i                                                   | 交互式保持STDIN打开，即使未连接           |
| -t                                                   | 分配一个伪tty                     |
| -d                                                   | 分离后台运行容器并打印容器ID              |
| --restart always                                     | 容器是否跟随Docker重启               |
| --privileged=true                                    | 授予此容器扩展权限                    |
| --name some-postgres                                 | 为容器指定名称                      |
| -p 5432:5432                                         | 端口映射                         |
| -e POSTGRES_USER=postgres                            | 环境变量，指定用户名/数据库名              |
| -e POSTGRES_PASSWORD=mysecretpassword                | 环境变量，指定密码                    |
| -e PGDATA=/var/lib/postgresql/data/pgdata            | 环境变量，指定数据储存在容器内的路径           |
| -v /custom/postgresql/mount:/var/lib/postgresql/data | 挂载卷，指定路径映射，将容器内数据储存路径映射到主机路径 |
| -d postgres:15.2                                     | 指定使用的镜像                      |
