# 安装 GitLab {id=gitlab}

[[toc]]

## 文档 {id=doc}

|                 | 中文文档                                                        | 英文文档                                                       |
|-----------------|-------------------------------------------------------------|------------------------------------------------------------|
| 安装 GitLab       | https://gitlab.cn/install/                                  | https://about.gitlab.com/install/                          |
| GitLab 升级路径工具   |                                                             | https://gitlab-com.gitlab.io/support/toolbox/upgrade-path/ |

## CentOS 安装 GitLab {id=centos-install-gitlab}

::: warning 警告

1. 安装文档为最小化安装，暂不涉及邮件等依赖，后续文档会介绍
2. 国内镜像同步可能存在不及时的情况
3. 可能存在国内镜像未同步对应系统版本的情况，如：清华大学只同步了 CentOS 7 和 9，没有同步 CentOS 8。
   根据自身情况，选择接近的版本或使用其他镜像，根据作者的经验，选择 GitLab 版本时，可选择低于当前系统版本的软件，
   如：CentOS 8 可以安装针对于 CentOS 7 平台编译的 GitLab

:::

::: code-group

```shell [极狐源]
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld

curl -L get.gitlab.cn | bash

sudo yum clean all

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-jh

# 列出可用版本: sudo yum --showduplicates list gitlab-jh
# 安装指定版本: sudo yum install -y gitlab-jh-17.3.2

# 如果上述安装命令未指定域名，需要手动执行一次配置
# sudo gitlab-ctl reconfigure
```

```shell [清华大学源-ee]
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld

cat <<EOF | tee /etc/yum.repos.d/gitlab_gitlab-ee.repo
[gitlab_gitlab-ee]
name=gitlab_gitlab-ee
baseurl=https://mirrors.tuna.tsinghua.edu.cn/gitlab-ee/yum/el\$releasever/
repo_gpgcheck=0
gpgcheck=0
enabled=1

EOF

sudo yum clean all

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ee

# 列出可用版本: sudo yum --showduplicates list gitlab-ee
# 安装指定版本: sudo yum install -y gitlab-ee-17.1.1

# 如果上述安装命令未指定域名，需要手动执行一次配置
# sudo gitlab-ctl reconfigure
```

```shell [清华大学源-ce]
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld

cat <<EOF | tee /etc/yum.repos.d/gitlab_gitlab-ce.repo
[gitlab_gitlab-ce]
name=gitlab_gitlab-ce
baseurl=https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el\$releasever/
repo_gpgcheck=0
gpgcheck=0
enabled=1

EOF

sudo yum clean all

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ce

# 列出可用版本: sudo yum --showduplicates list gitlab-ce
# 安装指定版本: sudo yum install -y gitlab-ce-17.1.1

# 如果上述安装命令未指定域名，需要手动执行一次配置
# sudo gitlab-ctl reconfigure
```

```shell [南京大学源-ee]
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld

cat <<EOF | tee /etc/yum.repos.d/gitlab_gitlab-ee.repo
[gitlab_gitlab-ee]
name=gitlab_gitlab-ee
baseurl=https://mirrors.nju.edu.cn/gitlab-ee/yum/el\$releasever/
repo_gpgcheck=0
gpgcheck=0
enabled=1

EOF

sudo yum clean all

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ee

# 列出可用版本: sudo yum --showduplicates list gitlab-ee
# 安装指定版本: sudo yum install -y gitlab-ee-17.1.1

# 如果上述安装命令未指定域名，需要手动执行一次配置
# sudo gitlab-ctl reconfigure
```

```shell [南京大学源-ce]
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld

cat <<EOF | tee /etc/yum.repos.d/gitlab_gitlab-ce.repo
[gitlab_gitlab-ce]
name=gitlab_gitlab-ce
baseurl=https://mirrors.nju.edu.cn/gitlab-ce/yum/el\$releasever/
repo_gpgcheck=0
gpgcheck=0
enabled=1

EOF

sudo yum clean all

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ce

# 列出可用版本: sudo yum --showduplicates list gitlab-ce
# 安装指定版本: sudo yum install -y gitlab-ce-17.1.1

# 如果上述安装命令未指定域名，需要手动执行一次配置
# sudo gitlab-ctl reconfigure
```

```shell [官方源-ee]
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld

curl https://packages.gitlab.com/install/repositories/gitlab/gitlab-ee/script.rpm.sh | sudo bash

sudo yum clean all

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ee

# 列出可用版本: sudo yum --showduplicates list gitlab-ee
# 安装指定版本: sudo yum install -y gitlab-ee-17.3.2

# 如果上述安装命令未指定域名，需要手动执行一次配置
# sudo gitlab-ctl reconfigure
```

