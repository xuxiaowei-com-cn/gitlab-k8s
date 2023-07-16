---
sidebar_position: 2
---

# Anolis 8 安装 GitLab Runner

## 说明

1. 原理参见上文 [龙蜥 Anolis 8 中安装 GitLab](/docs/gitlab/anolis-8.4-install.md)

2. 本文以 Anolis 8为例进行说明（**如果使用的是 Anolis 7，需要将下方链接中的参数 8 改为 7**）

## 安装

1. 尝试获取结果

    ```
    # 使用 curl 需要在请求头中添加标识 User-Agent
    sudo curl 'https://packages.gitlab.com/install/repositories/runner/gitlab-runner/config_file.repo?os=centos&dist=8&source=script' --header 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'
    ```

2. yum源下载到 `/etc/yum.repos.d/runner_gitlab-runner.repo`

    ```
    # 使用 curl 需要在请求头中添加标识 User-Agent
    sudo curl 'https://packages.gitlab.com/install/repositories/runner/gitlab-runner/config_file.repo?os=centos&dist=8&source=script' --header 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36' > /etc/yum.repos.d/runner_gitlab-runner.repo
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
    AnolisOS-8 - AppStream                                                                                                     5.5 MB/s |  10 MB     00:01    
    AnolisOS-8 - BaseOS                                                                                                        4.4 MB/s | 7.9 MB     00:01    
    AnolisOS-8 - PowerTools                                                                                                    4.8 MB/s | 2.1 MB     00:00    
    runner_gitlab-runner                                                                                                       138  B/s | 862  B     00:06    
    runner_gitlab-runner                                                                                                       1.1 kB/s | 3.1 kB     00:02    
    Importing GPG key 0x51312F3F:
     Userid     : "GitLab B.V. (package repository signing key) <packages@gitlab.com>"
     Fingerprint: F640 3F65 44A3 8863 DAA0 B6E0 3F01 618A 5131 2F3F
     From       : https://packages.gitlab.com/runner/gitlab-runner/gpgkey
    runner_gitlab-runner                                                                                                       966  B/s | 3.1 kB     00:03    
    Importing GPG key 0x35DFA027:
     Userid     : "GitLab, Inc. <support@gitlab.com>"
     Fingerprint: 09E5 7083 F34C CA94 D541 BC58 A674 BF81 35DF A027
     From       : https://packages.gitlab.com/runner/gitlab-runner/gpgkey/runner-gitlab-runner-4C80FB51394521E9.pub.gpg
    runner_gitlab-runner                                                                                                       1.0 kB/s |  12 kB     00:11    
    runner_gitlab-runner-source                                                                                                 65  B/s | 862  B     00:13    
    runner_gitlab-runner-source                                                                                                773  B/s | 3.1 kB     00:04    
    Importing GPG key 0x51312F3F:
     Userid     : "GitLab B.V. (package repository signing key) <packages@gitlab.com>"
     Fingerprint: F640 3F65 44A3 8863 DAA0 B6E0 3F01 618A 5131 2F3F
     From       : https://packages.gitlab.com/runner/gitlab-runner/gpgkey
    runner_gitlab-runner-source                                                                                                1.0 kB/s | 3.1 kB     00:03    
    Importing GPG key 0x35DFA027:
     Userid     : "GitLab, Inc. <support@gitlab.com>"
     Fingerprint: 09E5 7083 F34C CA94 D541 BC58 A674 BF81 35DF A027
     From       : https://packages.gitlab.com/runner/gitlab-runner/gpgkey/runner-gitlab-runner-4C80FB51394521E9.pub.gpg
    runner_gitlab-runner-source                                                                                                 31  B/s | 296  B     00:09    
    Metadata cache created.
    [root@alios8 ~]# 
    ```

4. 安装

    ```
    yum -y install gitlab-runner
    ```

5. 后面就可以直接使用前面的文档 [CentOS 安装 GitLab Runner](/docs/gitlab-runnerunner/centos-install.md) 进行配置了
