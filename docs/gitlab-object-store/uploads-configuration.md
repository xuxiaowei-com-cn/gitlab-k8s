---
sidebar_position: 3
---

# uploads

GitLab uploads 使用对象储存 S3（MinIO）

## 文档

1. 上传文件管理
    1. [gitlab-jh 中文文档](https://docs.gitlab.cn/jh/administration/uploads.html)
    2. [gitlab-ee](https://docs.gitlab.com/ee/administration/uploads.html)
2. 上传文件迁移 Rake 任务
    1. [gitlab-jh 中文文档](https://docs.gitlab.cn/jh/administration/raketasks/uploads/migrate.html)
    2. [gitlab-ee](https://docs.gitlab.com/ee/administration/raketasks/uploads/migrate.html)

## 说明

1. GitLab 使用的版本是 15.11.2
2. S3 对象储存使用的是 MinIO

## 配置

1. 配置前准备

   |                   | 示例                                                    | 说明                     |
   |-------------------|-------------------------------------------------------|------------------------|
   | bucket_name       | gitlab-uploads                                        | Buckets 名称，单独一个        |
   | access_key_id     | gitlab-access-id-xxx                                  | 秘钥ID                   |
   | secret_access_key | gitlab-secret-key-xxx                                 | 秘钥凭证                   |
   | endpoint          | [http://192.168.80.4:9000](http://192.168.80.4:9000/) | MinIO（S3）API 地址（非网页地址） |

2. 修改配置

   ```shell
   vim /etc/gitlab/gitlab.rb
   ```

   找到 gitlab_rails['uploads_object_store_enabled'] 附近，修改为下列示例

   ```shell
   # gitlab_rails['uploads_directory'] = "/var/opt/gitlab/gitlab-rails/uploads"
   # gitlab_rails['uploads_storage_path'] = "/opt/gitlab/embedded/service/gitlab-rails/public"
   # gitlab_rails['uploads_base_dir'] = "uploads/-/system"
   
   # 上传文件开启对象存储
   gitlab_rails['uploads_object_store_enabled'] = true
   
   # 代理访问（隐藏 S3 地址）
   gitlab_rails['uploads_object_store_proxy_download'] = true
   
   # 对象储存保存的 bucket_name
   gitlab_rails['uploads_object_store_remote_directory'] = "gitlab-uploads"
   gitlab_rails['uploads_object_store_connection'] = {
     # MinIO（S3）无需修改
     'provider' => 'AWS',
     # MinIO（S3）无需修改
     'region' => 'eu-west-1',
     # MinIO（S3）凭证ID
     'aws_access_key_id' => 'gitlab-access-id-xxx',
     # MinIO（S3）凭证秘钥
     'aws_secret_access_key' => 'gitlab-secret-key-xxx',
     # MinIO（S3）API 地址（非网页地址）
     # 其中 192.168.80.4:9000 就是 URL 拼接的 host
     'endpoint' => 'http://192.168.80.4:9000',
     # URL 拼接方式
     # true：host/bucket_name/object，如：http://192.168.80.4:9000/gitlab-uploads/object
     # false：bucket_name.host/object，如：http://gitlab-uploads.192.168.80.4:9000/object
     'path_style' => true
   }
   ```

3. 重新配置

   ```shell
   sudo gitlab-ctl reconfigure
   ```

4. 上传文件测试：新建一个议题，上传一个文件
    1. 查看是否上传成功
    2. 查看对象储存中是否存新增了这个文件
5. 迁移历史文件（可选）

   ```shell
   # 将本地的文件迁移到 S3 中
   sudo gitlab-rake "gitlab:uploads:migrate:all"
   
   # 将 S3 中的文件迁移到本地文件中
   # sudo gitlab-rake "gitlab:uploads:migrate_to_local:all"
   ```