```shell [官方源-ce]
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld

curl https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.rpm.sh | sudo bash

sudo yum clean all

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ce

# 列出可用版本: sudo yum --showduplicates list gitlab-ce
# 安装指定版本: sudo yum install -y gitlab-ce-17.3.2

# 如果上述安装命令未指定域名，需要手动执行一次配置
# sudo gitlab-ctl reconfigure
```

:::

## 类 CentOS 安装 GitLab {id=similar-centos-install-gitlab}

::: warning 警告

1. 如果需要安装 GitLab 的操作系统不是 CentOS，而是 CentOS 系列的操作系统（比如：可以使用 yum 安装软件），
   可使用下方命令安装 GitLab
2. 若操作系统基于 CentOS 7/8/9 发布，则可以选择下方对应的命令
3. 若无法确定操作系统基于 CentOS 几 发布，根据尝试下方的 3 个选择

:::

### 基于 <strong><font color="red">CentOS 7</font></strong> 的系统

::: code-group

```shell [极狐源]
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld

cat <<EOF | tee /etc/yum.repos.d/gitlab-jh.repo
[gitlab-jh]
name=JiHu GitLab
baseurl=https://packages.gitlab.cn/repository/el/7/
gpgcheck=0
gpgkey=https://packages.gitlab.cn/repository/raw/gpg/public.gpg.key
priority=1
enabled=1

EOF

sudo yum clean all

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-jh

# 列出可用版本: sudo yum --showduplicates list gitlab-jh
# 安装指定版本: sudo yum install -y gitlab-jh-17.3.2

# 如果上述安装命令未指定域名，需要手动执行一次配置
# sudo gitlab-ctl reconfigure
```

```shell [清华大学源-ee]
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld

cat <<EOF | tee /etc/yum.repos.d/gitlab_gitlab-ee.repo
[gitlab_gitlab-ee]
name=gitlab_gitlab-ee
baseurl=https://mirrors.tuna.tsinghua.edu.cn/gitlab-ee/yum/el7/
repo_gpgcheck=0
gpgcheck=0
enabled=1

EOF

sudo yum clean all

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ee

# 列出可用版本: sudo yum --showduplicates list gitlab-ee
# 安装指定版本: sudo yum install -y gitlab-ee-17.1.1

# 如果上述安装命令未指定域名，需要手动执行一次配置
# sudo gitlab-ctl reconfigure
```

```shell [清华大学源-ce]
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld

cat <<EOF | tee /etc/yum.repos.d/gitlab_gitlab-ce.repo
[gitlab_gitlab-ce]
name=gitlab_gitlab-ce
baseurl=https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el7/
repo_gpgcheck=0
gpgcheck=0
enabled=1

EOF

sudo yum clean all

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ce

# 列出可用版本: sudo yum --showduplicates list gitlab-ce
# 安装指定版本: sudo yum install -y gitlab-ce-17.1.1

# 如果上述安装命令未指定域名，需要手动执行一次配置
# sudo gitlab-ctl reconfigure
```

```shell [南京大学源-ee]
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld

cat <<EOF | tee /etc/yum.repos.d/gitlab_gitlab-ee.repo
[gitlab_gitlab-ee]
name=gitlab_gitlab-ee
baseurl=https://mirrors.nju.edu.cn/gitlab-ee/yum/el7/
repo_gpgcheck=0
gpgcheck=0
enabled=1

EOF

sudo yum clean all

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ee

# 列出可用版本: sudo yum --showduplicates list gitlab-ee
# 安装指定版本: sudo yum install -y gitlab-ee-17.1.1

# 如果上述安装命令未指定域名，需要手动执行一次配置
# sudo gitlab-ctl reconfigure
```

```shell [南京大学源-ce]
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld

cat <<EOF | tee /etc/yum.repos.d/gitlab_gitlab-ce.repo
[gitlab_gitlab-ce]
name=gitlab_gitlab-ce
baseurl=https://mirrors.nju.edu.cn/gitlab-ce/yum/el7/
repo_gpgcheck=0
gpgcheck=0
enabled=1

EOF

sudo yum clean all

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ce

# 列出可用版本: sudo yum --showduplicates list gitlab-ce
# 安装指定版本: sudo yum install -y gitlab-ce-17.1.1

# 如果上述安装命令未指定域名，需要手动执行一次配置
# sudo gitlab-ctl reconfigure
```

