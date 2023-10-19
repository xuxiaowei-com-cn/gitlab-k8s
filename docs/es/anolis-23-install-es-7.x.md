---
sidebar_position: 1
---

# Anolis 23 中安装 Elasticsearch 7.x

## 文档

1. https://www.elastic.co/cn/downloads/elasticsearch
2. https://www.elastic.co/guide/en/elasticsearch/reference/7.17/rpm.html
3. https://www.elastic.co/guide/en/elasticsearch/reference/7.17/security-basic-setup.html
4. https://www.elastic.co/guide/en/elasticsearch/reference/7.17/security-settings.html
5. https://www.elastic.co/guide/en/elasticsearch/reference/7.17/setup-passwords.html

## 安装 Elasticsearch

### 导入 Elasticsearch GPG 密钥

```shell
rpm --import https://artifacts.elastic.co/GPG-KEY-elasticsearch
```

### 从 RPM 存储库安装

#### 添加 RPM 存储库

```shell
cat > /etc/yum.repos.d/elasticsearch.repo << EOF
[elasticsearch]
name=Elasticsearch repository for 7.x packages
baseurl=https://artifacts.elastic.co/packages/7.x/yum
gpgcheck=1
gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch
enabled=0
autorefresh=1
type=rpm-md

EOF

cat /etc/yum.repos.d/elasticsearch.repo
```

#### 安装

```shell
yum install -y --enablerepo=elasticsearch elasticsearch
```

安装日志

```shell
[root@elasticsearch-1 ~]# yum install -y --enablerepo=elasticsearch elasticsearch
AnolisOS-23 - os                                                                                                                                  16 MB/s |  12 MB     00:00    
AnolisOS-23 - updates                                                                                                                            5.0 MB/s | 1.9 MB     00:00    
Elasticsearch repository for 7.x packages                                                                                                         15 MB/s |  54 MB     00:03    
Last metadata expiration check: 0:00:01 ago on Thu Oct 19 19:29:04 2023.
Dependencies resolved.
=================================================================================================================================================================================
Package                                      Architecture                          Version                                   Repository                                    Size
=================================================================================================================================================================================
Installing:
elasticsearch                                x86_64                                7.17.14-1                                 elasticsearch                                308 M

Transaction Summary
=================================================================================================================================================================================
Install  1 Package

Total download size: 308 M
Installed size: 515 M
Downloading Packages:
elasticsearch-7.17.14-x86_64.rpm                                                                                                                  13 MB/s | 308 MB     00:23
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Total                                                                                                                                             13 MB/s | 308 MB     00:23     
Running transaction check
Transaction check succeeded.
Running transaction test
Transaction test succeeded.
Running transaction
Preparing        :                                                                                                                                                         1/1
Running scriptlet: elasticsearch-7.17.14-1.x86_64                                                                                                                          1/1
Creating elasticsearch group... OK
Creating elasticsearch user... OK

Installing       : elasticsearch-7.17.14-1.x86_64                                                                                                                          1/1
Running scriptlet: elasticsearch-7.17.14-1.x86_64                                                                                                                          1/1
### NOT starting on installation, please execute the following statements to configure elasticsearch service to start automatically using systemd
sudo systemctl daemon-reload
sudo systemctl enable elasticsearch.service
### You can start elasticsearch service by executing
sudo systemctl start elasticsearch.service

Created elasticsearch keystore in /etc/elasticsearch/elasticsearch.keystore

/usr/lib/tmpfiles.d/elasticsearch.conf:1: Line references path below legacy directory /var/run/, updating /var/run/elasticsearch → /run/elasticsearch; please update the tmpfiles.d/ drop-in file accordingly.

Couldn't write '0' to 'kernel/yama/ptrace_scope', ignoring: No such file or directory

Verifying        : elasticsearch-7.17.14-1.x86_64                                                                                                                          1/1

Installed:
elasticsearch-7.17.14-1.x86_64

Complete!
[root@elasticsearch-1 ~]# 
```

## 启动

```shell
systemctl start elasticsearch
```

