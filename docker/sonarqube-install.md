# Docker 安装 sonarqube

## 说明

1. 用于分析代码质量
2. 用于分析代码覆盖率
3. 需要连接数据库，如：PostgreSQL，如果仅用于评估软件，则可忽略数据库配置

## 命令

```shell
docker \
  run \
  -itd \
  --restart always \
  --privileged=true \
  --name sonarqube \
  -v sonarqube-data:/opt/sonarqube/data \
  -v sonarqube-logs:/opt/sonarqube/logs \
  -v sonarqube-extensions:/opt/sonarqube/extensions \
  -e SONAR_JDBC_URL=jdbc:postgresql://192.168.0.29:5432/postgres \
  -e SONAR_JDBC_USERNAME=postgres \
  -e SONAR_JDBC_PASSWORD=mysecretpassword \
  -p 9000:9000 \
  -d sonarqube:9.9.0-community
```

| docker                                                         | docker 命令          |
|----------------------------------------------------------------|--------------------|
| run                                                            | 运行                 |
| -i                                                             | 交互式保持STDIN打开，即使未连接 |
| -t                                                             | 分配一个伪tty           |
| -d                                                             | 分离后台运行容器并打印容器ID    |
| --restart always                                               | 容器是否跟随Docker重启     |
| --privileged=true                                              | 授予此容器扩展权限          |
| --name sonarqube                                               | 为容器指定名称            |
| -v sonarqube-data:/opt/sonarqube/data                          | 挂载卷，数据储存路径         |
| -v sonarqube-logs:/opt/sonarqube/logs                          | 挂载卷，日志储存路径         |
| -v sonarqube-extensions:/opt/sonarqube/extensions              | 挂载卷，组件储存路径         |
| -e SONAR_JDBC_URL=jdbc:postgresql://192.168.0.29:5432/postgres | 环境变量，指定数据库连接串      |
| -e SONAR_JDBC_USERNAME=postgres                                | 环境变量，指定数据库用户名      |
| -e SONAR_JDBC_PASSWORD=mysecretpassword                        | 环境变量，指定数据库密码       |
| -p 9000:9000                                                   | 端口映射               |
| -d sonarqube:9.9.0-community                                   | 指定使用的镜像            |
