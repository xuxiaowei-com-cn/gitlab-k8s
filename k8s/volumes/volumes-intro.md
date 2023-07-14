# kubernetes（k8s） 挂载卷/储存卷 介绍

1. [卷](https://kubernetes.io/zh-cn/docs/concepts/storage/volumes/)
    1. 为了解决容器内文件（数据）的持久化
    2. 为了解决多容器文件（数据）共享
2. 卷类型
    1. 更新时间：2023-06-26
    2. alpha：内测版
    3. beta：公测
    4. stable：正式版、稳定版
    5. deprecated：已过时
    6. removed：已移除

| 卷名称                                               | 卷说明                                                                                                                                            | removed | deprecated | alpha | beta | stable |
|---------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|---------|------------|-------|------|--------|
| awsElasticBlockStore                              |                                                                                                                                                |         | 1.17       |       |      |        |
| AWS EBS CSI migration complete                    | awsElasticBlockStore CSI 迁移结束                                                                                                                  |         |            | 1.17  |      |        |
| AWS EBS CSI migration                             | awsElasticBlockStore CSI 迁移                                                                                                                    |         |            |       |      | 1.25   |
| azureDisk                                         |                                                                                                                                                |         | 1.19       |       |      |        |
| azureDisk CSI migration complete                  | azureDisk CSI 迁移结束                                                                                                                             |         |            | 1.21  |      |        |
| azureDisk CSI migration                           | azureDisk CSI 迁移                                                                                                                               |         |            |       |      | 1.24   |
| azureFile                                         |                                                                                                                                                |         | 1.21       |       |      |        |
| azureFile CSI migration complete                  | azureFile CSI 迁移结束                                                                                                                             |         |            | 1.21  |      |        |
| azureFile CSI migration                           | azureFile CSI 迁移                                                                                                                               |         |            |       |      | 1.26   |
| cephfs                                            |                                                                                                                                                |         |            |       |      | √      |
| cinder                                            |                                                                                                                                                |         | 1.18       |       |      |        |
| OpenStack CSI migration                           | cinder 迁移                                                                                                                                      |         |            |       |      | 1.24   |
| configMap                                         |                                                                                                                                                |         |            |       |      | √      |
| emptyDir                                          |                                                                                                                                                |         |            |       |      | √      |
| fc (光纤通道)                                         |                                                                                                                                                |         |            |       |      | √      |
| gcePersistentDisk                                 |                                                                                                                                                |         | 1.17       |       |      |        |
| GCE CSI migration complete                        | gcePersistentDisk CSI 迁移结束                                                                                                                     |         |            | 1.21  |      |        |
| GCE CSI migration                                 | gcePersistentDisk CSI 迁移                                                                                                                       |         |            |       |      | 1.25   |
| gitRepo                                           |                                                                                                                                                |         | √          |       |      |        |
| glusterfs                                         |                                                                                                                                                | 1.26    | 1.25       |       |      |        |
| hostPath                                          |                                                                                                                                                |         |            |       |      | √      |
| iscsi                                             |                                                                                                                                                |         |            |       |      | √      |
| local                                             |                                                                                                                                                |         |            |       |      | √      |
| nfs                                               | nfs 卷能将 NFS (网络文件系统) 挂载到你的 Pod 中。 不像 emptyDir 那样会在删除 Pod 的同时也会被删除，nfs 卷的内容在删除 Pod 时会被保存，卷只是被卸载。 这意味着 nfs 卷可以被预先填充数据，并且这些数据可以在 Pod        之间共享。 |         |            |       |      | √      |
| persistentVolumeClaim                             |                                                                                                                                                |         |            |       |      | √      |
| portworxVolume                                    |                                                                                                                                                |         | 1.25       |       |      |        |
| Portworx CSI migration                            |                                                                                                                                                |         |            |       | 1.25 |        |
| projected                                         |                                                                                                                                                |         |            |       |      | √      |
| rbd                                               |                                                                                                                                                |         |            |       |      | √      |
| RBD CSI migration                                 |                                                                                                                                                |         |            | 1.23  |      |        |
| secret                                            |                                                                                                                                                |         |            |       |      | √      |
| vsphereVolume                                     |                                                                                                                                                |         | √          |       |      |        |
| vSphere CSI migration complete                    |                                                                                                                                                |         |            |       | 1.19 |        |
| vSphere CSI migration                             |                                                                                                                                                |         |            |       |      | 1.26   |
| Using subPath                                     |                                                                                                                                                |         |            |       |      | √      |
| Using subPath with expanded environment variables |                                                                                                                                                |         |            |       |      | 1.17   |
| Resources                                         |                                                                                                                                                |         |            |       |      | √      |
| Out-of-tree volume plugins                        |                                                                                                                                                |         |            |       |      | √      |
| csi                                               |                                                                                                                                                |         |            |       |      | √      |
| flexVolume                                        |                                                                                                                                                |         | 1.23       |       |      |        |
