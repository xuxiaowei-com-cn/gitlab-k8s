# 安装 GitLab {id=gitlab}

## 文档 {id=doc}

|           | 中文文档                       | 英文文档                              |
|-----------|----------------------------|-----------------------------------|
| 安装 GitLab | https://gitlab.cn/install/ | https://about.gitlab.com/install/ |

## CentOS 安装 GitLab {id=centos-install-gitlab}

::: warning 警告

1. 安装文档为最小化安装，暂不涉及邮件等依赖，后续文档会介绍
2. 国内镜像同步可能存在不及时的情况
3. 可能存在国内镜像未同步对应系统版本的情况，如：清华大学只同步了 CentOS 7 和 9，没有同步 CentOS 8，根据自身情况，选择接近的版本或使用其他镜像

:::

::: code-group

```shell [极狐源]
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld

curl -L get.gitlab.cn | bash

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-jh

# 列出可用版本: sudo yum --showduplicates list gitlab-jh
# 安装指定版本: sudo yum install -y gitlab-jh-17.3.2
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

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ee

# 列出可用版本: sudo yum --showduplicates list gitlab-ee
# 安装指定版本: sudo yum install -y gitlab-ee-17.1.1
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

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ce

# 列出可用版本: sudo yum --showduplicates list gitlab-ce
# 安装指定版本: sudo yum install -y gitlab-ce-17.1.1
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

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ee

# 列出可用版本: sudo yum --showduplicates list gitlab-ee
# 安装指定版本: sudo yum install -y gitlab-ee-17.1.1
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

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ce

# 列出可用版本: sudo yum --showduplicates list gitlab-ce
# 安装指定版本: sudo yum install -y gitlab-ce-17.1.1
```

```shell [官方源-ee]
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld

curl https://packages.gitlab.com/install/repositories/gitlab/gitlab-ee/script.rpm.sh | sudo bash

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ee

# 列出可用版本: sudo yum --showduplicates list gitlab-ee
# 安装指定版本: sudo yum install -y gitlab-ee-17.3.2
```

```shell [官方源-ce]
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo systemctl reload firewalld

curl https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.rpm.sh | sudo bash

# 指定 GitLab 实例地址：http://gitlab.example.com
sudo EXTERNAL_URL="http://gitlab.example.com" yum install -y gitlab-ce

# 列出可用版本: sudo yum --showduplicates list gitlab-ce
# 安装指定版本: sudo yum install -y gitlab-ce-17.3.2
```

:::