```shell [官方源-ee]
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld

cat <<EOF | tee /etc/yum.repos.d/gitlab_gitlab-ee.repo
[gitlab_gitlab-ee]
name=gitlab_gitlab-ee
baseurl=https://packages.gitlab.com/gitlab/gitlab-ee/el/7/\$basearch
repo_gpgcheck=1
gpgcheck=1
enabled=1
gpgkey=https://packages.gitlab.com/gitlab/gitlab-ee/gpgkey
       https://packages.gitlab.com/gitlab/gitlab-ee/gpgkey/gitlab-gitlab-ee-3D645A26AB9FBD22.pub.gpg
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
metadata_expire=300

EOF

sudo yum clean all

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ee

# 列出可用版本: sudo yum --showduplicates list gitlab-ee
# 安装指定版本: sudo yum install -y gitlab-ee-17.3.2

# 如果上述安装命令未指定域名，需要手动执行一次配置
# sudo gitlab-ctl reconfigure
```

```shell [官方源-ce]
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld

cat <<EOF | tee /etc/yum.repos.d/gitlab_gitlab-ce.repo
[gitlab_gitlab-ce]
name=gitlab_gitlab-ce
baseurl=https://packages.gitlab.com/gitlab/gitlab-ce/el/7/\$basearch
repo_gpgcheck=1
gpgcheck=1
enabled=1
gpgkey=https://packages.gitlab.com/gitlab/gitlab-ce/gpgkey
       https://packages.gitlab.com/gitlab/gitlab-ce/gpgkey/gitlab-gitlab-ce-3D645A26AB9FBD22.pub.gpg
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
metadata_expire=300

EOF

sudo yum clean all

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ce

# 列出可用版本: sudo yum --showduplicates list gitlab-ce
# 安装指定版本: sudo yum install -y gitlab-ce-17.3.2

# 如果上述安装命令未指定域名，需要手动执行一次配置
# sudo gitlab-ctl reconfigure
```

:::

### 基于 <strong><font color="red">CentOS 8</font></strong> 的系统

::: code-group

```shell [极狐源]
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld

cat <<EOF | tee /etc/yum.repos.d/gitlab-jh.repo
[gitlab-jh]
name=JiHu GitLab
baseurl=https://packages.gitlab.cn/repository/el/8/
gpgcheck=0
gpgkey=https://packages.gitlab.cn/repository/raw/gpg/public.gpg.key
priority=1
enabled=1

EOF

sudo yum clean all

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-jh

# 列出可用版本: sudo yum --showduplicates list gitlab-jh
# 安装指定版本: sudo yum install -y gitlab-jh-17.3.2

# 如果上述安装命令未指定域名，需要手动执行一次配置
# sudo gitlab-ctl reconfigure
```

```shell [南京大学源-ee]
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld

cat <<EOF | tee /etc/yum.repos.d/gitlab_gitlab-ee.repo
[gitlab_gitlab-ee]
name=gitlab_gitlab-ee
baseurl=https://mirrors.nju.edu.cn/gitlab-ee/yum/el8/
repo_gpgcheck=0
gpgcheck=0
enabled=1

EOF

sudo yum clean all

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ee

# 列出可用版本: sudo yum --showduplicates list gitlab-ee
# 安装指定版本: sudo yum install -y gitlab-ee-17.1.1

# 如果上述安装命令未指定域名，需要手动执行一次配置
# sudo gitlab-ctl reconfigure
```

```shell [南京大学源-ce]
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld

cat <<EOF | tee /etc/yum.repos.d/gitlab_gitlab-ce.repo
[gitlab_gitlab-ce]
name=gitlab_gitlab-ce
baseurl=https://mirrors.nju.edu.cn/gitlab-ce/yum/el8/
repo_gpgcheck=0
gpgcheck=0
enabled=1

EOF

sudo yum clean all

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ce

# 列出可用版本: sudo yum --showduplicates list gitlab-ce
# 安装指定版本: sudo yum install -y gitlab-ce-17.1.1

# 如果上述安装命令未指定域名，需要手动执行一次配置
# sudo gitlab-ctl reconfigure
```

