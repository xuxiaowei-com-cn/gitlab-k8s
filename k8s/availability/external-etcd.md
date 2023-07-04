# kubernetes（k8s）高可用集群5：利用 kubeadm 创建高可用集群-外部 etcd 拓扑

## 说明

1. **本文使用“外部 etcd
   拓扑”，即：自建高可用etcd集群，需要：[kubernetes（k8s）高可用集群2：etcd 高可用集群（非必须）](etcd-install.md)**
2. **如果不需要“外部 etcd 拓扑”，即：不需要自建高可用etcd集群，请参考：[kubernetes（k8s）高可用集群4：利用 kubeadm
   创建高可用集群-堆叠（Stacked） etcd 拓扑](stacked-etcd.md)**
3. [使用两种 etcd 拓展时的区别](stacked-etcd.md)
