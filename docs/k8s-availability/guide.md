---
sidebar_position: 1
---

# k8s 高可用集群：导读

Kubernetes（k8s）高可用集群：导读

## 说明

1. Master（Control Plane） 的 kube-apiserver、kube-controller-manager、kube-scheduler 服务至少有3个节点
2. Master（Control Plane） 启用基于CA认证的HTTPS安全机制
3. Master（Control Plane） 启用RBAC授权模式
4. etcd 至少部署3个节点
5. etcd 启用基于CA认证的HTTPS安全机制
6. NFS（Network File System）网络文件系统采用双机热备
7. 高可用集群参考：《Kubernetes权威指南》第5版（书中介绍的是1.19，本文以 1.26.2 为例，2023-03-01 发布）、官方文档
8. 官方文档
    1. [Install Docker Engine on CentOS](https://docs.docker.com/engine/install/centos/)
    2. [systemd cgroup 驱动](https://kubernetes.io/zh-cn/docs/setup/production-environment/container-runtimes/#containerd-systemd)
    3. [kube-apiserver](https://kubernetes.io/zh-cn/docs/reference/command-line-tools-reference/kube-apiserver/)
    4. [kube-controller-manager](https://kubernetes.io/zh-cn/docs/reference/command-line-tools-reference/kube-controller-manager/)
    5. [kube-proxy](https://kubernetes.io/zh-cn/docs/reference/command-line-tools-reference/kube-proxy/)
    6. [kubelet](https://kubernetes.io/zh-cn/docs/reference/command-line-tools-reference/kubelet/)
    7. [通过配置文件设置 Kubelet 参数](https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)
    8. [利用 kubeadm 创建高可用集群](https://kubernetes.io/zh-cn/docs/setup/production-environment/tools/kubeadm/high-availability/)
    9. [kubeadm init](https://kubernetes.io/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/)
    10. [kubeadm join](https://kubernetes.io/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-join/)
    11. [kubeadm config](https://kubernetes.io/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-config/)
    12. [kubeadm reset](https://kubernetes.io/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-reset/)
    13. [kubeadm token](https://kubernetes.io/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-token/)
9. 集群机器配置

   推荐负载均衡器与各节点在一个网段上

| Master 1、etcd 1 | Master 2、etcd 2 | Master 3、etcd 3 | 负载均衡器          | Node 1        | Node 2        |
|-----------------|-----------------|-----------------|----------------|---------------|---------------|
| 192.168.80.81   | 192.168.80.82   | 192.168.80.83   | 192.168.80.100 | 192.168.80.91 | 192.168.80.92 |

| NFS 1         | NFS 2         |
|---------------|---------------|
| 192.168.80.71 | 192.168.80.72 |

全局环境变量

```shell
# Master（Control Plane）IP
MASTER_1_IP=192.168.80.81
MASTER_2_IP=192.168.80.82
MASTER_3_IP=192.168.80.83
# VIP，负载均衡器IP
VIP_IP=192.168.80.100
# Network File System 网络文件系统，如果没有这么多机器用于实施，可将 NFS 高可用安装在 Master 或者 Node 节点
NFS_1_IP=192.168.80.71
NFS_2_IP=192.168.80.72
# 网卡名称
INTERFACE_NAME=ens33
```

## 单机集群配置需求参考

1. Kubernetes 1.26.2
2. calico 3.25
3. etcd 3.5.6-0 单机
4. 基础内存合计：使用 CentOS 7.9 最小化安装，包含系统内存消耗，基础内存共消耗 1.2G

## 高可用集群配置需求参考

1. kubernetes 1.26.2
2. calico 3.25
3. kubernetes-dashboard 2.7.0（大概需要 150M，可选）
4. kube-prometheus 0.12.0（大概需要 5.25G，可选）
5. metrics-server 0.6.3 高可用（可选）
6. etcd 3.5.6-0 高可用：内部堆叠
7. ingress-nginx 1.8.0（4个工作节点，每个工作节点运行1个，大概需要 2.68G，可选）
8. keepalived、haproxy：15M * 3 = 45M
9. 高可用基础内存合计：三个主节点（高可用最少需要三个主节点）、四个工作节点（高可用最少需要两个工作节点）、以上 kubernetes
   组件，未计算系统内存消耗，基础内存共消耗 14.25G（使用 `kubectl top node` 计算所得，所有节点开机30分钟后统计）
    - Daemon Sets：1.49G
    - Deployments：1.39G
    - Pods：6.38G
    - Replica Sets：1.38G
    - Stateful Sets：1.87G
