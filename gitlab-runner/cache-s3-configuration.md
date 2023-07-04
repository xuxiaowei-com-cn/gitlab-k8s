# GitLab Runner Cache 配置 S3（MinIO）

1. 支持 MinIO
2. 支持 阿里云 OSS 对象储存
3. 支持 天翼云 OOS 对象储存

## 说明

1. 本文使用 Docker 安装 MinIO。
2. 本文配置 GitLab Runner 的缓存类型为 s3，使用的软件是 `MinIO`、`阿里云 OSS 对象储存`、`天翼云 OOS 对象储存`。
3. 本文的目的是在 GitLab Runner 执行完成时，通过配置流水线中的缓存，将 Maven依赖、Node依赖等，上传到 minio中，在下次执行流水线时，GitLab
   Runner 会自动下载上次缓存的文件并解压，提高流水线构建的速度。
4. [使用 MinIO](https://docs.gitlab.cn/runner/configuration/speed_up_job_execution.html#%E4%BD%BF%E7%94%A8-minio)
5. [分布式 Runner 缓存](https://docs.gitlab.cn/runner/configuration/autoscale.html#distributed-runners-caching)
6. GitLab Runner 高级配置
    1. [极狐 GitLab 中文文档](https://docs.gitlab.cn/runner/configuration/advanced-configuration.html)
    2. [gitlab-ee](https://docs.gitlab.com/runner/configuration/advanced-configuration.html)

## 安装 minio

1. 创建 minio 容器
   9000端口：上传下载文件的端口
   9001端口：后台管理页面端口
   /minio/data：储存文件的目录
   ```shell
   docker run \
   -itd \
   --restart always \
   --privileged=true \
   -p 9000:9000 \
   -p 9001:9001 \
   --name minio1 \
   -v /minio/data:/data \
   quay.io/minio/minio server /data --console-address ":9001"
   ```
   ```shell
   firewall-cmd --zone=public --add-port=9000/tcp --permanent
   firewall-cmd --zone=public --add-port=9001/tcp --permanent
   firewall-cmd --reload
   firewall-cmd --list-all
   ```

2. 默认用户名：minioadmin，默认密码：minioadmin
3. 创建一个**Buckets**，用于储存 GitLab Runner 的缓存，名称为：**bucket-1**
4. 创建一个**Access Keys**，作为 GitLab Runner 上传、下载缓存的凭证。
5. 设置 GitLab Runner 的缓存配置，配置修改完成后启动的流水线会立即生效

    1. MinIO 配置（支持）

        ```shell
          [runners.cache]
            # 激活缓存的类型为：s3
            Type = "s3"
            # 是否共享缓存
            Shared = false
            [runners.cache.s3]
                # 缓存服务器的地址+端口
              ServerAddress = "192.168.80.14:9000"
              # Access Keys 账户凭证
                    AccessKey = "hCfpQlQuEXtBYEAw"
              SecretKey = "kHH5RwzCRiRUtujKlNRZZZFpuANm6Yr1"
                # 创建的 Buckets 名称
              BucketName = "bucket-1"
                # 设置为 true 代表不使用 https
              Insecure = true
        ```

    2. 阿里云 OSS 对象储存配置（支持）

       ```shell
         [runners.cache]
           # 激活缓存的类型为：s3
           Type = "s3"
           # 是否共享缓存
           Shared = false
           [runners.cache.s3]
             # 缓存服务器的地址+端口
             # 此处以青岛地区为例，这里不填写协议
             ServerAddress = "oss-cn-qingdao.aliyuncs.com"
             # Access Keys 账户凭证
                   AccessKey = ""
             SecretKey = ""
               # 创建的 Buckets 名称
             BucketName = ""
               # 设置为 false 代表使用 https
             Insecure = false
       ```

    3. 天翼云 OOS 对象储存配置

       使用的是：经典版对象存储（经典版）-经典Ⅰ型

       ```shell
         [runners.cache]
           # 激活缓存的类型为：s3
           Type = "s3"
           # 是否共享缓存
           Shared = false
           [runners.cache.s3]
             # 缓存服务器的地址+端口
             # 此处以青岛地区为例，这里不填写协议
             ServerAddress = "oos-sdqd.ctyunapi.cn"
             # Access Keys 账户凭证
                   AccessKey = ""
             SecretKey = ""
               # 创建的 Buckets 名称
             BucketName = ""
               # 设置为 false 代表使用 https
             Insecure = false
             # 填写区域，不填写无法使用
             # 此处以山东青岛地区为例
             BucketLocation = "sdqd"
       ```

6. 如果未配置流水线缓存，在流水线执行时，会出现如下日志

    ```shell
    No URL provided, cache will not be downloaded from shared cache server. Instead a local version of cache will be extracted. 
    ```

    ```shell
    No URL provided, cache will not be uploaded to shared cache server. Cache will be stored only locally. 
    ```

7. 流水线正确设置后，在流水线执行时，会出现如下日志

    ```shell
    # 首次设置成功后执行，会出现下列日志，不过不用担心，本次执行成功上传依赖完成后，下次就不会出现了
    # 若缓存文件被删除，也会出现此日志
    WARNING: file does not exist                       
    Failed to extract cache
    ```

    ```shell
    Downloading cache.zip from http://192.168.80.14:9000/bucket-1/runner/HcQesvsi/project/2/default-protected 
    Successfully extracted cache
    ```

    ```shell
    Uploading cache.zip to http://192.168.80.14:9000/bucket-1/runner/HcQesvsi/project/2/default-protected 
    ```

8. 若要禁用缓存，只需要将 **Type = "s3"** 禁用即可
