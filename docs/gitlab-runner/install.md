# 安装 GitLab Runner {id=gitlab-runner}

[[toc]]

## 文档 {id=doc}

1. 安装 GitLab Runner
    1. [GitLab 中文文档](https://docs.gitlab.cn/runner/install/linux-repository.html)
    2. [gitlab-ee](https://docs.gitlab.com/runner/install/linux-repository.html)
2. 自签名证书或自定义证书颁发机构
    1. [GitLab 中文文档](https://docs.gitlab.cn/runner/configuration/tls-self-signed.html)
    2. [gitlab-ee](https://docs.gitlab.com/runner/configuration/tls-self-signed.html)
3. 配置 Runner
    1. [GitLab 中文文档](https://docs.gitlab.cn/jh/ci/runners/configure_runners.html)
    2. [gitlab-ee](https://docs.gitlab.com/ee/ci/runners/configure_runners.html)
4. [gitlab runner 最新版手动下载](https://gitlab-runner-downloads.s3.amazonaws.com/latest/index.html)
    1. [v15.6.0 手动下载](https://gitlab-runner-downloads.s3.amazonaws.com/v15.6.0/index.html)
5. 自签名证书或自定义证书颁发机构
    1. [GitLab 中文文档](https://docs.gitlab.cn/runner/configuration/tls-self-signed.html)
    2. [gitlab-ee](https://docs.gitlab.com/runner/configuration/tls-self-signed.html)
6. GitLab Runner 高级配置
    1. [GitLab 中文文档](https://docs.gitlab.cn/runner/configuration/advanced-configuration.html)
    2. [gitlab-ee](https://docs.gitlab.com/runner/configuration/advanced-configuration.html)

## CentOS 安装 GitLab Runner {id=centos-install-gitlab-runner}

::: code-group

```shell [极狐源]
cat <<EOF | tee /etc/yum.repos.d/runner_gitlab-runner.repo 
[runner_gitlab-runner]
name=runner_gitlab-runner
baseurl=https://packages.gitlab.cn/repository/runner-rpm/el/\$releasever/\$basearch
repo_gpgcheck=0
gpgcheck=0
enabled=1

EOF

sudo yum -y install gitlab-runner
```

```shell [腾讯源]
cat <<EOF | tee /etc/yum.repos.d/runner_gitlab-runner.repo 
[runner_gitlab-runner]
name=runner_gitlab-runner
baseurl=https://mirrors.cloud.tencent.com/gitlab-runner/yum/el\$releasever-\$basearch
repo_gpgcheck=0
gpgcheck=0
enabled=1

EOF

sudo yum -y install gitlab-runner
```

```shell [清华大学源]
cat <<EOF | tee /etc/yum.repos.d/runner_gitlab-runner.repo 
[runner_gitlab-runner]
name=runner_gitlab-runner
baseurl=https://mirrors.tuna.tsinghua.edu.cn/gitlab-runner/yum/el\$releasever-\$basearch
repo_gpgcheck=0
gpgcheck=0
enabled=1

EOF

sudo yum -y install gitlab-runner
```

```shell [南京大学源]
cat <<EOF | tee /etc/yum.repos.d/runner_gitlab-runner.repo 
[runner_gitlab-runner]
name=runner_gitlab-runner
baseurl=https://mirrors.nju.edu.cn/gitlab-runner/yum/el\$releasever-\$basearch
repo_gpgcheck=0
gpgcheck=0
enabled=1

EOF

sudo yum -y install gitlab-runner
```

```shell [官方源]
curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.rpm.sh | sudo bash
sudo yum -y install gitlab-runner
```

:::

## 类 CentOS 安装 GitLab Runner {id=similar-centos-install-gitlab-runner}

::: warning 警告

1. 如果需要安装 GitLab Runner 的操作系统不是 CentOS，而是 CentOS 系列的操作系统（比如：可以使用 yum 安装软件），
   可使用下方命令安装 GitLab Runner
2. 若操作系统基于 CentOS 7/8/9 发布，则可以选择下方对应的命令
3. 若无法确定操作系统基于 CentOS 几 发布，根据尝试下方的 3 个选择

:::

1. 基于 <strong><font color="red">CentOS 7</font></strong> 的系统

   ::: code-group

   ```shell [极狐源]
   cat <<EOF | tee /etc/yum.repos.d/runner_gitlab-runner.repo 
   [runner_gitlab-runner]
   name=runner_gitlab-runner
   baseurl=https://packages.gitlab.cn/repository/runner-rpm/el/7/\$basearch
   repo_gpgcheck=0
   gpgcheck=0
   enabled=1
   
   EOF
   
   sudo yum -y install gitlab-runner
   ```

   ```shell [腾讯源]
   cat <<EOF | tee /etc/yum.repos.d/runner_gitlab-runner.repo 
   [runner_gitlab-runner]
   name=runner_gitlab-runner
   baseurl=https://mirrors.cloud.tencent.com/gitlab-runner/yum/el7-\$basearch
   repo_gpgcheck=0
   gpgcheck=0
   enabled=1
   
   EOF
   
   sudo yum -y install gitlab-runner
   ```

   ```shell [清华大学源]
   cat <<EOF | tee /etc/yum.repos.d/runner_gitlab-runner.repo 
   [runner_gitlab-runner]
   name=runner_gitlab-runner
   baseurl=https://mirrors.tuna.tsinghua.edu.cn/gitlab-runner/yum/el7-\$basearch
   repo_gpgcheck=0
   gpgcheck=0
   enabled=1
   
   EOF
   
   sudo yum -y install gitlab-runner
   ```

   ```shell [南京大学源]
   cat <<EOF | tee /etc/yum.repos.d/runner_gitlab-runner.repo 
   [runner_gitlab-runner]
   name=runner_gitlab-runner
   baseurl=https://mirrors.nju.edu.cn/gitlab-runner/yum/el7-\$basearch
   repo_gpgcheck=0
   gpgcheck=0
   enabled=1
   
   EOF
   
   sudo yum -y install gitlab-runner
   ```

   ```shell [官方源]
   sudo curl 'https://packages.gitlab.com/install/repositories/runner/gitlab-runner/config_file.repo?os=centos&dist=7&source=script' --header 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36' > /etc/yum.repos.d/runner_gitlab-runner.repo
   sudo yum -y install gitlab-runner
   ```

   :::

2. 基于 <strong><font color="red">CentOS 8</font></strong> 的系统

   ::: code-group

   ```shell [极狐源]
   cat <<EOF | tee /etc/yum.repos.d/runner_gitlab-runner.repo 
   [runner_gitlab-runner]
   name=runner_gitlab-runner
   baseurl=https://packages.gitlab.cn/repository/runner-rpm/el/8/\$basearch
   repo_gpgcheck=0
   gpgcheck=0
   enabled=1
   
   EOF
   
   sudo yum -y install gitlab-runner
   ```

   ```shell [南京大学源]
   cat <<EOF | tee /etc/yum.repos.d/runner_gitlab-runner.repo 
   [runner_gitlab-runner]
   name=runner_gitlab-runner
   baseurl=https://mirrors.nju.edu.cn/gitlab-runner/yum/el8-\$basearch
   repo_gpgcheck=0
   gpgcheck=0
   enabled=1
   
   EOF
   
   sudo yum -y install gitlab-runner
   ```

   ```shell [官方源]
   sudo curl 'https://packages.gitlab.com/install/repositories/runner/gitlab-runner/config_file.repo?os=centos&dist=8&source=script' --header 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36' > /etc/yum.repos.d/runner_gitlab-runner.repo
   sudo yum -y install gitlab-runner
   ```

   :::

3. 基于 <strong><font color="red">CentOS 9</font></strong> 的系统

   ::: code-group

   ```shell [极狐源]
   cat <<EOF | tee /etc/yum.repos.d/runner_gitlab-runner.repo 
   [runner_gitlab-runner]
   name=runner_gitlab-runner
   baseurl=https://packages.gitlab.cn/repository/runner-rpm/el/9/\$basearch
   repo_gpgcheck=0
   gpgcheck=0
   enabled=1
   
   EOF
   
   sudo yum -y install gitlab-runner
   ```

   ```shell [腾讯源]
   cat <<EOF | tee /etc/yum.repos.d/runner_gitlab-runner.repo 
   [runner_gitlab-runner]
   name=runner_gitlab-runner
   baseurl=https://mirrors.cloud.tencent.com/gitlab-runner/yum/el9-\$basearch
   repo_gpgcheck=0
   gpgcheck=0
   enabled=1
   
   EOF
   
   sudo yum -y install gitlab-runner
   ```

   ```shell [清华大学源]
   cat <<EOF | tee /etc/yum.repos.d/runner_gitlab-runner.repo 
   [runner_gitlab-runner]
   name=runner_gitlab-runner
   baseurl=https://mirrors.tuna.tsinghua.edu.cn/gitlab-runner/yum/el9-\$basearch
   repo_gpgcheck=0
   gpgcheck=0
   enabled=1
   
   EOF
   
   sudo yum -y install gitlab-runner
   ```

   ```shell [南京大学源]
   cat <<EOF | tee /etc/yum.repos.d/runner_gitlab-runner.repo 
   [runner_gitlab-runner]
   name=runner_gitlab-runner
   baseurl=https://mirrors.nju.edu.cn/gitlab-runner/yum/el9-\$basearch
   repo_gpgcheck=0
   gpgcheck=0
   enabled=1
   
   EOF
   
   sudo yum -y install gitlab-runner
   ```

   ```shell [官方源]
   sudo curl 'https://packages.gitlab.com/install/repositories/runner/gitlab-runner/config_file.repo?os=centos&dist=9&source=script' --header 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36' > /etc/yum.repos.d/runner_gitlab-runner.repo
   sudo yum -y install gitlab-runner
   ```

   :::

## 使用 root 用户运行 GitLab Runner {id=use-root-run}

::: warning 警告

1. 以下设置在升级 GitLab Runner 后将失效，需要重新设置一次
2. 使用 root 用户执行流水线可能会涉及流水线危险操作，如：使用 Shell 执行器执行 `rm -rf /`
3. 推荐使用 Docker 执行器

:::

```shell
# 查看当前 runner 运行的用户
ps aux | grep gitlab-runner

# 删除gitlab-runner
sudo gitlab-runner uninstall

# 安装并设置--user(例如我想设置为root)
gitlab-runner install --working-directory /home/gitlab-runner --user root

# 重启gitlab-runner
sudo service gitlab-runner restart

# 再次执行会发现--user的用户名已经更换成root了 
ps aux | grep gitlab-runner
```

## 配置证书信任 {id=trust-certificate}

### 异常 {id=runner-exception}

```shell
# 自己生成的证书，如果不进行信任，注册时可能出现的问题：
# ERROR: Registering runner... failed                 runner=6iuLhyWx status=couldn't execute POST against https://gitlab.example.com/api/v4/runners: Post "https://gitlab.example.com/api/v4/runners": x509: certificate is not valid for any names, but wanted to match gitlab.example.com

# 下列执行时，需要本机能使用 GitLab 域名访问
# 可以修改 本机 /etc/hosts 文件解决

# 如果域名未解析，会出现
# ERROR: Registering runner... failed                 runner=z4uLTqoa status=couldn't execute POST against https://gitlab.example.com/api/v4/runners: Post "https://gitlab.example.com/api/v4/runners": dial tcp: lookup gitlab.example.com on 192.168.61.2:53: no such host

# 如果创建证书时，未设置“Common Name (e.g. server FQDN or YOUR name) []”时，会出现
# ERROR: Registering runner... failed                 runner=z4uLTqoa status=couldn't execute POST against https://gitlab.example.com/api/v4/runners: Post "https://gitlab.example.com/api/v4/runners": x509: certificate is not valid for any names, but wanted to match gitlab.example.com

# 重新设置了域名证书，需要执行 sudo gitlab-ctl restart，如果修改了 /etc/gitlab/gitlab.rb 文件，需要先执行 sudo gitlab-ctl reconfigure，再执行 sudo gitlab-ctl restart

# 生成的证书不满足GitLab Runner的检查时，会出现下列错误，请根据前面章节中的内容重新生成
# ERROR: Registering runner... failed                 runner=z4uLTqoa status=couldn't execute POST against https://gitlab.example.com/api/v4/runners: Post "https://gitlab.example.com/api/v4/runners": x509: certificate relies on legacy Common Name field, use SANs instead

# 如果域名证书未生效，或者已过期，会出现下面的错误
# x509: certificate has expired or is not yet valid: current time 2022-11-15T20:45:12+08:00 is before 2022-11-15T19:49:27Z
```

### 信任域名命令 {id=trust-certificate-command}

```shell
sudo mkdir -p /etc/gitlab-runner/certs

# 本文使用域名是IP：192.168.80.14
# 可根据自己的需要，修改下方的域名及端口

# 使用客户端下载 GitLab 实例的证书
openssl s_client -showcerts -connect 192.168.80.14:443 -servername 192.168.80.14 < /dev/null 2>/dev/null | openssl x509 -outform PEM > /etc/gitlab-runner/certs/192.168.80.14.crt
# openssl s_client -showcerts -connect gitlab.example.com:443 -servername gitlab.example.com < /dev/null 2>/dev/null | openssl x509 -outform PEM > /etc/gitlab-runner/certs/gitlab.example.com.crt

# 验证文件是否已正确安装
echo | openssl s_client -CAfile /etc/gitlab-runner/certs/192.168.80.14.crt -connect 192.168.80.14:443 -servername 192.168.80.14
# echo | openssl s_client -CAfile /etc/gitlab-runner/certs/gitlab.example.com.crt -connect gitlab.example.com:443 -servername gitlab.example.com
```

### 自动生成信任域名命令 {id=automatically-trust-certificate-command}

<GitLabRunnerTrustCertificate />

## 注册 GitLab Runner {id=gitlab-runner-register}

1. 注册 GitLab Runner

   ```shell
   gitlab-runner register
   ```

2. 提示：**Enter the GitLab instance URL (for example, https://gitlab.com/):**

   输入 GitLab 的地址

   ```shell
   https://192.168.80.14
   # https://gitlab.example.com/
   ```

3. 提示：**Enter the registration token:**

   ```shell
   # 复制 https://192.168.80.14/admin/runners 页面中的 token（点击：注册一个Runner即可获取）
   # 复制 https://gitlab.example.com/admin/runners 页面中的 token（点击：注册一个Runner即可获取）
   6iuLhyWxqypcyaNtUG_C
   ```

4. 提示：**Enter a description for the runner:**

   输入流水线的名称，默认为 CentOS 主机名

5. 提示：**Enter tags for the runner (comma-separated):**

   输入流水线的标签名（**非Git仓库的标签**），即：.gitlab-ci.yml 文件中标签，可为空，**为空时允许所有未指定标签的流水线使用，可在GitLab页面中进行随时调整
   **

6. 提示：**Enter optional maintenance note for the runner:**

   输入流水线的描述，可为空

7. 提示：**Registering runner... succeeded runner=6iuLhyWx**<br/>
   **Enter an executor: `docker`, `docker-ssh`, `parallels`, `shell`, `docker-ssh+machine`, `instance`, `kubernetes`,
   `custom`, `ssh`, `virtualbox`, `docker+machine`:**

   **选择流水线执行器**

   ```shell
   # 输入 docker，用于后面的 GitLab Pages 做准备
   docker
   ```

8. 提示：**Enter the default Docker image (for example, ruby:2.7):**

   输入默认docker镜像

9. 出现下列语句，说明流水线已注册成功：
   /etc/gitlab-runner/config.toml 是GitLab Runner配置文件的位置

   ```shell
   Runner registered successfully. Feel free to start it, but if it's running already the config should be automatically reloaded!
     
   Configuration (with the authentication token) was saved in "/etc/gitlab-runner/config.toml" 
   ```

10. 修改流水线配置，使其同时可以执行多个任务

    ```shell
    vim /etc/gitlab-runner/config.toml
    ```

    ```shell
    # 同一时间支持运行的最大任务数
    concurrent = 10
    ```

11. 管理员在以下地址中可看到流水线的状态
    1. [https://gitlab.example.com/admin/runners](https://gitlab.example.com/admin/runners)
    2. [https://192.168.61.129/admin/runners](https://192.168.61.129/admin/runners)

12. 其他命令

| 说明   | 命令                      |
|------|-------------------------|
| 列出所有 | `gitlab-runner list`    |
| 查看状态 | `gitlab-runner status`  |
| 停止   | `gitlab-runner stop`    |
| 启动   | `gitlab-runner start`   |
| 重启   | `gitlab-runner restart` |
