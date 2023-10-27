---
sidebar_position: 501
---

# gitlab 启用 自动备份功能

1. 启用 gitlab 自动备份功能
2. 测试 gitlab 手动备份功能
3. 自定义 gitlab 使用的 MinIO 域名解析

## 文档

- [Toolbox](https://docs.gitlab.cn/charts/charts/gitlab/toolbox/index.html)
- [备份和还原极狐GitLab 实例](https://docs.gitlab.cn/charts/backup-restore/)
- [备份极狐GitLab 安装实例](https://docs.gitlab.cn/charts/backup-restore/backup.html)
- [恢复极狐GitLab 安装实例](https://docs.gitlab.cn/charts/backup-restore/restore.html)

## 查看现有备份

```shell
kubectl -n gitlab-test get cronjobs.batch
```

```shell
# 默认没有开启
[root@k8s ~]# kubectl -n gitlab-test get cronjobs.batch
No resources found in gitlab-test namespace.
[root@k8s ~]# 
```

## 开启自动备份功能

```shell
# 将已配置的值导出到文件中
helm -n gitlab-test get values my-gitlab > my-gitlab.yaml

# 开启备份功能
# gitlab.toolbox.backups.cron.enabled：是否开启备份功能
# gitlab.toolbox.backups.cron.schedule：备份的计划，每天的 1:00（UTC） 备份
# -f gitlab-helm.yaml：指定已配置的值
helm upgrade -n gitlab-test --install my-gitlab gitlab/gitlab \
  --set gitlab.toolbox.backups.cron.enabled=true \
  --set gitlab.toolbox.backups.cron.schedule="0 1 * * *" \
  -f my-gitlab.yaml \
  --timeout 600s
```

```shell
# 等待时间到了，就能自动备份了
[root@k8s ~]# kubectl -n gitlab-test get cronjobs.batch
NAME                       SCHEDULE    SUSPEND   ACTIVE   LAST SCHEDULE   AGE
my-gitlab-toolbox-backup   0 1 * * *   False     0        <none>          11s
[root@k8s ~]# 
```

## 创建手动备份

```shell
# -n gitlab-test：指定命名空间
# --from=cronjob/my-gitlab-toolbox-backup：指定 cronjob 名称，其中 gitlab-test 是安装时设置 gitlab 的名称
# manual-backup-1：手动备份名称，名称不可以重复
kubectl -n gitlab-test create job --from=cronjob/my-gitlab-toolbox-backup manual-backup-1
```

## 查看备份

```shell
kubectl -n gitlab-test get jobs.batch
```

## 搜索手动备份的job的pod

```shell
kubectl -n gitlab-test get pod | grep manual-backup-1
```

```shell
# Running：代表正在运行
# Completed：代表执行完成
[root@k8s ~]# kubectl -n gitlab-test get pod | grep manual-backup-1
manual-backup-1-r7qlj                                1/1     Running     0                15s
[root@k8s ~]#
```

## 查看手动备份的job的pod日志

```shell
kubectl -n gitlab-test logs -f manual-backup-1-r7qlj
```

## 无法解析域名异常处理

```shell
# 无法解析域名异常
Packing up backup tar
ERROR: [Errno -5] No address associated with hostname
ERROR: Connection Error: Error resolving a server hostname.
Please check the servers address specified in 'host_base', 'host_bucket', 'cloudfront_host', 'website_endpoint'
```

```shell
# 无法解析域名异常
Packing up backup tar
WARNING: Retrying failed request: /1698382139_2023_10_27_16.4.1-ee_gitlab_backup.tar ([Errno -2] Name or service not known)
WARNING: Waiting 3 sec...
WARNING: Retrying failed request: /1698382139_2023_10_27_16.4.1-ee_gitlab_backup.tar ([Errno -2] Name or service not known)
WARNING: Waiting 6 sec...
WARNING: Retrying failed request: /1698382139_2023_10_27_16.4.1-ee_gitlab_backup.tar ([Errno -2] Name or service not known)
WARNING: Waiting 9 sec...
WARNING: Retrying failed request: /1698382139_2023_10_27_16.4.1-ee_gitlab_backup.tar ([Errno -2] Name or service not known)
WARNING: Waiting 12 sec...
WARNING: Retrying failed request: /1698382139_2023_10_27_16.4.1-ee_gitlab_backup.tar ([Errno -2] Name or service not known)
WARNING: Waiting 15 sec...
ERROR: Upload of '/srv/gitlab/tmp/backup_tars/1698382139_2023_10_27_16.4.1-ee_gitlab_backup.tar' failed too many times (Last reason: Upload failed for: /1698382139_2023_10_27_16.4.1-ee_gitlab_backup.tar)
```

修改 定时任务

```shell
kubectl -n gitlab-test edit cronjobs.batch my-gitlab-toolbox-backup
```

增加 域名解析

```yaml
          # 增加自定义域名解析，放在 dnsPolicy 后面
          hostAliases:
            - hostnames:
                - minio.test.helm.xuxiaowei.cn
              ip: 192.168.80.3
```

- <strong><font color="red">删除手动备份 job（若已完成备份，则备份数据已上传至 minio 存储，此处不会删除备份数据），重新创建手动备份
  job，即可使用自定义域名解析了</font></strong>

```shell
kubectl -n gitlab-test delete job manual-backup-1
```

## 证书验证异常

- gitlab 备份到 MinIO 时证书验证失败解决方案：[gitlab 备份 信任域名证书](gitlab-backup-trust-ssl.md)

```shell
WARNING: Retrying failed request: /1698383376_2023_10_27_16.4.1-ee_gitlab_backup.tar ([SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1129))
WARNING: Waiting 3 sec...
WARNING: Retrying failed request: /1698383376_2023_10_27_16.4.1-ee_gitlab_backup.tar ([SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1129))
WARNING: Waiting 6 sec...
WARNING: Retrying failed request: /1698383376_2023_10_27_16.4.1-ee_gitlab_backup.tar ([SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1129))
WARNING: Waiting 9 sec...
WARNING: Retrying failed request: /1698383376_2023_10_27_16.4.1-ee_gitlab_backup.tar ([SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1129))
WARNING: Waiting 12 sec...
WARNING: Retrying failed request: /1698383376_2023_10_27_16.4.1-ee_gitlab_backup.tar ([SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1129))
WARNING: Waiting 15 sec...
ERROR: Upload of '/srv/gitlab/tmp/backup_tars/1698383376_2023_10_27_16.4.1-ee_gitlab_backup.tar' failed too many times (Last reason: Upload failed for: /1698383376_2023_10_27_16.4.1-ee_gitlab_backup.tar)
```