```shell
[root@elasticsearch-1 ~]# systemctl status elasticsearch
○ elasticsearch.service - Elasticsearch
     Loaded: loaded (/usr/lib/systemd/system/elasticsearch.service; disabled; preset: disabled)
     Active: inactive (dead)
       Docs: https://www.elastic.co
[root@elasticsearch-1 ~]# systemctl start elasticsearch
[root@elasticsearch-1 ~]# systemctl status elasticsearch --no-pager
● elasticsearch.service - Elasticsearch
     Loaded: loaded (/usr/lib/systemd/system/elasticsearch.service; disabled; preset: disabled)
     Active: active (running) since Thu 2023-10-19 19:32:40 CST; 1min 32s ago
       Docs: https://www.elastic.co
   Main PID: 1257 (java)
      Tasks: 64 (limit: 19155)
     Memory: 8.2G
        CPU: 46.856s
     CGroup: /system.slice/elasticsearch.service
             ├─1257 /usr/share/elasticsearch/jdk/bin/java -Xshare:auto -Des.networkaddress.cache.ttl=60 -Des.networkaddress.cache.negative.ttl=10 -XX:+AlwaysPreTouch -Xss1m -Dj…
             └─1442 /usr/share/elasticsearch/modules/x-pack-ml/platform/linux-x86_64/bin/controller

Oct 19 19:32:23 elasticsearch-1 systemd[1]: Starting elasticsearch.service - Elasticsearch...
Oct 19 19:32:26 elasticsearch-1 systemd-entrypoint[1257]: Oct 19, 2023 7:32:26 PM sun.util.locale.provider.LocaleProviderAdapter <clinit>
Oct 19 19:32:26 elasticsearch-1 systemd-entrypoint[1257]: WARNING: COMPAT locale provider will be removed in a future release
Oct 19 19:32:40 elasticsearch-1 systemd[1]: Started elasticsearch.service - Elasticsearch.
[root@elasticsearch-1 ~]#
```

## 设置开机自启

```shell
systemctl enable elasticsearch
```

```shell
[root@elasticsearch-1 ~]# systemctl enable elasticsearch
Synchronizing state of elasticsearch.service with SysV service script with /usr/lib/systemd/systemd-sysv-install.
Executing: /usr/lib/systemd/systemd-sysv-install enable elasticsearch
Created symlink /etc/systemd/system/multi-user.target.wants/elasticsearch.service → /usr/lib/systemd/system/elasticsearch.service.
[root@elasticsearch-1 ~]# systemctl is-enabled elasticsearch
enabled
[root@elasticsearch-1 ~]#
```

## 配置

### 初始化主节点

```shell
vim /etc/elasticsearch/elasticsearch.yml
```

```shell
cluster.initial_master_nodes: ["node-1", "node-2"]
```

```shell
systemctl status elasticsearch --no-pager
systemctl restart elasticsearch
systemctl status elasticsearch --no-pager
```

### 远程访问

```shell
vim /etc/elasticsearch/elasticsearch.yml
```

```shell
network.host: 0.0.0.0
```

```shell
systemctl status elasticsearch --no-pager
systemctl restart elasticsearch
systemctl status elasticsearch --no-pager
```

### 查看集群状态

```shell
curl 127.0.0.1:9200/_cat/health
```

```shell
[root@elasticsearch-1 ~]# curl 127.0.0.1:9200/_cat/health
1697716019 11:46:59 elasticsearch green 1 1 2 2 0 0 0 0 - 100.0%
[root@elasticsearch-1 ~]# 
```

### 开放端口，远程访问

```shell
firewall-cmd --zone=public --add-port=9200/tcp --permanent
firewall-cmd --reload
firewall-cmd --list-all
```

### 配置 Security（可选）

```shell
vim /etc/elasticsearch/elasticsearch.yml
```

```shell
xpack.security.enabled: true
xpack.security.transport.ssl.enabled: true
```

```shell
systemctl status elasticsearch --no-pager
systemctl restart elasticsearch
systemctl status elasticsearch --no-pager
```

```shell
/usr/share/elasticsearch/bin/elasticsearch-setup-passwords auto
```

请备份下列密码

```shell
[root@elasticsearch-1 ~]# /usr/share/elasticsearch/bin/elasticsearch-setup-passwords auto
Initiating the setup of passwords for reserved users elastic,apm_system,kibana,kibana_system,logstash_system,beats_system,remote_monitoring_user.
The passwords will be randomly generated and printed to the console.
Please confirm that you would like to continue [y/N]y


Changed password for user apm_system
PASSWORD apm_system = MNkjXibJ92WXmr38jfzW

Changed password for user kibana_system
PASSWORD kibana_system = ELxXSJsi4QSCFUXrwxZJ

Changed password for user kibana
PASSWORD kibana = ELxXSJsi4QSCFUXrwxZJ

Changed password for user logstash_system
PASSWORD logstash_system = QyM4zxLX4FmmQCfiE60z

Changed password for user beats_system
PASSWORD beats_system = yiv9zICLfFa2XGZCncZq

Changed password for user remote_monitoring_user
PASSWORD remote_monitoring_user = c4AllkznoQ5iSxggNVKy

Changed password for user elastic
PASSWORD elastic = DP2P6CtPbZWYaOoAZBin

[root@elasticsearch-1 ~]#
```
