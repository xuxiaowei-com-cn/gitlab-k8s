# 私库搭建1：在 Docker 中安装 Nexus

## 文档

1. [https://hub.docker.com/r/sonatype/nexus3](https://hub.docker.com/r/sonatype/nexus3)
2. Docker 安装
    1. [CentOS 安装 Docker](../docker/centos-install.md)

## 安装

1. 创建文件夹
   **由于 Nexus 的数据可能会很大，比如：作为 Docker、Maven 私库时，随着使用时长的增加，下载的Docker镜像和Maven依赖会占用较大的磁盘空间，所以要在
   Linux 上找一个空间比较大的挂载点，在此挂载点上创建一个文件夹，并进行授权，在后面将使用该文件夹**

   ```shell
   # 创建文件夹
   mkdir /some/dir/nexus-data -p
   # 授权
   chown -R 200 /some/dir/nexus-data
   ```

2. 创建容器
    1. --restart always：跟随 Docker 一起启动
    2. -p 8081:8081：默认http的端口
    3. -p 8443:8443：准备用户配置https的端口（如果提前没有准备多余的端口，可将 nexus
       容器停止后删除，修改创建命令，重新创建一次即可，数据不会丢失：原因是数据保存在挂载卷中）
    4. -p 8000-8010:8000-8010：准备用户配置 Docker 私库的端口（如果提前没有准备多余的端口，可将 nexus
       容器停止后删除，修改创建命令，重新创建一次即可，数据不会丢失：原因是数据保存在挂载卷中）
    5. --name nexus：容器名称
    6. -v /some/dir/nexus-data:/nexus-data：数据文件映射
    7. sonatype/nexus3：docker镜像，没有指定版本号，代表使用 latest 版本

   ```shell
   docker run \
   -d \
   --restart always \
   -p 8081:8081 \
   -p 8443:8443 \
   -p 8000-8010:8000-8010 \
   --name nexus \
   -v /some/dir/nexus-data:/nexus-data \
   sonatype/nexus3
   ```

   ```shell
   firewall-cmd --zone=public --add-port=8081/tcp --permanent
   firewall-cmd --zone=public --add-port=8443/tcp --permanent
   firewall-cmd --zone=public --add-port=8000-8010/tcp --permanent
   firewall-cmd --reload
   firewall-cmd --list-all
   ```

3. 查看默认管理员admin的密码
    1. 直接在docker宿主机上查看默认管理员admin的密码

        ```shell
        cat /some/dir/nexus-data/admin.password 
        ```

       **下面是查看的结果，由于 /some/dir/nexus-data/admin.password
       文件中只有一行内容，查看结果没有换行，所以密码是f3bce7fc-d1a3-4800-b399-219873440f17，后面的 [root@centos-7-9 ~]#
       不是密码**

        ```shell
        [root@centos-7-9 ~]# cat /some/dir/nexus-data/admin.password 
        f3bce7fc-d1a3-4800-b399-219873440f17[root@centos-7-9 ~]# 
        ```

    2. 进入容器，查看默认管理员admin的密码

   ```shell
   docker exec -it nexus bash
   ```

   ```shell
   [root@centos-7-9 ~]# docker exec -it nexus bash
   bash-4.4$ 
   ```

   ```shell
   cat /nexus-data/admin.password
   ```

   **下面是查看的结果，由于 /nexus-data/admin.password 文件中只有一行内容，查看结果没有换行，所以密码是f3bce7fc-d1a3-4800-b399-219873440f17，后面的
   bash-4.4$ 不是密码**

   ```shell
   bash-4.4$ cat /nexus-data/admin.password
   f3bce7fc-d1a3-4800-b399-219873440f17bash-4.4$ 
   ```

4. 直接访问登录即可，登录完成要修改密码，预设配置根据情况设置，**学习时推荐开启匿名访问**。
