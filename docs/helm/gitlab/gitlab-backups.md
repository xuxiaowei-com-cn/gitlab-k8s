---
sidebar_position: 501
---

# gitlab 启用 备份功能（未完成）

## 手动备份

- 查看现有备份

```shell
kubectl -n gitlab-test get cronjobs.batch
```

```shell
[root@k8s-control-plane-1 ~]# kubectl -n gitlab-test get cronjobs.batch
NAME                         SCHEDULE       SUSPEND   ACTIVE   LAST SCHEDULE   AGE
my-gitlab-toolbox-backup     0 1,11 * * *   False     0        <none>          43m
[root@k8s-control-plane-1 ~]# 
```

- 创建手动备份

```shell
# -n gitlab-test：指定命名空间
# --from=cronjob/my-gitlab-toolbox-backup：指定 cronjob 名称，其中 gitlab-test 是安装时设置 gitlab 的名称
# manual-backup-1：手动备份名称，名称不可以重复
kubectl -n gitlab-test create job --from=cronjob/my-gitlab-toolbox-backup manual-backup-1
```

- 查看手动备份

```shell
kubectl -n gitlab-test get jobs.batch
```

- 搜索手动备份的job的pod

```shell
kubectl -n gitlab-test get pod | grep manual-backup-1
```

```shell
# Running：代表正在运行
# Completed：代表执行完成
[root@k8s-control-plane-1 ~]# kubectl -n gitlab-test get pod | grep manual-backup-1
manual-backup-1-s6tll                                  1/1     Running     3 (44s ago)      6m30s
[root@k8s-control-plane-1 ~]#
```

- 查看手动备份的job的pod日志

```shell
kubectl -n gitlab-test logs -f manual-backup-1-s6tll
```

- 无法解析域名异常处理

```shell
Packing up backup tar
ERROR: [Errno -5] No address associated with hostname
ERROR: Connection Error: Error resolving a server hostname.
Please check the servers address specified in 'host_base', 'host_bucket', 'cloudfront_host', 'website_endpoint'
[root@k8s-control-plane-1 ~]#
```

修改 定时任务

```shell
kubectl -n gitlab-test edit cronjobs.batch my-gitlab-toolbox-backup
```

增加 域名解析

```yaml
          # 增加域名解析，放在 dnsPolicy 后面
          hostAliases:
            - hostnames:
                - minio.helm.xuxiaowei.cn
              ip: 172.25.25.220
```

- 删除手动备份 job（若已完成备份，则备份数据已上传至 minio 存储，此处不会删除备份数据）

```shell
kubectl -n gitlab-test delete job manual-backup-1
```

## 自动备份
