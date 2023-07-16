# 持久卷（Persistent Volume）（未完成）

## 说明

1. [持久卷](https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes/)
2. 持久卷（PersistentVolume，PV）：
    1. 是集群中的一块存储，可以由管理员事先制备（它与储存提供商的具体实现直接相关），或者使用
       [存储类（Storage Class）](https://kubernetes.io/zh-cn/docs/concepts/storage/storage-classes/) 来动态制备
    2. 持久卷是集群资源，就像节点也是集群资源一样
    3. PV 持久卷和普通的 Volume 一样，也是使用卷插件来实现的，只是它们拥有独立于任何使用 PV 的 Pod 的生命周期
    4. 此 API 对象中记述了存储的实现细节，无论其背后是 NFS、iSCSI 还是特定于云平台的存储系统。
3. 持久卷申领（PersistentVolumeClaim，PVC）：
    1. 表达的是用户对存储的请求。概念上与 Pod 类似
    2. Pod 会耗用节点资源，而 PVC 申领会耗用 PV 资源
    3. Pod 可以请求特定数量的资源（CPU 和内存）
    4. 同样 PVC 申领也可以请求特定的大小和访问模式 （例如，可以要求 PV 卷能够以 ReadWriteOnce、ReadOnlyMany 或
       ReadWriteMany 模式之一来挂载，参见
       [访问模式](https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes/#access-modes)
4. 尽管 PersistentVolumeClaim 允许用户消耗抽象的存储资源， 常见的情况是针对不同的问题用户需要的是具有不同属性（如，性能）的
   PersistentVolume 卷。 集群管理员需要能够提供不同性质的 PersistentVolume， 并且这些 PV
   卷之间的差别不仅限于卷大小和访问模式，同时又不能将卷是如何实现的这些细节暴露给用户。 为了满足这类需求，就有了
   **存储类（StorageClass）** 资源。

## 配置

