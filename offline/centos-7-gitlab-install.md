# 在 CentOS 7.9 上离线安装 GitLab

## 说明

1. 离线安装的原理参见：[离线安装：导读](guide.md)

2. 离线安装的示例参见：[在 CentOS 上离线安装 kubernetes（k8s）](centos-k8s-install.md)

3. 本文以 CentOS 7.9 最小化安装，gitlab-ee 最新版为例（其他 CentOS、gitlab 版本类似）

4. yum 包准备：可通过查阅 [CentOS 7 中安装 GitLab](../gitlab/centos-7.9-install.md)

   文中的 `yum install ***` 命令在后面添加 `--downloadonly --downloaddir=./下载的文件夹` 下载到指定文件夹中获取。

5. 有网和没网的系统版本需要是一样的，比如都是 CentOS 7.9 最小化安装

## 准备（在有网的电脑上执行）

1. 准备 bash-completion 安装包（可选，可能已经安装了）

   ```shell
   yum -y install bash-completion --downloadonly --downloaddir=./bash-completion
   ```

2. 准备安装 gitlab 所需依赖（可能已经安装了）

   ```shell
   sudo yum install -y curl policycoreutils-python openssh-server perl --downloadonly --downloaddir=./gitlab-before
   ```

3. 准备 gitlab 发送邮件的依赖（可选，可能已经安装了）

   ```shell
   sudo yum -y install postfix --downloadonly --downloaddir=./postfix
   ```

4. 安装 gitlab-ee 源

   ```shell
   curl https://packages.gitlab.com/install/repositories/gitlab/gitlab-ee/script.rpm.sh | sudo bash
   ```

5. 准备 gitlab-ee 安装包

   ```shell
   yum install -y gitlab-ee --downloadonly --downloaddir=./gitlab
   ```

## 安装（在没有网络的电脑上执行）

1. 将上面准备的安装包上传到没有网络的电脑

2. 依次安装下列文件夹中的依赖：bash-completion、gitlab-before、postfix、gitlab。

   安装命令

   ```shell
   cd ./bash-completion
   yum -y localinstall *.rpm
   # yum -y install *.rpm
   source /etc/profile
   cd ..
   
   cd ./gitlab-before
   yum -y localinstall *.rpm
   # yum -y install *.rpm
   cd ..
   
   cd ./postfix
   yum -y localinstall *.rpm
   # yum -y install *.rpm
   cd ..
   
   cd ./gitlab
   yum -y localinstall *.rpm
   # yum -y install *.rpm
   cd ..
   ```

3. 配置 gitlab

   ```shell
   gitlab-ctl reconfigure
   ```

4. 开放端口

   ```shell
   sudo firewall-cmd --permanent --add-service=http 
   sudo firewall-cmd --permanent --add-service=https 
   # 重载防火墙
   sudo systemctl reload firewalld
   # 查看防火墙已开放的端口与服务
   sudo firewall-cmd --list-all
   ```

5. 查看管理员 root 用户的默认密码

   ```shell
   # 用户名为 root
   sudo cat /etc/gitlab/initial_root_password
   ```

6. 其他操作与使用网络直接安装相同
