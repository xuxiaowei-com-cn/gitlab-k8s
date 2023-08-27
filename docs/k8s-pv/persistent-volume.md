# 持久卷（Persistent Volume）

以 NFS 为例

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
5. 一般而言，每个 PV 卷都有确定的存储容量。
6. 访问模式：
    1. ReadWriteOnce：卷可以被一个节点以读写方式挂载。 ReadWriteOnce 访问模式也允许运行在同一节点上的多个 Pod 访问卷。
    2. ReadOnlyMany：卷可以被多个节点以只读方式挂载。
    3. ReadWriteMany：卷可以被多个节点以读写方式挂载。
    4. ReadWriteOncePod（特性状态： Kubernetes v1.27 [beta]）：卷可以被单个 Pod 以读写方式挂载。 如果你想确保整个集群中只有一个
       Pod 可以读取或写入该 PVC， 请使用 ReadWriteOncePod 访问模式。这只支持 CSI 卷以及需要 Kubernetes 1.22 以上版本。

## 配置

1. 创建 PV

    ```shell
    cat > pv-1.yaml << EOF
    apiVersion: v1
    # 资源类型：PersistentVolume
    kind: PersistentVolume
    metadata:
      # 资源名称：pv-1
      # 不区分命名空间
      name: pv-1
    spec:
      capacity:
        storage: 50Gi
      volumeMode: Filesystem
      accessModes:
        - ReadWriteOnce
        - ReadWriteMany
      persistentVolumeReclaimPolicy: Recycle
      # storageClassName: sc-1
      mountOptions:
        - hard
        - nfsvers=4.1
      nfs:
        # 需要事先创建此文件夹
        path: /nfs/pv-1/
        server: 192.168.61.167
    
    
    EOF
    
    cat pv-1.yaml
    
    kubectl apply -f pv-1.yaml
    
    kubectl get pv
    kubectl get pvc
    ```

2. 查看 PV 状态

    ```shell
    kubectl get pv -o wide
    ```

    ```shell
    [root@anolis ~]# kubectl get pv -o wide
    NAME   CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS   REASON   AGE   VOLUMEMODE
    pv-1   50Gi       RWO,RWX        Recycle          Available                                   55s   Filesystem
    [root@anolis ~]#
    ```
