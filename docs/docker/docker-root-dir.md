---
sidebar_position: 2
---

# Docker 自定义数据储存路径

将 docker 配置、数据储存在 /data/docker 文件夹中

## 配置 Docker

1. 查看数据储存路径（第一次）

    ```shell
    docker info | grep "Docker Root Dir"
    ```

   结果示例

    ```shell
    [root@localhost ~]# docker info | grep "Docker Root Dir"
    Docker Root Dir: /var/lib/docker
    [root@localhost ~]#
    ```

2. 停止 docker

    ```shell
    systemctl stop docker.socket
    systemctl stop docker.service
    ```

3. 修改为 `/data/docker`

    ```shell
    vim /etc/docker/daemon.json
    ```

   在 `/etc/docker/daemon.json` 文件中新增 `graph`

    ```shell
    {
        "graph": "/data/docker"
    }
    ```
4. 创建 `/data/docker` 文件夹

    ```shell
    mkdir -p /data/docker
    ```

5. 查看文件夹结构（第一次）

    1. 查看 `/var/lib/docker/`

         ```shell
         ll /var/lib/docker/
         ```

       结果示例

        ```shell
        [root@localhost ~]# ll /var/lib/docker/
        total 4
        drwx--x--x 4 root root 138 Aug  8 08:36 buildkit
        drwx--x--- 2 root root   6 Aug  8 08:36 containers
        -rw------- 1 root root  36 Aug  8 08:36 engine-id
        drwx------ 3 root root  22 Aug  8 08:36 image
        drwxr-x--- 3 root root  19 Aug  8 08:36 network
        drwx--x--- 3 root root  40 Aug  8 08:36 overlay2
        drwx------ 4 root root  32 Aug  8 08:36 plugins
        drwx------ 2 root root   6 Aug  8 08:36 runtimes
        drwx------ 2 root root   6 Aug  8 08:36 swarm
        drwx------ 2 root root   6 Aug  8 08:36 tmp
        drwx-----x 2 root root  50 Aug  8 08:36 volumes
        [root@localhost ~]#
        ```

    2. 查看 `/data/docker/`

         ```shell
         ll /data/docker/
         ```

       结果示例

        ```shell
        [root@localhost ~]# ll /data/docker/
        total 0
        [root@localhost ~]#
        ```

6. 移动文件

    ```shell
    mv /var/lib/docker/* /data/docker/
    ```

7. 查看文件夹结构（第二次）

    1. 查看 `/var/lib/docker/`

         ```shell
         ll /var/lib/docker/
         ```

       结果示例

        ```shell
        [root@localhost ~]# ll /var/lib/docker/
        total 0
        [root@localhost ~]#
        ```

    2. 查看 `/data/docker/`

         ```shell
         ll /data/docker/
         ```

       结果示例

        ```shell
        [root@localhost ~]# ll /data/docker/
        total 4
        drwx--x--x 4 root root 138 Aug  8 08:36 buildkit
        drwx--x--- 2 root root   6 Aug  8 08:36 containers
        -rw------- 1 root root  36 Aug  8 08:36 engine-id
        drwx------ 3 root root  22 Aug  8 08:36 image
        drwxr-x--- 3 root root  19 Aug  8 08:36 network
        drwx--x--- 3 root root  40 Aug  8 08:36 overlay2
        drwx------ 4 root root  32 Aug  8 08:36 plugins
        drwx------ 2 root root   6 Aug  8 08:36 runtimes
        drwx------ 2 root root   6 Aug  8 08:36 swarm
        drwx------ 2 root root   6 Aug  8 08:36 tmp
        drwx-----x 2 root root  50 Aug  8 08:36 volumes
        [root@localhost ~]#
        ```

8. 建立软链接（删除 `/var/lib/docker` 文件夹）

    ```shell
    rm /var/lib/docker -rf
    ln -s /data/docker/ /var/lib/docker
    ```

9. 查看文件夹结构（第三次）

    1. 查看 `/var/lib/docker/`

         ```shell
         ll /var/lib/docker
         ```

       结果示例

        ```shell
        [root@localhost docker]# ll /var/lib/docker
        lrwxrwxrwx 1 root root 13 Aug  8 08:43 /var/lib/docker -> /data/docker/
        [root@localhost docker]#
        ```

    2. 查看 `/data/docker/`

         ```shell
         ll /data/docker/
         ```

       结果示例

        ```shell
        [root@localhost ~]# ll /data/docker/
        total 4
        drwx--x--x 4 root root 138 Aug  8 08:36 buildkit
        drwx--x--- 2 root root   6 Aug  8 08:36 containers
        -rw------- 1 root root  36 Aug  8 08:36 engine-id
        drwx------ 3 root root  22 Aug  8 08:36 image
        drwxr-x--- 3 root root  19 Aug  8 08:36 network
        drwx--x--- 3 root root  40 Aug  8 08:36 overlay2
        drwx------ 4 root root  32 Aug  8 08:36 plugins
        drwx------ 2 root root   6 Aug  8 08:36 runtimes
        drwx------ 2 root root   6 Aug  8 08:36 swarm
        drwx------ 2 root root   6 Aug  8 08:36 tmp
        drwx-----x 2 root root  50 Aug  8 08:36 volumes
        [root@localhost ~]#
        ```

10. 启动 docker

     ```shell
     systemctl start docker.socket
     systemctl start docker.service
     ```

11. 查看数据储存路径（第二次）

     ```shell
     docker info | grep "Docker Root Dir"
     ```

    结果示例

     ```shell
     [root@localhost ~]# docker info | grep "Docker Root Dir"
     Docker Root Dir: /data/docker
     [root@localhost ~]#
     ```
