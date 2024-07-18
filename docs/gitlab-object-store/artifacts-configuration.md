---
sidebar_position: 1
---

# artifacts

GitLab artifacts（流水线产物）使用对象储存 S3（MinIO）

## 文档

1. 作业产物管理
    1. [gitlab-jh 中文文档](https://docs.gitlab.cn/jh/administration/job_artifacts.html)
    2. [gitlab-ee](https://docs.gitlab.com/ee/administration/job_artifacts.html)
2. 作业产物迁移 Rake 任务
    1. [gitlab-jh 中文文档](https://docs.gitlab.cn/jh/administration/job_artifacts.html#%E8%BF%81%E7%A7%BB%E5%88%B0%E5%AF%B9%E8%B1%A1%E5%AD%98%E5%82%A8)
    2. [gitlab-ee](https://docs.gitlab.com/ee/administration/job_artifacts.html#migrating-to-object-storage)

## 说明

1. GitLab 使用的版本是 16.0.4
2. S3 对象储存使用的是 MinIO
3.

示例项目：[my-vue-app](https://framagit.org/xuxiaowei-com-cn/my-vue-app)

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

   找到 gitlab_rails['artifacts_object_store_enabled'] 附近，修改为下列示例

   ```shell
   # gitlab_rails['artifacts_enabled'] = true
   # gitlab_rails['artifacts_path'] = "/var/opt/gitlab/gitlab-rails/shared/artifacts"
   
   # 上传 artifacts 开启对象存储
   gitlab_rails['artifacts_object_store_enabled'] = true
   
   # 代理访问（隐藏 S3 地址）
   gitlab_rails['artifacts_object_store_proxy_download'] = true
   
   # 对象储存保存的 bucket_name
   gitlab_rails['artifacts_object_store_remote_directory'] = "gitlab-artifacts"
   gitlab_rails['artifacts_object_store_connection'] = {
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
     # true：host/bucket_name/object，如：http://192.168.80.4:9000/gitlab-artifacts/object
     # false：bucket_name.host/object，如：http://gitlab-artifacts.192.168.80.4:9000/object
     'path_style' => true
   }
   ```

3. 重新配置

   ```shell
   sudo gitlab-ctl reconfigure
   ```

4. 执行流水线并上传产物文件测试
    1. 查看是否上传成功
    2. 查看对象储存中是否存新增了这个产物文件
5. 迁移历史文件（可选）

   ```shell
   # 将本地的文件迁移到 S3 中
   sudo gitlab-rake gitlab:artifacts:migrate
   
   # 将 S3 中的文件迁移到本地文件中
   # 
   ```
