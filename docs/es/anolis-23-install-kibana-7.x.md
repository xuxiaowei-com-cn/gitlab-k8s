---
sidebar_position: 3
---

# Anolis 23 中安装 Kibana 7.x

## 文档

1. https://www.elastic.co/cn/downloads/kibana
2. https://www.elastic.co/guide/en/kibana/7.17/rpm.html#rpm-repo

## 说明

1. 本文以 Anolis 龙蜥 23 为例，CentOS 同理
2. 本文以 Kibana 7.17.14 为例，首次发稿时的最新版
3. 强烈建议 Kibana 与要连接的 Elasticsearch 版本一致，否则有可能导致 Kibana 与 Elasticsearch 无法正常通信

## 安装 Kibana

### 导入 Kibana GPG 密钥

```shell
rpm --import https://artifacts.elastic.co/GPG-KEY-elasticsearch
```

### 从 RPM 存储库安装

#### 添加 RPM 存储库

```shell
cat > /etc/yum.repos.d/kibana.repo << EOF
[kibana-7.x]
name=Kibana repository for 7.x packages
baseurl=https://artifacts.elastic.co/packages/7.x/yum
gpgcheck=1
gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch
enabled=1
autorefresh=1
type=rpm-md

EOF

cat /etc/yum.repos.d/kibana.repo
```

#### 搜索 Kibana 版本

```shell
yum --showduplicates list kibana
```

```shell
[root@elasticsearch-1 ~]# yum --showduplicates list kibana
Kibana repository for 7.x packages                                                                                                                                                           15 MB/s |  54 MB     00:03    
Last metadata expiration check: 0:00:14 ago on Fri Oct 20 09:15:44 2023.
Available Packages
kibana.x86_64                                                                                              7.0.0-1                                                                                                kibana-7.x
kibana.x86_64                                                                                              7.0.1-1                                                                                                kibana-7.x
kibana.x86_64                                                                                              7.1.0-1                                                                                                kibana-7.x
kibana.x86_64                                                                                              7.1.1-1                                                                                                kibana-7.x
kibana.x86_64                                                                                              7.2.0-1                                                                                                kibana-7.x
kibana.x86_64                                                                                              7.2.1-1                                                                                                kibana-7.x
kibana.x86_64                                                                                              7.3.0-1                                                                                                kibana-7.x
kibana.x86_64                                                                                              7.3.1-1                                                                                                kibana-7.x
kibana.x86_64                                                                                              7.3.2-1                                                                                                kibana-7.x
kibana.x86_64                                                                                              7.4.0-1                                                                                                kibana-7.x
kibana.x86_64                                                                                              7.4.1-1                                                                                                kibana-7.x
kibana.x86_64                                                                                              7.4.2-1                                                                                                kibana-7.x
kibana.x86_64                                                                                              7.5.0-1                                                                                                kibana-7.x
kibana.x86_64                                                                                              7.5.1-1                                                                                                kibana-7.x
kibana.x86_64                                                                                              7.5.2-1                                                                                                kibana-7.x
kibana.x86_64                                                                                              7.6.0-1                                                                                                kibana-7.x
kibana.x86_64                                                                                              7.6.1-1                                                                                                kibana-7.x
kibana.x86_64                                                                                              7.6.2-1                                                                                                kibana-7.x
kibana.x86_64                                                                                              7.7.0-1                                                                                                kibana-7.x
kibana.x86_64                                                                                              7.7.1-1                                                                                                kibana-7.x
kibana.x86_64                                                                                              7.8.0-1                                                                                                kibana-7.x
kibana.x86_64                                                                                              7.8.1-1                                                                                                kibana-7.x
kibana.x86_64                                                                                              7.9.0-1                                                                                                kibana-7.x
kibana.x86_64                                                                                              7.9.1-1                                                                                                kibana-7.x
kibana.x86_64                                                                                              7.9.2-1                                                                                                kibana-7.x
kibana.x86_64                                                                                              7.9.3-1                                                                                                kibana-7.x
kibana.x86_64                                                                                              7.10.0-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.10.1-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.10.2-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.11.0-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.11.0-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.11.1-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.11.1-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.11.2-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.11.2-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.12.0-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.12.0-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.12.1-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.12.1-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.13.0-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.13.0-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.13.1-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.13.1-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.13.2-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.13.2-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.13.3-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.13.3-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.13.4-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.13.4-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.14.0-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.14.0-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.14.1-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.14.1-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.14.2-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.14.2-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.15.0-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.15.0-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.15.1-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.15.1-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.15.2-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.15.2-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.16.0-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.16.0-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.16.1-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.16.1-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.16.2-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.16.2-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.16.3-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.16.3-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.17.0-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.17.0-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.17.1-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.17.1-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.17.2-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.17.2-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.17.3-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.17.3-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.17.4-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.17.4-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.17.5-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.17.5-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.17.6-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.17.6-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.17.7-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.17.7-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.17.8-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.17.8-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.17.9-1                                                                                               kibana-7.x
kibana.x86_64                                                                                              7.17.9-1                                                                                               kibana-7.x
kibana.aarch64                                                                                             7.17.10-1                                                                                              kibana-7.x
kibana.x86_64                                                                                              7.17.10-1                                                                                              kibana-7.x
kibana.aarch64                                                                                             7.17.11-1                                                                                              kibana-7.x
kibana.x86_64                                                                                              7.17.11-1                                                                                              kibana-7.x
kibana.aarch64                                                                                             7.17.12-1                                                                                              kibana-7.x
kibana.x86_64                                                                                              7.17.12-1                                                                                              kibana-7.x
kibana.aarch64                                                                                             7.17.13-1                                                                                              kibana-7.x
kibana.x86_64                                                                                              7.17.13-1                                                                                              kibana-7.x
kibana.aarch64                                                                                             7.17.14-1                                                                                              kibana-7.x
kibana.x86_64                                                                                              7.17.14-1                                                                                              kibana-7.x
[root@elasticsearch-1 ~]#
```

