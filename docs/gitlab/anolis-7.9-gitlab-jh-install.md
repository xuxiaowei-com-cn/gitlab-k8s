---
sidebar_position: 3
---

# Anolis 7.9 中安装 GitLab-jh

## 安装

1. 添加 gitlab-jh 仓库

    ```shell
    REPO_URL="https://packages.gitlab.cn"
    gpgcheck=0
    releasever=7
    
    sudo cat << EOF | sudo tee /etc/yum.repos.d/gitlab-jh.repo
    [gitlab-jh]
    name=JiHu GitLab
    baseurl=$REPO_URL/repository/el/$releasever/
    gpgcheck=$gpgcheck
    gpgkey=$REPO_URL/repository/raw/gpg/public.gpg.key
    priority=1
    enabled=1
    EOF
    
    cat /etc/yum.repos.d/gitlab-jh.repo
    ```

2. 更新本地软件包缓存

   ```shell
   yum makecache
   
   # 清空后执行
   # yum clean all && yum makecache
   ```

3. 安装 GitLab-jh
    ```shell
    sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-jh
    ```

4. 其他命令与安装 gitlab 相同
