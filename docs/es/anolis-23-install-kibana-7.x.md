---
sidebar_position: 3
---

# Anolis 23 中安装 Kibana 7.x

## 文档

1. https://www.elastic.co/cn/downloads/kibana
2. https://www.elastic.co/guide/en/kibana/7.17/rpm.html#rpm-repo

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

#### 安装

```shell
yum install -y kibana
```

安装日志

```shell
[root@elasticsearch-1 ~]# yum install -y kibana
Kibana repository for 7.x packages                                                                                                                15 MB/s |  54 MB     00:03    
Last metadata expiration check: 0:00:15 ago on Thu Oct 19 20:03:35 2023.
Dependencies resolved.
=================================================================================================================================================================================
 Package                                 Architecture                            Version                                       Repository                                   Size
=================================================================================================================================================================================
Installing:
 kibana                                  x86_64                                  7.17.14-1                                     kibana-7.x                                  286 M

Transaction Summary
=================================================================================================================================================================================
Install  1 Package

Total download size: 286 M
Installed size: 733 M
Downloading Packages:
kibana-7.17.14-x86_64.rpm                                                                                                                         12 MB/s | 286 MB     00:23    
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Total                                                                                                                                             12 MB/s | 286 MB     00:23     
Running transaction check
Transaction check succeeded.
Running transaction test
Transaction test succeeded.
Running transaction
  Preparing        :                                                                                                                                                         1/1 
  Running scriptlet: kibana-7.17.14-1.x86_64                                                                                                                                 1/1 
  Installing       : kibana-7.17.14-1.x86_64                                                                                                                                 1/1 
  Running scriptlet: kibana-7.17.14-1.x86_64                                                                                                                                 1/1 
Creating kibana group... OK
Creating kibana user... OK

Kibana is currently running with legacy OpenSSL providers enabled! For details and instructions on how to disable see https://www.elastic.co/guide/en/kibana/7.17/production.html#openssl-legacy-provider
Created Kibana keystore in /etc/kibana/kibana.keystore

/usr/lib/tmpfiles.d/elasticsearch.conf:1: Line references path below legacy directory /var/run/, updating /var/run/elasticsearch → /run/elasticsearch; please update the tmpfiles.d/ drop-in file accordingly.

  Verifying        : kibana-7.17.14-1.x86_64                                                                                                                                 1/1 

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
[root@elasticsearch-1 ~]# systemctl status kibana.service 
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

### 浏览器访问

- http://ip:5601
