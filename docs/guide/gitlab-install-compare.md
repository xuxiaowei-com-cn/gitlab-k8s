# GitLab 部署方式对比

## 部署方式

### 独立一台服务器部署

#### 优点

1. 操作简单
2. 管理容易
3. 无技术难点

#### 缺点

1. 需要单独占用一台服务器的资源（内存 8G、磁盘 100G，根据使用人数、使用功能、需求不同，需要的资源不同）
2. 不支持故障转译
3. 停机升级
4. 升级/回滚麻烦

### 使用 Docker 部署

#### 优点

1. 环境独立
2. 升级/回滚简单

#### 缺点

1. 需要一台服务器提供全部资源（例如：内存 8G、磁盘 100G）
2. 不支持故障转译
3. 停机升级

### 使用 k8s Deployment 部署

#### 优点

1. 可使用 k8s 集群资源（内存、磁盘）
2. 支持故障转译

#### 缺点

1. GitLab 单个程序占用内存过大：GitLab 不可使用 k8s 碎片化的内存资源，如：

   如果 GitLab 要占用 8G 内存，k8s 每个工作节点剩余内存都不超过 8G（即使所有工作节点剩余内存之和远远超过8G）也无法部署，
   因为 GitLab 属于一个容器，是一个整体，无法拆分

2. 停机升级

### 使用 k8s helm 部署

#### 优点

1. 可使用 k8s 集群资源（内存、磁盘）
2. 支持故障转译
3. 可使用 k8s 碎片化的内存资源，此方式相当于把一个占用大内存的应用拆分成多个占用小内存的应用，类似于微服务
4. 可根据需求启用、停止某个功能，以节省资源
5. 提供高可用部署
6. 不停机升级
7. 升级/回滚简单

#### 缺点

1. 由于采用类似微服务的方案，总体内存占用多1G到2G（大概）
2. 如果迁移到 k8s helm 部署，历史 GitLab Runner 需要修改注册凭证