#### 安装

```shell
# 安装 Kibana 7.x 最新版（不推荐）
# yum install -y kibana

# 强烈建议 Kibana 与要连接的 Elasticsearch 版本一致，否则有可能导致 Kibana 与 Elasticsearch 无法正常通信
yum install -y kibana-7.17.14-1
```

安装日志

```shell
[root@elasticsearch-1 ~]# yum install -y kibana-7.17.14-1
Last metadata expiration check: 0:03:54 ago on Fri Oct 20 09:15:44 2023.
Dependencies resolved.
============================================================================================================================================================================================================================
 Package                                            Architecture                                       Version                                                 Repository                                              Size
============================================================================================================================================================================================================================
Installing:
 kibana                                             x86_64                                             7.17.14-1                                               kibana-7.x                                             286 M

Transaction Summary
============================================================================================================================================================================================================================
Install  1 Package

Total download size: 286 M
Installed size: 733 M
Downloading Packages:
kibana-7.17.14-x86_64.rpm                                                                                                                                                                    13 MB/s | 286 MB     00:21    
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Total                                                                                                                                                                                        13 MB/s | 286 MB     00:21     
Running transaction check
Transaction check succeeded.
Running transaction test
Transaction test succeeded.
Running transaction
  Preparing        :                                                                                                                                                                                                    1/1 
  Running scriptlet: kibana-7.17.14-1.x86_64                                                                                                                                                                            1/1 
  Installing       : kibana-7.17.14-1.x86_64                                                                                                                                                                            1/1 
  Running scriptlet: kibana-7.17.14-1.x86_64                                                                                                                                                                            1/1 
Creating kibana group... OK
Creating kibana user... OK

Kibana is currently running with legacy OpenSSL providers enabled! For details and instructions on how to disable see https://www.elastic.co/guide/en/kibana/7.17/production.html#openssl-legacy-provider
Created Kibana keystore in /etc/kibana/kibana.keystore

/usr/lib/tmpfiles.d/elasticsearch.conf:1: Line references path below legacy directory /var/run/, updating /var/run/elasticsearch → /run/elasticsearch; please update the tmpfiles.d/ drop-in file accordingly.

  Verifying        : kibana-7.17.14-1.x86_64                                                                                                                                                                            1/1 

Installed:
  kibana-7.17.14-1.x86_64                                                                                                                                                                                                   

Complete!
[root@elasticsearch-1 ~]#
```

