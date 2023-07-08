# 使用 kubeadm 生成 Kubernetes（k8s） 新证书

1. 可用于直接更新证书
2. 可用于 k8s 主节点 IP 切换时重新根据新 IP 生成新证书

## 说明

- [kubeadm certs](https://kubernetes.io/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-certs/)
    1. kubeadm certs 提供管理证书的工具。
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
    1. 192.168.80.5 是旧IP
    2. 192.168.80.201 是新IP

- 查看日志
    ```shell
    journalctl -xefu kubelet
    ```

    1. 如果切换了新 IP，可能会出现日志

       旧 IP 是 192.168.80.5，切换成新 IP 后，旧 IP 无法访问了
        ```
        Jul 08 13:35:44 k8s kubelet[1786]: E0708 13:35:44.450765    1786 kubelet_node_status.go:540] "Error updating node status, will retry" err="error getting node \"k8s\": Get \"https://192.168.80.5:6443/api/v1/nodes/k8s?timeout=10s\": dial tcp 192.168.80.5:6443: connect: no route to host"
        ```

## 配置

1. 生成默认初始化配置
    ```shell
    kubeadm config print init-defaults > init.yaml
    ```

2. 如果主节点 IP 变更，将 init.yaml 中的 advertiseAddress 修改为新 IP，<strong><font color="red">如果 k8s
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

6. 生成新配置文件，包含：admin.conf、controller-manager.conf、kubelet.conf、scheduler.conf
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

    192.168.80.5 是旧IP

    192.168.80.201 是新IP
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
