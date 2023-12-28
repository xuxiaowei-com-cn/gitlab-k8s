---
sidebar_position: 502
---

# GitLab 备份 信任域名证书

备份数据时，信任 MinIO 域名证书

## 文档

1. s3cmd
    1. [github](https://github.com/s3tools/s3cmd)
    2. [def main()](https://github.com/s3tools/s3cmd/blob/master/s3cmd)

## 问题

1. 参见：[gitlab 启用 自动备份功能](gitlab-backups.md)

## 配置

### 查看现有备份

```shell
kubectl -n gitlab-test get cronjobs.batch
```

```shell
[root@anolis-7-9 ~]# kubectl -n gitlab-test get cronjobs.batch
NAME                       SCHEDULE    SUSPEND   ACTIVE   LAST SCHEDULE   AGE
my-gitlab-toolbox-backup   0 1 * * *   False     0        <none>          41m
[root@anolis-7-9 ~]# 
```

### 修改配置，跳过证书验证

```shell
kubectl -n gitlab-test edit cronjobs.batch my-gitlab-toolbox-backup
```

原始配置

```yaml
        spec:
          containers:
            - args:
                - /bin/bash
                - -c
                - cp /etc/gitlab/.s3cfg $HOME/.s3cfg && backup-utility
```

修改后

```yaml
        spec:
          containers:
            - args:
                - /bin/bash
                - -c
                - cp /etc/gitlab/.s3cfg $HOME/.s3cfg && echo "check_ssl_certificate=false" >> $HOME/.s3cfg && backup-utility
```

### 重新执行备份程序

查看日志

```shell
[root@anolis-7-9 ~]# kubectl -n gitlab-test logs -f manual-backup-1-9db78
Defaulted container "toolbox-backup" out of: toolbox-backup, certificates (init), configure (init)
Begin parsing .erb templates from /var/opt/gitlab/templates
Writing /srv/gitlab/config/cable.yml
Writing /srv/gitlab/config/database.yml
Writing /srv/gitlab/config/gitlab.yml
Writing /srv/gitlab/config/resque.yml
Begin parsing .tpl templates from /var/opt/gitlab/templates
Copying other config files found in /var/opt/gitlab/templates to /srv/gitlab/config
Copying smtp_settings.rb into /srv/gitlab/config
Attempting to run '/bin/bash -c cp /etc/gitlab/.s3cfg $HOME/.s3cfg && echo "check_ssl_certificate=false" >> $HOME/.s3cfg && backup-utility' as a main process
2023-12-25 14:17:05 +0800 -- Dumping database ...
pg_dump: warning: could not find where to insert IF EXISTS in statement "-- *not* dropping schema, since initdb creates it
"
Dumping PostgreSQL database gitlabhq_production ... [DONE]
2023-12-25 14:17:07 +0800 -- Dumping database ... done
2023-12-25 14:17:07 +0800 -- Deleting backup and restore PID file ... done
2023-12-25 14:17:32 +0800 -- Dumping repositories ...
{"command":"create","gl_project_path":"xuxiaowei-com-cn.wiki","level":"info","msg":"started create","pid":59,"relative_path":"@groups/19/58/19581e27de7ced00ff1ce50b2047e7a567c76b1cbaebabe5ef03f7c3017bb5b7.wiki.git","storage_name":"default","time":"2023-12-25T06:17:32.808Z"}
{"command":"create","gl_project_path":"xuxiaowei-com-cn.wiki","level":"warning","msg":"skipped create","pid":59,"relative_path":"@groups/19/58/19581e27de7ced00ff1ce50b2047e7a567c76b1cbaebabe5ef03f7c3017bb5b7.wiki.git","storage_name":"default","time":"2023-12-25T06:17:32.814Z"}
{"command":"create","gl_project_path":"xuxiaowei/sleep","level":"info","msg":"started create","pid":59,"relative_path":"@hashed/6b/86/6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b.git","storage_name":"default","time":"2023-12-25T06:17:32.929Z"}
{"command":"create","gl_project_path":"xuxiaowei/sleep.wiki","level":"info","msg":"started create","pid":59,"relative_path":"@hashed/6b/86/6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b.wiki.git","storage_name":"default","time":"2023-12-25T06:17:32.934Z"}
{"command":"create","gl_project_path":"xuxiaowei/sleep.wiki","level":"info","msg":"completed create","pid":59,"relative_path":"@hashed/6b/86/6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b.wiki.git","storage_name":"default","time":"2023-12-25T06:17:32.945Z"}
{"command":"create","gl_project_path":"xuxiaowei/cache","level":"info","msg":"started create","pid":59,"relative_path":"@hashed/d4/73/d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35.git","storage_name":"default","time":"2023-12-25T06:17:32.945Z"}
{"command":"create","gl_project_path":"xuxiaowei/sleep","level":"info","msg":"completed create","pid":59,"relative_path":"@hashed/6b/86/6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b.git","storage_name":"default","time":"2023-12-25T06:17:32.950Z"}
{"command":"create","gl_project_path":"xuxiaowei/cache.wiki","level":"info","msg":"started create","pid":59,"relative_path":"@hashed/d4/73/d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35.wiki.git","storage_name":"default","time":"2023-12-25T06:17:32.950Z"}
{"command":"create","gl_project_path":"xuxiaowei/cache.wiki","level":"info","msg":"completed create","pid":59,"relative_path":"@hashed/d4/73/d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35.wiki.git","storage_name":"default","time":"2023-12-25T06:17:32.960Z"}
{"command":"create","gl_project_path":"xuxiaowei/output-limit","level":"info","msg":"started create","pid":59,"relative_path":"@hashed/4e/07/4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce.git","storage_name":"default","time":"2023-12-25T06:17:32.960Z"}
{"command":"create","gl_project_path":"xuxiaowei/cache","level":"info","msg":"completed create","pid":59,"relative_path":"@hashed/d4/73/d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35.git","storage_name":"default","time":"2023-12-25T06:17:32.969Z"}
{"command":"create","gl_project_path":"xuxiaowei/output-limit.wiki","level":"info","msg":"started create","pid":59,"relative_path":"@hashed/4e/07/4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce.wiki.git","storage_name":"default","time":"2023-12-25T06:17:32.969Z"}
{"command":"create","gl_project_path":"xuxiaowei/output-limit.wiki","level":"info","msg":"completed create","pid":59,"relative_path":"@hashed/4e/07/4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce.wiki.git","storage_name":"default","time":"2023-12-25T06:17:32.987Z"}
{"command":"create","gl_project_path":"xuxiaowei/docker","level":"info","msg":"started create","pid":59,"relative_path":"@hashed/4b/22/4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a.git","storage_name":"default","time":"2023-12-25T06:17:32.987Z"}
{"command":"create","gl_project_path":"xuxiaowei/output-limit","level":"info","msg":"completed create","pid":59,"relative_path":"@hashed/4e/07/4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce.git","storage_name":"default","time":"2023-12-25T06:17:32.988Z"}
{"command":"create","gl_project_path":"xuxiaowei/docker.wiki","level":"info","msg":"started create","pid":59,"relative_path":"@hashed/4b/22/4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a.wiki.git","storage_name":"default","time":"2023-12-25T06:17:32.988Z"}
{"command":"create","gl_project_path":"xuxiaowei/docker.wiki","level":"info","msg":"completed create","pid":59,"relative_path":"@hashed/4b/22/4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a.wiki.git","storage_name":"default","time":"2023-12-25T06:17:33.004Z"}
{"command":"create","gl_project_path":"xuxiaowei/my-vue-app","level":"info","msg":"started create","pid":59,"relative_path":"@hashed/ef/2d/ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d.git","storage_name":"default","time":"2023-12-25T06:17:33.004Z"}
{"command":"create","gl_project_path":"xuxiaowei/my-vue-app","level":"info","msg":"completed create","pid":59,"relative_path":"@hashed/ef/2d/ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d.git","storage_name":"default","time":"2023-12-25T06:17:33.034Z"}
{"command":"create","gl_project_path":"xuxiaowei/my-vue-app.wiki","level":"info","msg":"started create","pid":59,"relative_path":"@hashed/ef/2d/ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d.wiki.git","storage_name":"default","time":"2023-12-25T06:17:33.034Z"}
{"command":"create","gl_project_path":"xuxiaowei/docker","level":"info","msg":"completed create","pid":59,"relative_path":"@hashed/4b/22/4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a.git","storage_name":"default","time":"2023-12-25T06:17:33.049Z"}
{"command":"create","gl_project_path":"xuxiaowei/my-maven-app","level":"info","msg":"started create","pid":59,"relative_path":"@hashed/e7/f6/e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683.git","storage_name":"default","time":"2023-12-25T06:17:33.049Z"}
{"command":"create","gl_project_path":"xuxiaowei/my-vue-app.wiki","level":"info","msg":"completed create","pid":59,"relative_path":"@hashed/ef/2d/ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d.wiki.git","storage_name":"default","time":"2023-12-25T06:17:33.049Z"}
{"command":"create","gl_project_path":"xuxiaowei/my-maven-app.wiki","level":"info","msg":"started create","pid":59,"relative_path":"@hashed/e7/f6/e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683.wiki.git","storage_name":"default","time":"2023-12-25T06:17:33.049Z"}
{"command":"create","gl_project_path":"xuxiaowei/my-maven-app.wiki","level":"info","msg":"completed create","pid":59,"relative_path":"@hashed/e7/f6/e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683.wiki.git","storage_name":"default","time":"2023-12-25T06:17:33.061Z"}
{"command":"create","gl_project_path":"xuxiaowei/my-maven-app","level":"info","msg":"completed create","pid":59,"relative_path":"@hashed/e7/f6/e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683.git","storage_name":"default","time":"2023-12-25T06:17:33.087Z"}
2023-12-25 14:17:33 +0800 -- Dumping repositories ... done
2023-12-25 14:17:33 +0800 -- Deleting backup and restore PID file ... done
Dumping registry ...
empty
Dumping uploads ...
empty
Dumping artifacts ...
done
Dumping lfs ...
empty
Dumping packages ...
done
Dumping external_diffs ...
empty
Dumping terraform_state ...
empty
Dumping pages ...
done
Dumping ci_secure_files ...
empty
Packing up backup tar
[DONE] Backup can be found at s3://gitlab-backups/1703484999_2023_12_25_16.7.0-ee_gitlab_backup.tar
[root@anolis-7-9 ~]# 
```
