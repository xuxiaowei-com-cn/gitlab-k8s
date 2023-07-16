---
sidebar_position: 2
---

# Anolis 8.4 中安装 GitLab

## 说明与文档

1. 龙蜥官网：[https://openanolis.cn/](https://openanolis.cn/)
2. 龙蜥 Anolis 系统是阿里云团队开发
3. 龙蜥 Anolis 系统与 CentOS 软件生态兼容
4. GitLab EE 企业版安装 rpm
   说明：[https://packages.gitlab.com/gitlab/gitlab-ee/install#bash-rpm](https://packages.gitlab.com/gitlab/gitlab-ee/install#bash-rpm)
5. GitLab CE 社区版安装 rpm
   说明：[https://packages.gitlab.com/gitlab/gitlab-ce/install#bash-rpm](https://packages.gitlab.com/gitlab/gitlab-ce/install#bash-rpm)
6. 本文以 Anolis 8、GitLab EE 企业版为例进行说明（**如果使用的是 Anolis 7，需要将下方链接中的参数8改为7**）
7. [GitLab 官网 CentOS 安装文档](https://about.gitlab.com/install/#centos-7)
   ，使用国内IP访问时，会跳转到极狐GitLab
8. [极狐GitLab CentOS 安装文档](https://gitlab.cn/install/#centos-7)

## 安装说明

1. 官方文档中 CentOS 安装说明中，使用 `curl
   -s https://packages.gitlab.com/install/repositories/gitlab/gitlab-ee/script.rpm.sh | sudo bash` 安装CentOS
   yum源，之后就可以使用 `sudo yum -y install gitlab-ee` 进行安装了
2. 执行 `curl -s https://packages.gitlab.com/install/repositories/gitlab/gitlab-ee/script.rpm.sh | sudo bash`
   运行的脚本内容可在 [https://packages.gitlab.com/gitlab/gitlab-ee/install#bash-rpm](https://packages.gitlab.com/gitlab/gitlab-ee/install#bash-rpm)
   中查看，脚本中下载 yum
   源的地址是 [https://packages.gitlab.com/install/repositories/gitlab/gitlab-ee/config_file.repo?os=${os}&dist=${dist}&source=script](https://packages.gitlab.com/install/repositories/gitlab/gitlab-ee/config_file.repo?os=${os}&dist=${dist}&source=script)
   ，由从地址可知，下载时会使用当前系统的名称作为参数
3. 由于龙蜥系统与CentOS软件生态兼容，可以自己构建下载链接并手动下载yum源，放入到 `/etc/yum.repos.d/`文件夹中即可

## 安装

1. 查看系统版本

   ```
   cat /etc/redhat-release
   ```

   ```
   # 返回结果
   [root@alios8 ~]# cat /etc/redhat-release 
   Anolis OS release 8.4
   [root@alios8 ~]# 
   ```

2. 根据上面的内容，可以看到使用的是龙蜥8，对应的 CentOS 版本也是 8

3. 构建yum源链接并下载到 `/etc/yum.repos.d/` 文件夹中
    1. 尝试获取结果

        ```
        # 使用 curl 需要在请求头中添加标识 User-Agent
        curl 'https://packages.gitlab.com/install/repositories/gitlab/gitlab-ee/config_file.repo?os=centos&dist=8&source=script' --header 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'
        ```

    2. yum源下载到 `/etc/yum.repos.d/gitlab_gitlab-ee.repo`

         ```
         # 使用 curl 需要在请求头中添加标识 User-Agent
         sudo curl 'https://packages.gitlab.com/install/repositories/gitlab/gitlab-ee/config_file.repo?os=centos&dist=8&source=script' --header 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36' > /etc/yum.repos.d/gitlab_gitlab-ee.repo
         ```

    3. 更新yum源（首次更新，可能会提示需要下载并导入 gpgkey）

        ```
        # 更新yum源
        yum makecache
        # yum makecache -y
        
        # 清空yum源后再更新yum源
        # yum clean all && yum makecache
        # yum clean all && yum makecache -y
        ```

        ```
        # 更新命令及结果，为了方便，使用了 -y 进行确定
        
        [root@alios8 ~]# yum makecache -y
        AnolisOS-8 - AppStream                                                                                                     5.9 MB/s |  10 MB     00:01    
        AnolisOS-8 - BaseOS                                                                                                        3.3 MB/s | 7.9 MB     00:02    
        AnolisOS-8 - PowerTools                                                                                                    4.3 MB/s | 2.1 MB     00:00    
        gitlab_gitlab-ee                                                                                                           105  B/s | 862  B     00:08    
        gitlab_gitlab-ee                                                                                                           790  B/s | 3.1 kB     00:04    
        Importing GPG key 0x51312F3F:
         Userid     : "GitLab B.V. (package repository signing key) <packages@gitlab.com>"
         Fingerprint: F640 3F65 44A3 8863 DAA0 B6E0 3F01 618A 5131 2F3F
         From       : https://packages.gitlab.com/gitlab/gitlab-ee/gpgkey
        gitlab_gitlab-ee                                                                                                           698  B/s | 3.8 kB     00:05    
        Importing GPG key 0xF27EAB47:
         Userid     : "GitLab, Inc. <support@gitlab.com>"
         Fingerprint: DBEF 8977 4DDB 9EB3 7D9F C3A0 3CFC F9BA F27E AB47
         From       : https://packages.gitlab.com/gitlab/gitlab-ee/gpgkey/gitlab-gitlab-ee-3D645A26AB9FBD22.pub.gpg
        gitlab_gitlab-ee                                                                                                            97 kB/s | 1.5 MB     00:15    
        gitlab_gitlab-ee-source                                                                                                     78  B/s | 862  B     00:11    
        gitlab_gitlab-ee-source                                                                                                    465  B/s | 3.1 kB     00:06    
        Importing GPG key 0x51312F3F:
         Userid     : "GitLab B.V. (package repository signing key) <packages@gitlab.com>"
         Fingerprint: F640 3F65 44A3 8863 DAA0 B6E0 3F01 618A 5131 2F3F
         From       : https://packages.gitlab.com/gitlab/gitlab-ee/gpgkey
        gitlab_gitlab-ee-source                                                                                                    953  B/s | 3.8 kB     00:04    
        Importing GPG key 0xF27EAB47:
         Userid     : "GitLab, Inc. <support@gitlab.com>"
         Fingerprint: DBEF 8977 4DDB 9EB3 7D9F C3A0 3CFC F9BA F27E AB47
         From       : https://packages.gitlab.com/gitlab/gitlab-ee/gpgkey/gitlab-gitlab-ee-3D645A26AB9FBD22.pub.gpg
        gitlab_gitlab-ee-source                                                                                                     21  B/s | 296  B     00:13    
        Metadata cache created.
        [root@alios8 ~]# 
        ```

4. 安装

    ```
    sudo yum install -y gitlab-ee
    # 由于上述安装命令未指定域名，需要手动执行一次配置
    sudo gitlab-ctl reconfigure
    
    # 可以指定域名安装，避免手动配置
    # sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ee
    ```

5. 后面就可以直接使用前面的文档 [CentOS 7 中安装 GitLab](/docs/gitlab/centos-7.9-install.md) 进行配置了
