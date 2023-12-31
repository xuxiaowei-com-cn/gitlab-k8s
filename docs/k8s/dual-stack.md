---
sidebar_position: 2
---

# 支持 IPv4/IPv6 双协议栈

IPv4/IPv6 双协议栈网络能够将 IPv4 和 IPv6 地址分配给 Pod 和 Service。

## 文档

1. kubernetes IPv4/IPv6 双协议栈: https://kubernetes.io/zh-cn/docs/concepts/services-networking/dual-stack/
2. kubeadm init: https://kubernetes.io/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/
3. kubernetes kube-apiserver: https://kubernetes.io/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/
4. kubernetes
   kube-controller-manager: https://kubernetes.io/zh-cn/docs/reference/command-line-tools-reference/kube-controller-manager/
5. kubernetes kube-proxy: https://kubernetes.io/zh-cn/docs/reference/command-line-tools-reference/kube-proxy/
6. calico 双堆栈: https://docs.tigera.io/calico/latest/networking/ipam/ipv6
7. 配置 calico/node: https://docs.tigera.io/calico/latest/reference/configure-calico-node
8. CIDR网络地址计算器: https://www.sioe.cn/xinqing/CIDR.php
9. 示例
    1. https://framagit.org/xuxiaowei-com-cn/java/-/blob/main/deploy/deploy-service-ipv6.yaml
    2. https://framagit.org/xuxiaowei-com-cn/java/-/blob/main/deploy/deploy-service-ipv6-ingress.yaml
        1. 此示例需要完成 [Ingress 安装](./ingress-install.md) 才能正常使用

## 支持的功能

Kubernetes 集群的 IPv4/IPv6 双协议栈可提供下面的功能：

1. 双协议栈 pod 网络 (每个 pod 分配一个 IPv4 和 IPv6 地址)
2. IPv4 和 IPv6 启用的服务
3. Pod 的集群外出口通过 IPv4 和 IPv6 路由

## 先决条件

为了使用 IPv4/IPv6 双栈的 Kubernetes 集群，需要满足以下先决条件：

