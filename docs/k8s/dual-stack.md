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
7. CIDR网络地址计算器: https://www.sioe.cn/xinqing/CIDR.php
8. 示例
    1. https://jihulab.com/xuxiaowei-com-cn/java/-/blob/main/deploy/deploy-service-ipv6.yaml
    2. https://jihulab.com/xuxiaowei-com-cn/java/-/blob/main/deploy/deploy-service-ipv6-ingress.yaml
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
2. 如果长时间 `kube-apiserver` 无法启动，请使用 `crictl ps -a`、`crictl logs -f xxx` 查看错误日志

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
# 10.96.0.0/12：代表从 10.96.0.0 到 10.96.255.255，子网数量 1048576
# fc00::0:0:0/108：代表从 fc00:0:0:0:0:0:0:0 到 fc00:0:0:0:0:0:f:ffff，子网数量 1048576（不能超过 1048576）

--service-cluster-ip-range=10.96.0.0/12,fc00::0:0:0/108
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
# fc00::4:0:0/94：代表从 fc00:0:0:0:0:4:0:0 到 fc00:0:0:0:0:7:ffff:ffff，子网数量 17179869184
# fc00::8:0:0/94：代表从 fc00:0:0:0:0:8:0:0 到 fc00:0:0:0:0:b:ffff:ffff，子网数量 17179869184
# --node-cidr-mask-size-ipv6=108：代表每个节点分配子网数量是 1048576。注意：此处的 node-cidr-mask-size-* 一定要远小于 cluster-cidr、service-cluster-ip-range，否则 kube-controller-manager 将无法运行，参见 kube-controller-manager 运行日志

--cluster-cidr=10.128.0.0/12,fc00::8:0:0/94
--service-cluster-ip-range=10.96.0.0/12,fc00::4:0:0/94
--node-cidr-mask-size-ipv4=24
--node-cidr-mask-size-ipv6=108
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
# fc00::8:0:0/94：代表从 fc00:0:0:0:0:8:0:0 到 fc00:0:0:0:0:b:ffff:ffff，子网数量 17179869184
# 注意：此处应该与 kube-controller-manager 中的 --cluster-cidr 参数保持一致

clusterCIDR: 10.128.0.0/12,fc00::8:0:0/94
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

- 修改 calico 的 daemonsets 环境变量配置

```shell
# 修改 calico 的 daemonsets 环境变量配置

kubectl -n kube-system edit daemonsets calico-node
```

```shell
# 文档配置说明：https://docs.tigera.io/calico/latest/networking/ipam/ipv6#enable-dual-stack 中的 Manifest
# 注意格式

            - name: FELIX_IPV6SUPPORT
              value: "true"
            - name: IP6
              value: "autodetect"
            - name: CALICO_IPV6POOL_NAT_OUTGOING
              value: "true"
```

## 测试

### pod

- 新建一个 pod，进入 pod 查看 ip 即可观察到出现新的 ipv6 地址，在集群中的任意机器中均可使用

### svc

- 请使用 https://jihulab.com/xuxiaowei-com-cn/java/-/blob/main/deploy/deploy-service-ipv6.yaml 进行测试

### ingress

- 请使用 https://jihulab.com/xuxiaowei-com-cn/java/-/blob/main/deploy/deploy-service-ipv6-ingress.yaml

1. 此示例需要完成 [Ingress 安装](./ingress-install.md) 才能正常使用
