---
sidebar_position: 8
---

# 在 乌班图 Ubuntu 上离线安装 GitLab

## 说明

1. 离线安装的原理参见：[离线安装：导读](/docs/offline/guide.md)
2. 使用的是 [ubuntu-20.04.6-live-server-amd64](https://releases.ubuntu.com/20.04/ubuntu-20.04.6-live-server-amd64.iso)
    1. 其中 live-server 代表最小化，无桌面。
    2. 系统安装时，全称无互联网网络，即：未更新。
    3. 本文使用虚拟机操作。
    4. 本文使用的 gitlab 域名为：[http://gitlab.example.com](http://gitlab.example.com)
    5. 本文以 gitlab-ee 企业版为例（区别参见：[GitLab 导读](/docs/guide/gitlab.md)），会安装两遍

        1. 第一遍有网，用于下载依赖、备份依赖、安装测试等
        2. 第二遍断网，使用第一遍备份的依赖，进行安装

## 参考文档

1. [GitLab 官网 Ubuntu 安装文档](https://about.gitlab.com/install/#ubuntu)，使用国内IP访问时，会跳转到极狐GitLab
    1. 对于 Ubuntu 20.04 和 22.04，arm64包也可用，并且在使用 GitLab 存储库进行安装时将自动在该平台上使用。
2. [极狐GitLab Ubuntu 安装文档](https://gitlab.cn/install/#ubuntu)
3. [极狐GitLab 中文文档](https://docs.gitlab.cn/)
4. [GitLab 升级路径工具](https://gitlab-com.gitlab.io/support/toolbox/upgrade-path/)

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

3. **在执行之前，给虚拟机新建一个快照，用于回滚测试**。
4. 尝试**在有网络时的环境下**编译（下载依赖，用于在没有网络的环境下使用）
    1. 请查看 `/var/cache/apt/archives` 文件夹中是否有 .deb 安装文件，如果有，请使用 `sudo apt-get clean` 进行清空。
    2. 安装配置必要的依赖

       ```shell
       # 更新软件包索引
       # 短时间内仅需要运行一次
       sudo apt-get update
       
       # 下载软件，文件夹：/var/cache/apt/archives
       sudo apt-get install -y --download-only curl openssh-server ca-certificates tzdata perl
       
       # 本地安装
       sudo apt -y install /var/cache/apt/archives/*.deb
       ```

    3. （可选）接下来，安装 Postfix（或 Sendmail）以发送通知电子邮件。如果您想使用其他解决方案发送电子邮件，请跳过此步骤并 在安装
       GitLab 后配置外部 SMTP 服务器。
       在 Postfix 安装期间，可能会出现一个配置屏幕。选择“Internet 站点”并按回车键。使用服务器的外部 DNS 作为“邮件名称”，然后按回车键。
       如果出现其他屏幕，请继续按 enter 键接受默认设置。

        ```shell
        # 下载软件，文件夹：/var/cache/apt/archives
        sudo apt-get install -y --download-only postfix
        
        # 本地安装
        sudo apt -y install /var/cache/apt/archives/*.deb
        ```

    4. 添加GitLab包仓库并安装包

         ```shell
         curl https://packages.gitlab.com/install/repositories/gitlab/gitlab-ee/script.deb.sh | sudo bash
         ```

    5. 接下来，安装 GitLab 包

         ```shell
         # 用于更新 gitlab 源
         sudo apt-get update
         
         # 下载软件，文件夹：/var/cache/apt/archives
         sudo apt-get install --download-only gitlab-ee
         
         # 本地安装
         sudo EXTERNAL_URL="http://gitlab.example.com" apt -y install /var/cache/apt/archives/*.deb
         
         # 配置
         sudo gitlab-ctl reconfigure
         ```

    6. 浏览到主机名并登录，密码参见

         ```shell
         sudo cat /etc/gitlab/initial_root_password
         ```

    7. 将 /var/cache/apt/archives 文件夹中的 *.deb 文件打包成 gitlab-ee-deb.tar.gz、备份 gitlab-ee-deb.tar.gz

         ```shell
         sudo tar czvf gitlab-ee-deb.tar.gz /var/cache/apt/archives/*.deb
         ```

5. **重置虚拟机状态，并全称断网，进行离线安装**

    1. 解压 gitlab-ee-deb.tar.gz、安装里面的依赖

        ```shell
        tar -zxvf gitlab-ee-deb.tar.gz
        
        # 本地安装（注意路径）
        sudo EXTERNAL_URL="http://gitlab.example.com" dpkg -i ./var/cache/apt/archives/*.deb
        
        # 配置
        sudo gitlab-ctl reconfigure
        ```

    2. 浏览到主机名并登录，密码参见

         ```shell
         sudo cat /etc/gitlab/initial_root_password
         ```