1. Kubernetes 1.20 版本或更高版本，有关更早 Kubernetes 版本的使用双栈服务的信息， 请参考对应版本的 Kubernetes 文档。
2. 提供商支持双协议栈网络（云提供商或其他提供商必须能够为 Kubernetes 节点提供可路由的 IPv4/IPv6 网络接口）
3. 支持双协议栈的
   [网络插件](https://kubernetes.io/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)

## 注意事项

1. 如果 k8s 集群存在多个节点：
    1. 如果 `vim` 命令包含 `/etc/kubernetes/manifests`，请在所有控制平面（主节点）节点上执行
    2. 如果 `vim` 命令不包含 `/etc/kubernetes/manifests`，请在所有节点上执行
    3. 其他命令，只需要在一个控制平面（主节点）节点上执行即可

## 配置 IPv4/IPv6 双协议栈

### 修改内核

```shell
vim /etc/sysctl.d/k8s.conf
```

```shell
net.ipv4.conf.all.forwarding        = 1
net.ipv6.conf.all.forwarding        = 1
```

```shell
sudo sysctl --system
```

### 修改 `kube-apiserver`

1. 完成文件 `/etc/kubernetes/manifests/kube-apiserver.yaml` 修改后，`kube-apiserver`
   会立即重启，会存在几分钟 `kube-apiserver` 无法使用的情况
2. 如果长时间 `kube-apiserver` 无法启动，请使用 `crictl ps -a`、`crictl logs -f xxx` 查看错误日志，crictl
   配置参见：[Kubernetes（k8s）安装](centos-install.md)

```shell
# 编辑文件 kube-apiserver 配置文件
vim /etc/kubernetes/manifests/kube-apiserver.yaml
```

```shell
# 文档配置说明：https://kubernetes.io/zh-cn/docs/concepts/services-networking/dual-stack/#%E9%85%8D%E7%BD%AE-ipv4-ipv6-%E5%8F%8C%E5%8D%8F%E8%AE%AE%E6%A0%88
# kube-apiserver 配置完整文档：https://kubernetes.io/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/
# --service-cluster-ip-range string：CIDR 表示的 IP 范围用来为服务分配集群 IP。 此地址不得与指定给节点或 Pod 的任何 IP 范围重叠。 最多允许两个双栈 CIDR。

--service-cluster-ip-range=<IPv4 CIDR>,<IPv6 CIDR>
```

```shell
# 修改示例（注意：请勿与实际网络冲突，注意格式）
# 10.96.0.0/12：代表从 10.96.0.0 到 10.111.255.255，子网数量 1048576
# fc00::96:0:0/108：代表从 fc00:0:0:0:0:96:0:0 到 fc00:0:0:0:0:96:f:ffff，子网数量 1048576（不能超过 1048576）

--service-cluster-ip-range=10.96.0.0/12,fc00::96:0:0/108
```

### 修改 `kube-controller-manager`

```shell
# 编辑文件 kube-controller-manager 配置文件
vim /etc/kubernetes/manifests/kube-controller-manager.yaml
```

```shell
# 文档配置说明：https://kubernetes.io/zh-cn/docs/concepts/services-networking/dual-stack/#%E9%85%8D%E7%BD%AE-ipv4-ipv6-%E5%8F%8C%E5%8D%8F%E8%AE%AE%E6%A0%88
# kube-controller-manager 配置完整文档：https://kubernetes.io/zh-cn/docs/reference/command-line-tools-reference/kube-controller-manager/
# --cluster-cidr string：集群中 Pod 的 CIDR 范围。要求 --allocate-node-cidrs 标志为 true。
# --service-cluster-ip-range string：集群中 Service 对象的 CIDR 范围。要求 --allocate-node-cidrs 标志为 true。
# --node-cidr-mask-size-ipv4 int32：在双堆栈（同时支持 IPv4 和 IPv6）的集群中，节点 IPV4 CIDR 掩码长度。默认为 24（推测每个节点分配 256 个）。
# --node-cidr-mask-size-ipv6 int32：在双堆栈（同时支持 IPv4 和 IPv6）的集群中，节点 IPv6 CIDR 掩码长度。默认为 64（推测每个节点分配 1.844674407371E+19 个）。

--cluster-cidr=<IPv4 CIDR>,<IPv6 CIDR>
--service-cluster-ip-range=<IPv4 CIDR>,<IPv6 CIDR>
--node-cidr-mask-size-ipv4|--node-cidr-mask-size-ipv6
```

```shell
# 修改示例（注意：请勿与实际网络冲突，注意格式）
# 10.128.0.0/12：代表从 10.128.0.0 到 10.143.255.255，子网数量 1048576
# 10.96.0.0/12：代表从 10.96.0.0 到 10.111.255.255，子网数量 1048576
# fc00::96:0:0/108：代表从 fc00:0:0:0:0:96:0:0 到 fc00:0:0:0:0:96:f:ffff，子网数量 1048576（不能超过 1048576）
# fc00::128:0:0:0:0/64：代表从 fc00:0:0:128:0:0:0:0 到 fc00:0:0:128:ffff:ffff:ffff:ffff，子网数量 1.844674407371E+19
# 注意：此处的 node-cidr-mask-size-* 一定要远小于 cluster-cidr、service-cluster-ip-range，否则 kube-controller-manager 将无法运行，参见 kube-controller-manager 运行日志

--cluster-cidr=10.128.0.0/12,fc00::128:0:0:0:0/64
--service-cluster-ip-range=10.96.0.0/12,fc00::96:0:0/108
```

```shell
# node-cidr-mask-size-ipv4/node-cidr-mask-size-ipv6 与 cluster-cidr/service-cluster-ip-range 不匹配异常
E1115 02:38:43.910717       1 controllermanager.go:616] "Error starting controller" err="Controller: Invalid --cluster-cidr, mask size of cluster CIDR must be less than or equal to --node-cidr-mask-size configured for CIDR family" controller="node-ipam-controller"
E1115 02:38:43.910735       1 controllermanager.go:240] "Error starting controllers" err="Controller: Invalid --cluster-cidr, mask size of cluster CIDR must be less than or equal to --node-cidr-mask-size configured for CIDR family"
```

### 修改 `kube-proxy`

```shell
# 修改 k8s 中 kube-proxy 的配置
kubectl -n kube-system edit configmaps kube-proxy
```

```shell
# 文档配置说明：https://kubernetes.io/zh-cn/docs/concepts/services-networking/dual-stack/#%E9%85%8D%E7%BD%AE-ipv4-ipv6-%E5%8F%8C%E5%8D%8F%E8%AE%AE%E6%A0%88
# kube-proxy 配置完整文档：https://kubernetes.io/zh-cn/docs/reference/command-line-tools-reference/kube-proxy/
# --cluster-cidr string：集群中 Pod 的 CIDR 范围。配置后，将从该范围之外发送到服务集群 IP 的流量被伪装，从 Pod 发送到外部 LoadBalancer IP 的流量将被重定向到相应的集群 IP。 
# 对于双协议栈集群，接受一个逗号分隔的列表， 每个 IP 协议族（IPv4 和 IPv6）至少包含一个 CIDR。 
# 如果配置文件由 --config 指定，则忽略此参数。

--cluster-cidr=<IPv4 CIDR>,<IPv6 CIDR>
```

```shell
# 修改示例（注意：请勿与实际网络冲突，注意格式）
# 10.128.0.0/12：代表从 10.128.0.0 到 10.143.255.255，子网数量 1048576
# fc00::128:0:0:0:0/64：代表从 fc00:0:0:128:0:0:0:0 到 fc00:0:0:128:ffff:ffff:ffff:ffff，子网数量 1.844674407371E+19
# 注意：此处应该与 kube-controller-manager 中的 --cluster-cidr 参数保持一致

clusterCIDR: 10.128.0.0/12,fc00::128:0:0:0:0/64
```

```shell
# 重启 kube-proxy

kubectl -n kube-system rollout restart daemonset kube-proxy
```

### calico 启用 IPv4/IPv6 双协议栈

- 修改 calico 的 configmaps 配置

    ```shell
    # 修改 calico 的 configmaps 配置
    
    kubectl -n kube-system edit configmaps calico-config
    ```

    ```shell
    # 文档配置说明：https://docs.tigera.io/calico/latest/networking/ipam/ipv6#enable-dual-stack 中的 Manifest
    # 注意格式
    
        "ipam": {
            "type": "calico-ipam",
            "assign_ipv4": "true",
            "assign_ipv6": "true"
        },
    ```

    ```shell
    # 滚动更新
    
    kubectl -n kube-system rollout restart daemonset calico-node
    ```

- 修改 calico 的 daemonsets 环境变量配置

    ```shell
    # 文档配置说明：https://docs.tigera.io/calico/latest/networking/ipam/ipv6#enable-dual-stack 中的 Manifest
    # 配置 calico/node 环境变量: https://docs.tigera.io/calico/latest/reference/configure-calico-node#configuring-bgp-networking 中的 Manifest
    
    
    # 支持 IPv6：IPv6 自动检测 BGP IP 地址
    kubectl -n kube-system set env daemonset/calico-node IP6=autodetect
    # 支持 IPv6
    kubectl -n kube-system set env daemonset/calico-node FELIX_IPV6SUPPORT="true"
    
    # 为 pod 启用出站NAT
    kubectl -n kube-system set env daemonset/calico-node CALICO_IPV6POOL_NAT_OUTGOING="true"
    
    # 与您配置的 kube-controller-manager 和 kube-proxy 的 IPv4 集群 CIDR 的 IPv4 范围相同
    kubectl -n kube-system set env daemonset/calico-node CALICO_IPV4POOL_CIDR="10.128.0.0/12"
    # 与您配置的 kube-controller-manager 和 kube-proxy 的 IPv6 集群 CIDR 的 IPv6 范围相同
    kubectl -n kube-system set env daemonset/calico-node CALICO_IPV6POOL_CIDR="fc00::128:0:0:0:0/64"
    
    # IPv4 网卡：注意修改网卡名称
    kubectl -n kube-system set env daemonset/calico-node IP_AUTODETECTION_METHOD="interface=ens18"
    # IPv6 网卡：注意修改网卡名称
    kubectl -n kube-system set env daemonset/calico-node IP6_AUTODETECTION_METHOD="interface=ens18"
    ```

## 测试

### pod

- 新建一个 pod
    1. 进入 pod 查看 ip 即可观察到出现新的 ipv6 地址，在集群中的任意机器中均可使用
    2. 使用 `kubectl -n xxx describe pod xxxxxx | grep podIPs` 查看 pod 的 ip
    3. 示例
        ```shell
        [root@anolis ~]# kubectl describe pod | grep podIPs
                  cni.projectcalico.org/podIPs: 10.128.231.205/32,fc00::128:d937:deb0:57b0:c780/128
        [root@anolis ~]#
        ```

### svc

- 请使用 https://framagit.org/xuxiaowei-com-cn/java/-/blob/main/deploy/deploy-service-ipv6.yaml 进行测试
- 执行 `kubectl apply -f https://framagit.org/xuxiaowei-com-cn/java/-/raw/main/deploy/deploy-service-ipv6.yaml` ，创建
  pod、Service（支持 IPv6）
- 查看 Service pod 的 IPv6 地址：`kubectl describe svc java-resp-ipv6-1-service | grep IPs`
    1. 示例
        ```shell
        [root@anolis ~]# kubectl describe svc java-resp-ipv6-1-service | grep IPs
        IPs:                      10.97.170.141,fc00::96:0:a248
        [root@anolis ~]#
        ```

### ingress

- 请使用 https://framagit.org/xuxiaowei-com-cn/java/-/blob/main/deploy/deploy-service-ipv6-ingress.yaml

1. 此示例需要完成 [Ingress 安装](./ingress-install.md) 才能正常使用
