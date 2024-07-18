---
sidebar_position: 2
---

# pages

GitLab pages（静态页面相关文件）使用对象储存 S3（MinIO）

## 文档

1. GitLab Pages 管理
    1. [gitlab-jh 中文文档](https://docs.gitlab.cn/jh/administration/pages/index.html)
    2. [gitlab-ee](https://docs.gitlab.com/ee/administration/pages/index.html)
2. s3-兼容的连接设置
    1. [gitlab-jh 中文文档](https://docs.gitlab.cn/jh/administration/pages/index.html#s3-%E5%85%BC%E5%AE%B9%E7%9A%84%E8%BF%9E%E6%8E%A5%E8%AE%BE%E7%BD%AE)
    2. [gitlab-ee](https://docs.gitlab.com/ee/administration/pages/index.html#s3-compatible-connection-settings)
3. 将 Pages 部署迁移到对象存储
    1. [gitlab-jh 中文文档](https://docs.gitlab.cn/jh/administration/pages/index.html#%E5%B0%86-pages-%E9%83%A8%E7%BD%B2%E8%BF%81%E7%A7%BB%E5%88%B0%E5%AF%B9%E8%B1%A1%E5%AD%98%E5%82%A8)
    2. [gitlab-ee](https://docs.gitlab.com/ee/administration/pages/index.html#migrate-pages-deployments-to-object-storage)

## 说明

1. GitLab 使用的版本是 15.11.2
2. S3 对象储存使用的是 MinIO
3. 示例项目：[my-vue-app](https://framagit.org/xuxiaowei-com-cn/my-vue-app)

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

   找到 gitlab_rails['pages_object_store_enabled'] 附近，修改为下列示例

   ```shell
   # gitlab_rails['pages_local_store_enabled'] = true
   # gitlab_rails['pages_local_store_path'] = "/var/opt/gitlab/gitlab-rails/shared/pages"
   
   gitlab_rails['pages_object_store_enabled'] = true
   gitlab_rails['pages_object_store_remote_directory'] = "gitlab-pages"
   gitlab_rails['pages_object_store_connection'] = {
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
     # true：host/bucket_name/object，如：http://192.168.80.4:9000/gitlab-pages/object
     # false：bucket_name.host/object，如：http://gitlab-pages.192.168.80.4:9000/object
     'path_style' => true
   }
   ```

3. 重新配置

   ```shell
   sudo gitlab-ctl reconfigure
   ```

4. 执行 Pages 流水线并上传产物文件测试
    1. 查看是否上传成功
    2. 查看对象储存中是否存新增了 Pages 流水线这个产物文件
5. 迁移历史文件（可选）

   ```shell
   # 将本地的文件迁移到 S3 中
   sudo gitlab-rake gitlab:pages:deployments:migrate_to_object_storage
   
   # 将 S3 中的文件迁移到本地文件中
   # sudo gitlab-rake gitlab:pages:deployments:migrate_to_local
   ```
