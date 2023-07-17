---
sidebar_position: 12
---

# 在 乌班图 Ubuntu 上离线安装 Nginx

## 说明

1. 离线安装的原理参见：[离线安装：导读](/docs/offline/guide.md)
2. 使用的是 [ubuntu-20.04.6-live-server-amd64](https://releases.ubuntu.com/20.04/ubuntu-20.04.6-live-server-amd64.iso)
    1. 其中 live-server 代表最小化，无桌面。
    2. 系统安装时，全称无互联网网络，即：未更新。
    3. 本文使用虚拟机操作。
    4. 本文安装时，开启了 SSL、http2
    5. 本文以 [nginx-1.23.4.tar.gz](https://nginx.org/download/nginx-1.23.4.tar.gz) 离线安装为例，会安装两遍
        1. 第一遍有网，用于下载依赖、备份依赖、安装测试等
        2. 第二遍断网，使用第一遍备份的依赖，进行安装

## 安装

1. 查看 Ubuntu 版本号

    ```shell
    lsb_release -a
    ```

    ```shell
    xuxiaowei@xuxiaowei:~$ lsb_release -a
    No LSB modules are available.
    Distributor ID:	Ubuntu
    Description:	Ubuntu 20.04.6 LTS
    Release:	20.04
    Codename:	focal
    xuxiaowei@xuxiaowei:~$ 
    ```

2. 查看 Ubuntu 是否安装了桌面

    ```shell
    dpkg -l ubuntu-desktop
    ```

3. 下载 [nginx-1.23.4.tar.gz](https://nginx.org/download/nginx-1.23.4.tar.gz)，上传至 Ubuntu，解压、进入文件夹

    ```shell
    tar -zxvf nginx-1.23.4.tar.gz
    cd nginx-1.23.4
    ```

4. **在执行之前，给虚拟机新建一个快照，用于回滚测试**。

5. 尝试**在有网络时的环境下**编译（下载依赖，用于在没有网络的环境下使用）

    ```shell
    ./configure --with-http_ssl_module --with-http_v2_module
    make
    sudo make install
    ```

    1. 请查看 `/var/cache/apt/archives` 文件夹中是否有 .deb 安装文件，如果有，请使用 `sudo apt-get clean` 进行清空。
    2. 更新软件包索引

         ```shell
         # 短时间内仅需要运行一次
         sudo apt update
         ```

    3. 执行 `./configure --with-http_ssl_module --with-http_v2_module` 出现下列错误，说明缺少 gcc

         ```shell
         xuxiaowei@xuxiaowei:~/nginx-1.23.4$ ./configure --with-http_ssl_module --with-http_v2_module
         checking for OS
          + Linux 5.4.0-144-generic x86_64
         checking for C compiler ... not found
         
         ./configure: error: C compiler cc is not found
         
         xuxiaowei@xuxiaowei:~/nginx-1.23.4$ 
         ```

       下载 gcc、安装 gcc

        ```shell
        # 下载软件，文件夹：/var/cache/apt/archives
        sudo apt-get -y install --download-only gcc
        
        # 本地安装
        sudo apt -y install /var/cache/apt/archives/*.deb
        ```

    4. 执行 `./configure --with-http_ssl_module --with-http_v2_module` 出现下列错误，说明缺少 libpcre3-dev

        ```shell
        ./configure: error: the HTTP rewrite module requires the PCRE library.
        You can either disable the module by using --without-http_rewrite_module
        option, or install the PCRE library into the system, or build the PCRE library
        statically from the source with nginx by using --with-pcre=<path> option.
        ```

       下载 libpcre3-dev、安装 libpcre3-dev

        ```shell
        # 下载软件，文件夹：/var/cache/apt/archives
        sudo apt-get -y install --download-only libpcre3-dev
        
        # 本地安装
        sudo apt -y install /var/cache/apt/archives/*.deb
        ```

    5. 执行 `./configure --with-http_ssl_module --with-http_v2_module` 出现下列错误，说明缺少 libssl-dev

       ```shell
       ./configure: error: SSL modules require the OpenSSL library.
       You can either do not enable the modules, or install the OpenSSL library
       into the system, or build the OpenSSL library statically from the source
       with nginx by using --with-openssl=<path> option.
       ```

       下载 libpcre3-dev、安装 libssl-dev

       ```shell
       # 下载软件，文件夹：/var/cache/apt/archives
       sudo apt-get -y install --download-only libssl-dev
       
       # 本地安装
       sudo apt -y install /var/cache/apt/archives/*.deb
       ```

    6. 执行 `./configure --with-http_ssl_module --with-http_v2_module` 出现下列错误，说明缺少 zlib1g-dev

        ```shell
        ./configure: error: the HTTP gzip module requires the zlib library.
        You can either disable the module by using --without-http_gzip_module
        option, or install the zlib library into the system, or build the zlib library
        statically from the source with nginx by using --with-zlib=<path> option.
        ```

       下载 zlib1g-dev、安装 zlib1g-dev

        ```shell
        # 下载软件，文件夹：/var/cache/apt/archives
        sudo apt-get -y install --download-only zlib1g-dev
        
        # 本地安装
        sudo apt -y install /var/cache/apt/archives/*.deb
        ```

    7. 执行 `./configure --with-http_ssl_module --with-http_v2_module` 出现下列内容，说明**配置正常**了。

         ```shell
         Configuration summary
           + using system PCRE library
           + using system OpenSSL library
           + using system zlib library
         
           nginx path prefix: "/usr/local/nginx"
           nginx binary file: "/usr/local/nginx/sbin/nginx"
           nginx modules path: "/usr/local/nginx/modules"
           nginx configuration prefix: "/usr/local/nginx/conf"
           nginx configuration file: "/usr/local/nginx/conf/nginx.conf"
           nginx pid file: "/usr/local/nginx/logs/nginx.pid"
           nginx error log file: "/usr/local/nginx/logs/error.log"
           nginx http access log file: "/usr/local/nginx/logs/access.log"
           nginx http client request body temporary files: "client_body_temp"
           nginx http proxy temporary files: "proxy_temp"
           nginx http fastcgi temporary files: "fastcgi_temp"
           nginx http uwsgi temporary files: "uwsgi_temp"
           nginx http scgi temporary files: "scgi_temp"
         ```

    8. 执行 `make` 出现下列错误，说明缺少 make

         ```shell
         xuxiaowei@xuxiaowei:~/nginx-1.23.4$ make
         
         Command 'make' not found, but can be installed with:
         
         sudo apt install make        # version 4.2.1-1.2, or
         sudo apt install make-guile  # version 4.2.1-1.2
         
         xuxiaowei@xuxiaowei:~/nginx-1.23.4$ 
         ```

       下载 make、安装 make

         ```shell
         # 下载软件，文件夹：/var/cache/apt/archives
         sudo apt-get -y install --download-only make
         
         # 本地安装
         sudo apt -y install /var/cache/apt/archives/*.deb
         ```

    9. 执行 `sudo make install` 没报错，说明安装成功

    10. 测试

         ```shell
         /usr/local/nginx/sbin/nginx -V
         ```

        显示内容如下，说明安装成功了

         ```shell
         xuxiaowei@xuxiaowei:~/nginx-1.23.4$ /usr/local/nginx/sbin/nginx -V
         nginx version: nginx/1.23.4
         built by gcc 9.4.0 (Ubuntu 9.4.0-1ubuntu1~20.04.1) 
         built with OpenSSL 1.1.1f  31 Mar 2020
         TLS SNI support enabled
         configure arguments: --with-http_ssl_module --with-http_v2_module
         xuxiaowei@xuxiaowei:~/nginx-1.23.4$ 
         ```

    11. 将 /var/cache/apt/archives 文件夹中的 *.deb 文件打包成 nginx-1.23.4-deb.tar.gz、备份 nginx-1.23.4-deb.tar.gz

         ```shell
         sudo tar czvf nginx-1.23.4-deb.tar.gz /var/cache/apt/archives/*.deb
         ```

6. **重置虚拟机状态，并全称断网，进行离线安装**

    1. 解压 nginx-1.23.4-deb.tar.gz、安装里面的依赖

        ```shell
        tar -zxvf nginx-1.23.4-deb.tar.gz
        
        # 本地安装（注意路径）
        sudo dpkg -i ./var/cache/apt/archives/*.deb
        ```

    2. 解压 nginx-1.23.4.tar.gz、安装 Nginx

         ```shell
         tar -zxvf nginx-1.23.4.tar.gz
         cd nginx-1.23.4
         ./configure --with-http_ssl_module --with-http_v2_module
         make
         sudo make install
         ```

    3. 测试安装结果

        ```shell
        /usr/local/nginx/sbin/nginx -V
        ```

       显示内容如下，说明安装成功了

         ```shell
         xuxiaowei@xuxiaowei:~/nginx-1.23.4$ /usr/local/nginx/sbin/nginx -V
         nginx version: nginx/1.23.4
         built by gcc 9.4.0 (Ubuntu 9.4.0-1ubuntu1~20.04.1) 
         built with OpenSSL 1.1.1f  31 Mar 2020
         TLS SNI support enabled
         configure arguments: --with-http_ssl_module --with-http_v2_module
         xuxiaowei@xuxiaowei:~/nginx-1.23.4$ 
         ```