## 启动

```shell
systemctl start kibana
```

```shell
[root@elasticsearch-1 ~]# systemctl status kibana.service --no-pager
○ kibana.service - Kibana
     Loaded: loaded (/etc/systemd/system/kibana.service; disabled; preset: disabled)
     Active: inactive (dead)
       Docs: https://www.elastic.co
[root@elasticsearch-1 ~]# systemctl is-enabled kibana.service 
disabled
[root@elasticsearch-1 ~]# systemctl status kibana
○ kibana.service - Kibana
     Loaded: loaded (/etc/systemd/system/kibana.service; disabled; preset: disabled)
     Active: inactive (dead)
       Docs: https://www.elastic.co
[root@elasticsearch-1 ~]# systemctl start kibana
[root@elasticsearch-1 ~]# systemctl status kibana --no-pager
● kibana.service - Kibana
     Loaded: loaded (/etc/systemd/system/kibana.service; disabled; preset: disabled)
     Active: active (running) since Thu 2023-10-19 20:07:15 CST; 13s ago
       Docs: https://www.elastic.co
   Main PID: 1523 (node)
      Tasks: 11 (limit: 19155)
     Memory: 583.8M
        CPU: 15.893s
     CGroup: /system.slice/kibana.service
             └─1523 /usr/share/kibana/bin/../node/bin/node /usr/share/kibana/bin/../src/cli/dist --logging.dest=/var/log/kibana/kibana.log --pid.file=/run/kibana/kibana.pid "--…

Oct 19 20:07:15 elasticsearch-1 systemd[1]: Started kibana.service - Kibana.
Oct 19 20:07:15 elasticsearch-1 kibana[1523]: Kibana is currently running with legacy OpenSSL providers enabled! For details and instructions on how to disable see…gacy-provider
Hint: Some lines were ellipsized, use -l to show in full.
[root@elasticsearch-1 ~]#
```

## 设置开机自启

```shell
systemctl enable kibana
```

```shell
[root@elasticsearch-1 ~]# systemctl enable kibana
Synchronizing state of kibana.service with SysV service script with /usr/lib/systemd/systemd-sysv-install.
Executing: /usr/lib/systemd/systemd-sysv-install enable kibana
Created symlink /etc/systemd/system/multi-user.target.wants/kibana.service → /etc/systemd/system/kibana.service.
[root@elasticsearch-1 ~]# systemctl is-enabled kibana
enabled
[root@elasticsearch-1 ~]#
```

## 配置

### 远程访问

```shell
vim /etc/kibana/kibana.yml
```

```shell
server.host: 0.0.0.0
```

```shell
systemctl status kibana --no-pager
systemctl restart kibana
systemctl status kibana --no-pager
```

### 中文菜单

```shell
vim /etc/kibana/kibana.yml
```

```shell
i18n.locale: "zh-CN"
```

```shell
systemctl status kibana --no-pager
systemctl restart kibana
systemctl status kibana --no-pager
```

### 连接 Elasticsearch

```shell
vim /etc/kibana/kibana.yml
```

```shell
# 填写 elasticsearch 的IP与端口
# 此处作者将 elasticsearch、kibana 安装在同一台机器上，所以使用的是 localhost
elasticsearch.hosts: ["http://localhost:9200"]
```

```shell
systemctl status kibana --no-pager
systemctl restart kibana
systemctl status kibana --no-pager
```

### 开放端口，远程访问

```shell
firewall-cmd --zone=public --add-port=5601/tcp --permanent
firewall-cmd --reload
firewall-cmd --list-all
```

### 配置 Elasticsearch Password（可选）

- 如果 Elasticsearch 开启了 Security，则这里需要配置，否则将无法使用

```shell
vim /etc/kibana/kibana.yml
```

```shell
elasticsearch.username: "kibana_system"
elasticsearch.password: "ELxXSJsi4QSCFUXrwxZJ"
```

```shell
systemctl status kibana --no-pager
systemctl restart kibana
systemctl status kibana --no-pager
```

### 浏览器访问

- http://ip:5601
- 如果 Elasticsearch 开启了 Security，则登录需要输入 `elastic` 用户名和密码