```shell [官方源-ee]
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld

cat <<EOF | tee /etc/yum.repos.d/gitlab_gitlab-ee.repo
[gitlab_gitlab-ee]
name=gitlab_gitlab-ee
baseurl=https://packages.gitlab.com/gitlab/gitlab-ee/el/8/\$basearch
repo_gpgcheck=1
gpgcheck=1
enabled=1
gpgkey=https://packages.gitlab.com/gitlab/gitlab-ee/gpgkey
       https://packages.gitlab.com/gitlab/gitlab-ee/gpgkey/gitlab-gitlab-ee-3D645A26AB9FBD22.pub.gpg
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
metadata_expire=300

EOF

sudo yum clean all

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ee

# 列出可用版本: sudo yum --showduplicates list gitlab-ee
# 安装指定版本: sudo yum install -y gitlab-ee-17.3.2

# 如果上述安装命令未指定域名，需要手动执行一次配置
# sudo gitlab-ctl reconfigure
```

```shell [官方源-ce]
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld

cat <<EOF | tee /etc/yum.repos.d/gitlab_gitlab-ce.repo
[gitlab_gitlab-ce]
name=gitlab_gitlab-ce
baseurl=https://packages.gitlab.com/gitlab/gitlab-ce/el/8/\$basearch
repo_gpgcheck=1
gpgcheck=1
enabled=1
gpgkey=https://packages.gitlab.com/gitlab/gitlab-ce/gpgkey
       https://packages.gitlab.com/gitlab/gitlab-ce/gpgkey/gitlab-gitlab-ce-3D645A26AB9FBD22.pub.gpg
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
metadata_expire=300

EOF

sudo yum clean all

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ce

# 列出可用版本: sudo yum --showduplicates list gitlab-ce
# 安装指定版本: sudo yum install -y gitlab-ce-17.3.2

# 如果上述安装命令未指定域名，需要手动执行一次配置
# sudo gitlab-ctl reconfigure
```

:::

### 基于 <strong><font color="red">CentOS 9</font></strong> 的系统

::: code-group

```shell [极狐源]
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld

cat <<EOF | tee /etc/yum.repos.d/gitlab-jh.repo
[gitlab-jh]
name=JiHu GitLab
baseurl=https://packages.gitlab.cn/repository/el/9/
gpgcheck=0
gpgkey=https://packages.gitlab.cn/repository/raw/gpg/public.gpg.key
priority=1
enabled=1

EOF

sudo yum clean all

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-jh

# 列出可用版本: sudo yum --showduplicates list gitlab-jh
# 安装指定版本: sudo yum install -y gitlab-jh-17.3.2

# 如果上述安装命令未指定域名，需要手动执行一次配置
# sudo gitlab-ctl reconfigure
```

```shell [清华大学源-ee]
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld

cat <<EOF | tee /etc/yum.repos.d/gitlab_gitlab-ee.repo
[gitlab_gitlab-ee]
name=gitlab_gitlab-ee
baseurl=https://mirrors.tuna.tsinghua.edu.cn/gitlab-ee/yum/el9/
repo_gpgcheck=0
gpgcheck=0
enabled=1

EOF

sudo yum clean all

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ee

# 列出可用版本: sudo yum --showduplicates list gitlab-ee
# 安装指定版本: sudo yum install -y gitlab-ee-17.1.1

# 如果上述安装命令未指定域名，需要手动执行一次配置
# sudo gitlab-ctl reconfigure
```

```shell [清华大学源-ce]
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld

cat <<EOF | tee /etc/yum.repos.d/gitlab_gitlab-ce.repo
[gitlab_gitlab-ce]
name=gitlab_gitlab-ce
baseurl=https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el9/
repo_gpgcheck=0
gpgcheck=0
enabled=1

EOF

sudo yum clean all

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ce

# 列出可用版本: sudo yum --showduplicates list gitlab-ce
# 安装指定版本: sudo yum install -y gitlab-ce-17.1.1

# 如果上述安装命令未指定域名，需要手动执行一次配置
# sudo gitlab-ctl reconfigure
```

```shell [南京大学源-ee]
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld

cat <<EOF | tee /etc/yum.repos.d/gitlab_gitlab-ee.repo
[gitlab_gitlab-ee]
name=gitlab_gitlab-ee
baseurl=https://mirrors.nju.edu.cn/gitlab-ee/yum/el9/
repo_gpgcheck=0
gpgcheck=0
enabled=1

EOF

sudo yum clean all

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ee

# 列出可用版本: sudo yum --showduplicates list gitlab-ee
# 安装指定版本: sudo yum install -y gitlab-ee-17.1.1

# 如果上述安装命令未指定域名，需要手动执行一次配置
# sudo gitlab-ctl reconfigure
```

