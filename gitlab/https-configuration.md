# GitLab 配置 SSL/https

## 参考文档

1. [https://stackoverflow.com/questions/72711633/how-to-solve-this-errror-certificate-relies-on-legacy-common-name-field-use-sa](https://stackoverflow.com/questions/72711633/how-to-solve-this-errror-certificate-relies-on-legacy-common-name-field-use-sa)
2. [自签名证书或自定义证书颁发机构](https://docs.gitlab.cn/runner/configuration/tls-self-signed.html)

## 说明

1. GitLab https 使用的是 nginx 实现的
2. **本文使用的域名是IP 192.168.80.14（原因：如果使用域名，必须拥有这个域名的所有权，并增加解析才可以，要不然在 Docker
   容器中，无法使用域名检出代码，因为根据域名找不到DNS记录）**
3. **如果使用自己生成的证书，git
   检出代码、推送代码会失败，原因是无法验证证书的有效性，可以使用名 **`**git config --global http.sslVerify false**`**
   禁用ssl的验证**

## 生成证书

1. 如果有域名，可以使用域名申请免费的证书，下载 Nginx 证书即可
    1. [阿里云SSL(https)证书免费申请](https://yundun.console.aliyun.com/?p=cas#/certExtend/buy)
    2. [腾讯云SSL(https)证书免费申请](https://console.cloud.tencent.com/ssl)
    3. [华为云SSL(https)证书免费申请](https://console.huaweicloud.com/console/#/ccm/scs/certList)
    4. [百度云SSL(https)证书免费申请](https://console.bce.baidu.com/cas/#/cas/purchased/common/list)
2. 如果没有域名，可使用下列命令在 CentOS 上生成
3. 创建证书文件夹
   ```shell
   mkdir -p /etc/gitlab/ssl
   cd /etc/gitlab/ssl
   ```

4. 生成证书
   ```shell
   # 以 CentOS 为例
   # 如果出现 -bash: openssl: command not found，请安装 openssl：yum -y install openssl
   
   # 生成指定位数的 RSA 私钥：ca.key
   openssl genrsa -out ca.key 2048
   
   # 根据 RSA 私钥，生成 crt 证书：ca.crt
   # CN：设置你要使用的域名
   # -utf8：支持中文
   openssl req -new -x509 -days 3650 -key ca.key -subj "/C=CN/ST=山东/L=青岛/O=徐晓伟工作室/OU=徐晓伟工作室/CN=192.168.80.14/emailAddress=xuxiaowei@xuxiaowei.com.cn" -out ca.crt -utf8
   # openssl req -new -x509 -days 3650 -key ca.key -subj "/C=CN/ST=山东/L=青岛/O=徐晓伟工作室/OU=徐晓伟工作室/CN=gitlab.example.com/emailAddress=xuxiaowei@xuxiaowei.com.cn" -out ca.crt -utf8
   
   # 生成 server.csr、server.key
   # CN：设置你要使用的域名
   # -utf8：支持中文
   openssl req -newkey rsa:2048 -nodes -keyout server.key -subj "/C=CN/ST=山东/L=青岛/O=徐晓伟工作室/CN=192.168.80.14" -out server.csr -utf8
   # openssl req -newkey rsa:2048 -nodes -keyout server.key -subj "/C=CN/ST=山东/L=青岛/O=徐晓伟工作室/CN=gitlab.example.com" -out server.csr -utf8
   
   # 生成 ca.srl、server.crt
   # subjectAltName：设置 DNS、IP
   openssl x509 -req -extfile <(printf "subjectAltName=IP:192.168.80.14") -days 3650 -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt
   # openssl x509 -req -extfile <(printf "subjectAltName=DNS:gitlab.example.com") -days 3650 -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt
   ```

5. 最终生成了：ca.crt、ca.key、ca.srl、server.crt、server.csr、server.key，其中 **server.crt **和 **server.key** 就是 Nginx
   使用的证书

## 配置https

1. 安装 vim

    ```shell
    yum -y install vim
    ```

2. 编辑 gitlab.rb 文件

    ```shell
    vim /etc/gitlab/gitlab.rb
    ```

3. 修改内容如下

    ```shell
    # 填写你的域名，注意是https
    external_url 'https://192.168.80.14'
    # 如果使用的是域名，填写域名
    # external_url 'https://gitlab.example.com'
    
    # 对应上方域名的证书
    # 将证书放在 /etc/gitlab/ssl 文件夹中
    # 如果使用的是阿里云等平台颁发的证书，此处可以使用 Nginx 证书，ssl_certificate 使用 .pem 文件
    nginx['ssl_certificate'] = "/etc/gitlab/ssl/server.crt"
    nginx['ssl_certificate_key'] = "/etc/gitlab/ssl/server.key"
    
    # http 重定向到 https
    nginx['redirect_http_to_https'] = true
    
    # 禁用 Let's Encrypt 颁发证书
    letsencrypt['enable'] = false
    
    # 限制GitLab实例使用的IP（在使用域名时使用，注意浏览器缓存问题）
    # nginx['listen_addresses'] = ['192.168.80.14']
    ```

4. 重新配置 GitLab

    ```shell
    sudo gitlab-ctl reconfigure
    ```

5. 查看GitLab各服务的状态

    ```shell
    sudo gitlab-ctl status
    ```

6. 日志

    ```shell
    sudo gitlab-ctl tail nginx
    ```

7. 修改DNS（或者在本地 hosts 将域名指向 GitLab服务器IP），访问https://<GitLab域名> 即可（如果使用自己生成的证书，可能会提示*
   *您的连接不是私密连接**，忽略即可）。
