# 使用 kubeadm 生成 Kubernetes（k8s） 新证书 {id=ca-kubeadm}

[[toc]]

## 说明 {id=description}

- [PKI 证书和要求](https://kubernetes.io/zh-cn/docs/setup/best-practices/certificates/)

- [kubeadm certs](https://kubernetes.io/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-certs/)
    1. `kubeadm certs` 提供管理证书的工具。
    2. 关于如何使用这些命令的细节，可参见
       [使用 kubeadm 管理证书](https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)。

- [kubeadm config](https://kubernetes.io/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-config/)
    1. 在 `kubeadm init` 执行期间，kubeadm 将 `ClusterConfiguration` 对象上传 到你的集群的 `kube-system` 名字空间下名为
       `kubeadm-config` 的 ConfigMap 对象中。 然后在 `kubeadm join`、`kubeadm reset` 和 `kubeadm upgrade` 执行期间读取此配置。

- [kubeadm init](https://kubernetes.io/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/)
    1. 此命令初始化一个 Kubernetes 控制平面节点。
    2. 运行此命令以安装 Kubernetes 控制平面。

- [kubeadm init phase](https://kubernetes.io/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/)
    1. `kubeadm init phase` 能确保调用引导过程的原子步骤。 因此，如果希望自定义应用，则可以让 kubeadm 做一些工作，然后填补空白。
    2. `kubeadm init phase`
       与 [kubeadm init 工作流](https://kubernetes.io/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/#init-workflow)
       一致，后台都使用相同的代码。

- 本文主要演示从旧 IP 更新为新 IP 后，如何更新证书与配置文件
    1. `192.168.80.5` 是旧IP
    2. `192.168.80.201` 是新IP

- <strong><font color="red">本文档仅适用于非二进制安装的 k8s</font></strong>

- 查看日志
    ```shell
    journalctl -xefu kubelet
    ```

    1. 如果切换了新 IP，可能会出现日志

       旧 IP 是 `192.168.80.5`，切换成新 IP 后，旧 IP 无法访问了
        ```
        Jul 08 13:35:44 k8s kubelet[1786]: E0708 13:35:44.450765    1786 kubelet_node_status.go:540] "Error updating node status, will retry" err="error getting node \"k8s\": Get \"https://192.168.80.5:6443/api/v1/nodes/k8s?timeout=10s\": dial tcp 192.168.80.5:6443: connect: no route to host"
        ```

## 仅证书续期 {id=only-certs-renew}

若仅仅是续期证书，可只查看此节内容

1. 证书过期时的错误
    ```shell
    [root@xuxiaowei-bili ~]# kubectl get pod -A
    E0311 00:00:06.023685    5872 memcache.go:265] couldn't get current server API group list: Get "https://172.25.25.34:6443/api?timeout=32s": tls: failed to verify certificate: x509: certificate has expired or is not yet valid: current time 2025-03-11T00:00:06+08:00 is after 2025-03-09T13:28:43Z
    E0311 00:00:06.026931    5872 memcache.go:265] couldn't get current server API group list: Get "https://172.25.25.34:6443/api?timeout=32s": tls: failed to verify certificate: x509: certificate has expired or is not yet valid: current time 2025-03-11T00:00:06+08:00 is after 2025-03-09T13:28:43Z
    E0311 00:00:06.030140    5872 memcache.go:265] couldn't get current server API group list: Get "https://172.25.25.34:6443/api?timeout=32s": tls: failed to verify certificate: x509: certificate has expired or is not yet valid: current time 2025-03-11T00:00:06+08:00 is after 2025-03-09T13:28:43Z
    E0311 00:00:06.034092    5872 memcache.go:265] couldn't get current server API group list: Get "https://172.25.25.34:6443/api?timeout=32s": tls: failed to verify certificate: x509: certificate has expired or is not yet valid: current time 2025-03-11T00:00:06+08:00 is after 2025-03-09T13:28:43Z
    E0311 00:00:06.037254    5872 memcache.go:265] couldn't get current server API group list: Get "https://172.25.25.34:6443/api?timeout=32s": tls: failed to verify certificate: x509: certificate has expired or is not yet valid: current time 2025-03-11T00:00:06+08:00 is after 2025-03-09T13:28:43Z
    Unable to connect to the server: tls: failed to verify certificate: x509: certificate has expired or is not yet valid: current time 2025-03-11T00:00:06+08:00 is after 2025-03-09T13:28:43Z
    [root@xuxiaowei-bili ~]#
    ```
2. 查看证书有效期（`只能在主节点执行`）

   ::: code-group

    ```shell [查看证书有效期]
    kubeadm certs check-expiration
    ```

   :::

   ::: code-group

    ```shell [证书未过期]
    [root@xuxiaowei-bili ~]# kubeadm certs check-expiration
    [check-expiration] Reading configuration from the cluster...
    [check-expiration] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -o yaml'
    
    CERTIFICATE                EXPIRES                  RESIDUAL TIME   CERTIFICATE AUTHORITY   EXTERNALLY MANAGED
    admin.conf                 Mar 09, 2025 13:28 UTC   250d            ca                      no      
    apiserver                  Mar 09, 2025 13:28 UTC   250d            ca                      no      
    apiserver-etcd-client      Mar 09, 2025 13:28 UTC   250d            etcd-ca                 no      
    apiserver-kubelet-client   Mar 09, 2025 13:28 UTC   250d            ca                      no      
    controller-manager.conf    Mar 09, 2025 13:28 UTC   250d            ca                      no      
    etcd-healthcheck-client    Mar 09, 2025 13:28 UTC   250d            etcd-ca                 no      
    etcd-peer                  Mar 09, 2025 13:28 UTC   250d            etcd-ca                 no      
    etcd-server                Mar 09, 2025 13:28 UTC   250d            etcd-ca                 no      
    front-proxy-client         Mar 09, 2025 13:28 UTC   250d            front-proxy-ca          no      
    scheduler.conf             Mar 09, 2025 13:28 UTC   250d            ca                      no      
    super-admin.conf           Mar 09, 2025 13:28 UTC   250d            ca                      no
    
    CERTIFICATE AUTHORITY   EXPIRES                  RESIDUAL TIME   EXTERNALLY MANAGED
    ca                      Mar 07, 2034 13:28 UTC   9y              no      
    etcd-ca                 Mar 07, 2034 13:28 UTC   9y              no      
    front-proxy-ca          Mar 07, 2034 13:28 UTC   9y              no      
    [root@xuxiaowei-bili ~]#
    ```

    ```shell [证书已过期]
    [root@k8s ~]# kubeadm certs check-expiration
    [check-expiration] Reading configuration from the cluster...
    [check-expiration] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -o yaml'
    [check-expiration] Error reading configuration from the Cluster. Falling back to default configuration
    
    CERTIFICATE                EXPIRES                  RESIDUAL TIME   CERTIFICATE AUTHORITY   EXTERNALLY MANAGED
    admin.conf                 Sep 07, 2024 16:11 UTC   <invalid>       ca                      no      
    apiserver                  Sep 07, 2024 16:10 UTC   <invalid>       ca                      no      
    apiserver-etcd-client      Sep 07, 2024 16:11 UTC   <invalid>       etcd-ca                 no      
    apiserver-kubelet-client   Sep 07, 2024 16:10 UTC   <invalid>       ca                      no      
    controller-manager.conf    Sep 07, 2024 16:11 UTC   <invalid>       ca                      no      
    etcd-healthcheck-client    Sep 07, 2024 16:11 UTC   <invalid>       etcd-ca                 no      
    etcd-peer                  Sep 07, 2024 16:10 UTC   <invalid>       etcd-ca                 no      
    etcd-server                Sep 07, 2024 16:10 UTC   <invalid>       etcd-ca                 no      
    front-proxy-client         Sep 07, 2024 16:10 UTC   <invalid>       front-proxy-ca          no      
    scheduler.conf             Sep 07, 2024 16:11 UTC   <invalid>       ca                      no
    
    CERTIFICATE AUTHORITY   EXPIRES                  RESIDUAL TIME   EXTERNALLY MANAGED
    ca                      Sep 05, 2033 16:10 UTC   8y              no      
    etcd-ca                 Sep 05, 2033 16:10 UTC   8y              no      
    front-proxy-ca          Sep 05, 2033 16:10 UTC   8y              no      
    [root@k8s ~]#
    ```

   :::

3. 证书续期（`只能在主节点执行`，`每个主节点都需要执行`）
    ```shell
    kubeadm certs renew all
    ```
    ```shell
    [root@xuxiaowei-bili ~]# kubeadm certs renew all
    [renew] Reading configuration from the cluster...
    [renew] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -o yaml'
    
    certificate embedded in the kubeconfig file for the admin to use and for kubeadm itself renewed
    certificate for serving the Kubernetes API renewed
    certificate the apiserver uses to access etcd renewed
    certificate for the API server to connect to kubelet renewed
    certificate embedded in the kubeconfig file for the controller manager to use renewed
    certificate for liveness probes to healthcheck etcd renewed
    certificate for etcd nodes to communicate with each other renewed
    certificate for serving etcd renewed
    certificate for the front proxy client renewed
    certificate embedded in the kubeconfig file for the scheduler manager to use renewed
    certificate embedded in the kubeconfig file for the super-admin renewed
    
    Done renewing certificates. You must restart the kube-apiserver, kube-controller-manager, kube-scheduler and etcd, so that they can use the new certificates.
    ```

4. 上述执行结果提示需要重启 `kube-apiserver`、`kube-controller-manager`、`kube-scheduler` 和 `etcd`

   ::: warning 警告

    1. 如果使用容器部署的 `kube-apiserver`、`kube-controller-manager`、`kube-scheduler`、`etcd` 可以直接删除容器，
       `kubelet` 程序会检查容器的状态以及相关的配置文件

   :::

    ```shell
    kubectl -n kube-system delete pod kube-apiserver-<节点名称>
    kubectl -n kube-system delete pod kube-controller-manager-<节点名称>
    kubectl -n kube-system delete pod kube-scheduler-<节点名称>
    kubectl -n kube-system delete pod etcd-<节点名称>
    ```

5. 查看续期结果
    ```shell
    kubeadm certs check-expiration
    ```
    ```shell
    [root@xuxiaowei-bili ~]# kubeadm certs check-expiration
    [check-expiration] Reading configuration from the cluster...
    [check-expiration] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -o yaml'
    
    CERTIFICATE                EXPIRES                  RESIDUAL TIME   CERTIFICATE AUTHORITY   EXTERNALLY MANAGED
    admin.conf                 Jul 02, 2025 09:14 UTC   364d            ca                      no      
    apiserver                  Jul 02, 2025 09:14 UTC   364d            ca                      no      
    apiserver-etcd-client      Jul 02, 2025 09:14 UTC   364d            etcd-ca                 no      
    apiserver-kubelet-client   Jul 02, 2025 09:14 UTC   364d            ca                      no      
    controller-manager.conf    Jul 02, 2025 09:14 UTC   364d            ca                      no      
    etcd-healthcheck-client    Jul 02, 2025 09:14 UTC   364d            etcd-ca                 no      
    etcd-peer                  Jul 02, 2025 09:14 UTC   364d            etcd-ca                 no      
    etcd-server                Jul 02, 2025 09:14 UTC   364d            etcd-ca                 no      
    front-proxy-client         Jul 02, 2025 09:14 UTC   364d            front-proxy-ca          no      
    scheduler.conf             Jul 02, 2025 09:14 UTC   364d            ca                      no      
    super-admin.conf           Jul 02, 2025 09:14 UTC   364d            ca                      no
    
    CERTIFICATE AUTHORITY   EXPIRES                  RESIDUAL TIME   EXTERNALLY MANAGED
    ca                      Mar 07, 2034 13:28 UTC   9y              no      
    etcd-ca                 Mar 07, 2034 13:28 UTC   9y              no      
    front-proxy-ca          Mar 07, 2034 13:28 UTC   9y              no      
    [root@xuxiaowei-bili ~]#
    ```

## 修改IP后重新生成证书 {id=init-phase-kubeconfig}

1. 生成默认初始化配置
    ```shell
    kubeadm config print init-defaults > init.yaml
    ```

2. 如果主节点 IP 变更，将 init.yaml 中的 `advertiseAddress` 修改为新 IP，<strong><font color="red">如果 k8s
   安装初始化时有特别自定义，请在此处做同步修改</font></strong>（可选）
    ```shell
    vim init.yaml
    ```

3. 备份旧证书
    ```shell
    mv /etc/kubernetes/pki /etc/kubernetes/pki-bak
    ```

4. 备份配置文件，包含：admin.conf、controller-manager.conf、kubelet.conf、scheduler.conf
    ```shell
    for file in admin.conf controller-manager.conf kubelet.conf scheduler.conf; do mv -f "/etc/kubernetes/$file" "/etc/kubernetes/$file.bak"; done
    ```

5. 生成新证书（重新生成 `/etc/kubernetes/pki` 文件夹中的证书）
    ```shell
    kubeadm init phase certs all --config init.yaml
    ```

6. 生成新配置文件，包含：`admin.conf`、`controller-manager.conf`、`kubelet.conf`、`scheduler.conf`
    ```shell
    kubeadm init phase kubeconfig all --config init.yaml
    ```

7. 修改用户配置
    1. 如果你使用环境变量 `export KUBECONFIG=/etc/kubernetes/admin.conf` 指定的配置，则可以忽略此步骤
    2. 如果你使用 `$HOME/.kube/config` 配置文件指定的配置，需要执行以下命令生成新配置文件
        ```shell
        # 备份旧配置文件
        sudo mv $HOME/.kube $HOME/.kube-bak
        
        # 生成新配置文件
        mkdir -p $HOME/.kube
        sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
        sudo chown $(id -u):$(id -g) $HOME/.kube/config
        ```

8. 将 `/etc/hosts` 中的主机名指向新 IP（可选）
    ```shell
    vim /etc/hosts
    ```

9. 重启 `kubelet`，验证上述配置是否修改完成

   重启后 `kubelet` 中的旧 IP 将会消失
    ```shell
    systemctl restart kubelet.service
    ```

   出现日志，说明容器无法正常运行
    ```shell
    Jul 08 13:45:20 k8s kubelet[14948]: E0708 13:45:20.053721   14948 kubelet_node_status.go:92] "Unable to register node with API server" err="Post \"https://192.168.80.201:6443/api/v1/nodes\": dial tcp 192.168.80.201:6443: connect: connection refused" node="k8s"
    ```

10. 修改配置文件（可选）

    修改 `/etc/kubernetes/manifests/` 文件夹中的文件，对应的容器会重启

    `192.168.80.5` 是旧IP

    `192.168.80.201` 是新IP
    ```shell
    # 注意转译
    sudo sed -i 's/192\.168\.80\.5/192.168.80.201/g' /etc/kubernetes/manifests/etcd.yaml
    ```

    ```shell
    # 注意转译
    sudo sed -i 's/192\.168\.80\.5/192.168.80.201/g' /etc/kubernetes/manifests/kube-apiserver.yaml
    ```

11. 重启 `kubelet`，验证所有配置是否修改完成

    ```shell
    systemctl restart kubelet.service
    ```

    检查 k8s 状态
    ```shell
    kubectl get node
    kubectl get pods --all-namespaces
    kubectl get svc --all-namespaces
    ```