```shell [南京大学源-ce]
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld

cat <<EOF | tee /etc/yum.repos.d/gitlab_gitlab-ce.repo
[gitlab_gitlab-ce]
name=gitlab_gitlab-ce
baseurl=https://mirrors.nju.edu.cn/gitlab-ce/yum/el9/
repo_gpgcheck=0
gpgcheck=0
enabled=1

EOF

sudo yum clean all

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ce

# 列出可用版本: sudo yum --showduplicates list gitlab-ce
# 安装指定版本: sudo yum install -y gitlab-ce-17.1.1

# 如果上述安装命令未指定域名，需要手动执行一次配置
# sudo gitlab-ctl reconfigure
```

```shell [官方源-ee]
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld

cat <<EOF | tee /etc/yum.repos.d/gitlab_gitlab-ee.repo
[gitlab_gitlab-ee]
name=gitlab_gitlab-ee
baseurl=https://packages.gitlab.com/gitlab/gitlab-ee/el/9/\$basearch
repo_gpgcheck=1
gpgcheck=1
enabled=1
gpgkey=https://packages.gitlab.com/gitlab/gitlab-ee/gpgkey
       https://packages.gitlab.com/gitlab/gitlab-ee/gpgkey/gitlab-gitlab-ee-3D645A26AB9FBD22.pub.gpg
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
metadata_expire=300

EOF

sudo yum clean all

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ee

# 列出可用版本: sudo yum --showduplicates list gitlab-ee
# 安装指定版本: sudo yum install -y gitlab-ee-17.3.2

# 如果上述安装命令未指定域名，需要手动执行一次配置
# sudo gitlab-ctl reconfigure
```

```shell [官方源-ce]
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld

cat <<EOF | tee /etc/yum.repos.d/gitlab_gitlab-ce.repo
[gitlab_gitlab-ce]
name=gitlab_gitlab-ce
baseurl=https://packages.gitlab.com/gitlab/gitlab-ce/el/9/\$basearch
repo_gpgcheck=1
gpgcheck=1
enabled=1
gpgkey=https://packages.gitlab.com/gitlab/gitlab-ce/gpgkey
       https://packages.gitlab.com/gitlab/gitlab-ce/gpgkey/gitlab-gitlab-ce-3D645A26AB9FBD22.pub.gpg
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
metadata_expire=300

EOF

sudo yum clean all

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ce

# 列出可用版本: sudo yum --showduplicates list gitlab-ce
# 安装指定版本: sudo yum install -y gitlab-ce-17.3.2

# 如果上述安装命令未指定域名，需要手动执行一次配置
# sudo gitlab-ctl reconfigure
```

:::

## 查看 root 用户默认密码 {id=initial_root_password}

```shell
# 用户名为 root
sudo cat /etc/gitlab/initial_root_password
```

### 修改密码 {id=edit-password}

1. `http://GitLab服务器IP/-/profile/password/edit` ，如：http://192.168.80.14/-/profile/password/edit

2. `http://gitlab.example.com/-/profile/password/edit` ，需要修改本地 hosts 文件指定服务器的 IP

### 将语言调整为中文 

1. `http://GitLab服务器IP/-/profile/preferences` ，如：http://192.168.80.14/-/profile/preferences

2. `http://gitlab.example.com/-/profile/preferences` ，需要修改本地 hosts 文件指定服务器的 IP

3. 将 **Language** 修改为 **Chinese, Simplified - 简体中文**，刷新页面即可显示中文

### 相关命令

| 说明               | 命令                                               |
|------------------|--------------------------------------------------|
| 查看 GitLab 状态     | `sudo systemctl status gitlab-runsvdir.service`  |
| 停止 GitLab        | `sudo systemctl stop gitlab-runsvdir.service`    |
| 重启 GitLab        | `sudo systemctl restart gitlab-runsvdir.service` |
| 启动 GitLab        | `sudo systemctl start gitlab-runsvdir.service`   |
| 查看 GitLab 开机自启状态 | `systemctl is-enabled gitlab-runsvdir.service`   |
| 关闭 GitLab 开启自启   | `sudo systemctl disable gitlab-runsvdir.service` |
| 开启 GitLab 开启自启   | `sudo systemctl enable gitlab-runsvdir.service`  |
| 查看 GitLab 各服务的状态 | `sudo gitlab-ctl status`                         |
| 停止 GitLab 某个服务   | `sudo gitlab-ctl stop 服务名`                       |
| 重启 GitLab 某个服务   | `sudo gitlab-ctl restart 服务名`                    |
| 启动 GitLab 某个服务   | `sudo gitlab-ctl start 服务名`                      |
