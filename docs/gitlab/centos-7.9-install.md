# CentOS 7.9 中安装 GitLab

## 参考文档

1. [GitLab 官网 CentOS 安装文档](https://about.gitlab.com/install/#centos-7)，使用国内IP访问时，会跳转到极狐GitLab
2. [极狐GitLab CentOS 安装文档](https://gitlab.cn/install/#centos-7)
3. [极狐GitLab 中文文档](https://docs.gitlab.cn)
4. [GitLab 升级路径工具](https://gitlab-com.gitlab.io/support/toolbox/upgrade-path/)
5. [自签名证书或自定义证书颁发机构](https://docs.gitlab.cn/runner/configuration/tls-self-signed.html)

## 说明

1. 极狐GitLab 是国内版的 GitLab，与 GitLab 相同，都提供代码托管与软件安装镜像
2. [极狐GitLab](https://jihulab.com)
3. 本文以 GitLab EE 为例（非极狐GitLab）
4. **本文使用的域名是IP 192.168.80.14（原因：如果使用域名，必须拥有这个域名的所有权，并增加解析才可以，要不然在 Docker
   容器中，无法使用域名检出代码，因为根据域名找不到DNS记录）**

## 安装 GitLab

1. 安装语句自动补全软件

   ```shell
   yum -y install bash-completion
   source /etc/profile
   ```

2. 安装必要依赖

   ```shell
   # 安装必要的依赖
   # 参见文档：
   # https://about.gitlab.com/install/#centos-7
   # https://gitlab.cn/install/#centos-7
   # https://packages.gitlab.com/gitlab/gitlab-ee/packages/el/7/gitlab-ee-15.5.4-ee.0.el7.x86_64.rpm
   
   # CentOS 7
   sudo yum install -y curl policycoreutils-python openssh-server perl 
   
   # CentOS 8
   # sudo yum install -y curl policycoreutils-python-utils openssh-server perl
   
   sudo systemctl enable sshd 
   sudo systemctl start sshd 
   # 开启 http 端口：GitLab 默认端口
   # 开启 https 端口：GitLab 默认端口
   sudo firewall-cmd --permanent --add-service=http 
   sudo firewall-cmd --permanent --add-service=https 
   # 重载防火墙
   sudo systemctl reload firewalld
   # 查看防火墙已开放的端口与服务
   sudo firewall-cmd --list-all
   ```

3. 安装 Postfix 用于发送邮件（可选）
    1. 用户使用新IP登录时发送邮件
    2. 用户使用邮件找回密码
    3. 用户PR邮件提示等

   ```shell
   sudo yum -y install postfix
   sudo systemctl enable postfix
   sudo systemctl start postfix
   ```

4. 配置 GitLab EE 软件源镜像

   ```shell
   curl https://packages.gitlab.com/install/repositories/gitlab/gitlab-ee/script.rpm.sh | sudo bash
   ```

5. 下载安装 GitLab EE

   ```shell
   sudo EXTERNAL_URL="http://192.168.80.14" yum install -y gitlab-ee
   
   # 或者使用
   # sudo yum install -y gitlab-ee
   # 由于上述安装命令未指定域名，需要手动执行一次配置
   # sudo gitlab-ctl reconfigure
   
   # 或者使用
   # 可以指定域名安装，避免手动配置
   # sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ee
   ```

6. 查看管理员 root 用户的默认密码

   ```shell
   # 用户名为 root
   sudo cat /etc/gitlab/initial_root_password
   ```

7. 修改密码，网址：http://<GitLab服务器IP>/-/profile/password/edit ，或修改DNS（也可以是本地hosts
   文件）后，使用： http://192.168.80.14/-/profile/password/edit
8. 将语言调整为中文，网址：http://<GitLab服务器IP>/-/profile/preferences，将 **Language** 修改为 **Chinese, Simplified -
   简体中文**，刷新页面即可显示中文
9. 至此，GitLab就安装完成了。
10. 相关命令
    1. 查看GitLab状态
        ```shell
        sudo systemctl status gitlab-runsvdir.service
        ```

    2. 停止GitLab

        ```shell
        sudo systemctl stop gitlab-runsvdir.service
        ```

    3. 重启GitLab

        ```shell
        sudo systemctl restart gitlab-runsvdir.service
        ```

    4. 启动GitLab

        ```shell
        sudo systemctl start gitlab-runsvdir.service
        ```

    5. 查看GitLab开机自启状态

        ```shell
        sudo systemctl list-unit-files | grep gitlab-runsvdir.service
        ```

    6. 关闭GitLab开启自启

        ```shell
        sudo systemctl disable gitlab-runsvdir.service
        ```

    7. 开启GitLab开启自启

        ```shell
        sudo systemctl enable gitlab-runsvdir.service
        ```

    8. 查看 GitLab 各服务的状态

        ```shell
        sudo gitlab-ctl status
        ```
