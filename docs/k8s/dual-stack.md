---
sidebar_position: 1
---

# 支持 IPv4/IPv6 双协议栈（未完成）

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

## 配置
