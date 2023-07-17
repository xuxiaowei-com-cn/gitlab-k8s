---
sidebar_position: 1
---

# CentOS 安装 GitLab Runner

基于 CentOS 和 GitLab 官方仓库脚本 安装/配置 GitLab Runner

## 文档

1. 安装 GitLab Runner
    1. [极狐 GitLab 中文文档](https://docs.gitlab.cn/runner/install/linux-repository.html)
    2. [gitlab-ee](https://docs.gitlab.com/runner/install/linux-repository.html)
2. 自签名证书或自定义证书颁发机构
    1. [极狐 GitLab 中文文档](https://docs.gitlab.cn/runner/configuration/tls-self-signed.html)
    2. [gitlab-ee](https://docs.gitlab.com/runner/configuration/tls-self-signed.html)
3. 配置 Runner
    1. [极狐 GitLab 中文文档](https://docs.gitlab.cn/jh/ci/runners/configure_runners.html)
    2. [gitlab-ee](https://docs.gitlab.com/ee/ci/runners/configure_runners.html)
4. [gitlab runner 最新版手动下载](https://gitlab-runner-downloads.s3.amazonaws.com/latest/index.html)
    1. [v15.6.0 手动下载](https://gitlab-runner-downloads.s3.amazonaws.com/v15.6.0/index.html)
5. 自签名证书或自定义证书颁发机构
    1. [极狐 GitLab 中文文档](https://docs.gitlab.cn/runner/configuration/tls-self-signed.html)
    2. [gitlab-ee](https://docs.gitlab.com/runner/configuration/tls-self-signed.html)
6. GitLab Runner 高级配置
    1. [极狐 GitLab 中文文档](https://docs.gitlab.cn/runner/configuration/advanced-configuration.html)
    2. [gitlab-ee](https://docs.gitlab.com/runner/configuration/advanced-configuration.html)

## 安装 GitLab Runner

1. 安装

   ```shell
   curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.rpm.sh | sudo bash
   yum -y install gitlab-runner
   ```

2. 使用 root 用户运行 GitLab Runner

    1. __根据用户的需要操作此步骤，让 GitLab Runner 使用 root 用户运行流水线，可能会带来风险，如：流水线中写了 rm -rf /\*\*
       __
    2. **推荐使用 Docker 执行前，防止出现上述情况**

   ```shell
   # 以下设置在升级 GitLab Runner 后将失效，需要重新设置一次
   
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

3. 配置证书信任

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
   
   #
   #
   
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

4. 注册 GitLab Runner

   ```shell
   gitlab-runner register
   ```

5. 提示：**Enter the GitLab instance URL (for example, https://gitlab.com/):**

   输入 GitLab 的地址

   ```shell
   https://192.168.80.14
   # https://gitlab.example.com/
   ```

6. 提示：**Enter the registration token:**

   ```shell
   # 复制 https://192.168.80.14/admin/runners 页面中的 token（点击：注册一个Runner即可获取）
   # 复制 https://gitlab.example.com/admin/runners 页面中的 token（点击：注册一个Runner即可获取）
   6iuLhyWxqypcyaNtUG_C
   ```

7. 提示：**Enter a description for the runner:**

   输入流水线的名称，默认为 CentOS 主机名

8. 提示：**Enter tags for the runner (comma-separated):**

   输入流水线的标签名（**非Git仓库的标签**），即：.gitlab-ci.yml 文件中标签，可为空，**为空时允许所有未指定标签的流水线使用，可在GitLab页面中进行随时调整
   **

9. 提示：**Enter optional maintenance note for the runner:**

   输入流水线的描述，可为空

10. 提示：**Registering runner... succeeded runner=6iuLhyWx**<br/>
    **Enter an executor: docker, docker-ssh, parallels, shell, docker-ssh+machine, instance, kubernetes, custom, ssh,
    virtualbox, docker+machine:**

    **选择流水线执行器**

    ```shell
    # 输入 docker，用于后面的 GitLab Pages 做准备
    docker
    ```

11. 提示：**Enter the default Docker image (for example, ruby:2.7):**

    输入默认docker镜像

12. 出现下列语句，说明流水线已注册成功：
    /etc/gitlab-runner/config.toml 是GitLab Runner配置文件的位置

    ```shell
    Runner registered successfully. Feel free to start it, but if it's running already the config should be automatically reloaded!
     
    Configuration (with the authentication token) was saved in "/etc/gitlab-runner/config.toml" 
    ```

13. 修改流水线配置，使其同时可以执行多个任务

    ```shell
    vim /etc/gitlab-runner/config.toml
    ```

    ```shell
    # 同一时间支持运行的最大任务数
    concurrent = 10
    ```

14. 在以下地址中可看到流水线的状态
    1. [https://gitlab.example.com/admin/runners](https://gitlab.example.com/admin/runners)
    2. [https://192.168.61.129/admin/runners](https://192.168.61.129/admin/runners)

15. 列出所有

    ```shell
    gitlab-runner list
    ```

16. 查看状态

    ```shell
    gitlab-runner status
    ```

17. 停止

    ```shell
    gitlab-runner stop
    ```

18. 启动

    ```shell
    gitlab-runner start
    ```
