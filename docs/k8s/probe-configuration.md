---
sidebar_position: 7
---

# Kubernetes（k8s）探针 配置

用于检查 pod 运行是否正常，从而控制 pod 的状态

## 说明

1. livenessProbe 活性探针
    1. 指定容器的生命周期探针，用于检测容器是否正在运行。
    2. 用于确定容器何时需要重启。
    3. 自诊断，心跳检查。
    4. 如果探针检测失败，则 Kubernetes 可以选择重新启动容器。
2. readinessProbe 准备就绪探针
    1. 指定容器的就绪状态探针，用于检测容器是否准备接收流量。
    2. 健康检查。
    3. 如果探针检测失败，则 Kubernetes 将从其服务端点的池（负载均衡池）中删除该容器。

## 示例

示例地址：[xuxiaowei-cloud](https://framagit.org/xuxiaowei-cloud/xuxiaowei-cloud/-/blob/main/admin-server/admin-server-deployment.yaml)

```yaml
# 创建命名空间  ：kubectl create namespace xuxiaowei-cloud
# 创建 pod    ：kubectl apply -f admin-server-deployment.yaml
# 查看 pod    ：kubectl -n xuxiaowei-cloud get pod -o wide
# 查看 pod 描述：kubectl -n xuxiaowei-cloud describe pod pod名称
# 进入 pod    ：kubectl -n xuxiaowei-cloud exec -it pod名称 bash
# 编辑 pod    ：kubectl -n xuxiaowei-cloud edit deployment admin-server-deployment
# 删除 pod    ：kubectl -n xuxiaowei-cloud delete deployment admin-server-deployment

# 创建一个持久化卷（Persistent Volume）
# https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes/
apiVersion: v1
kind: PersistentVolume
metadata:
  # 持久卷名称
  name: admin-server-logs-volume
spec:
  # 持久化卷的容量为 10GB
  capacity:
    storage: 10Gi
  # 持久化卷的访问模式为 ReadWriteMany，即多个 Pod 可以同时进行读写操作
  # https://kubernetes.io/zh-cn/docs/concepts/storage/persistent-volumes/#access-modes
  accessModes:
    - ReadWriteMany
  # 持久化卷的类型为 NFS（Network File System，网络文件系统）
  # https://kubernetes.io/zh-cn/docs/concepts/storage/volumes/#nfs
  nfs:
    # NFS 文档：https://framagit.org/xuxiaowei-com-cn/gitlab-k8s/-/blob/main/k8s/pv/centos-7-nfs-install.md
    # NFS 文件系统上的目标路径。需要保证该目录在 NFS 服务器上存在
    path: /nfs/admin-server/logs
    # 填写你的 NFS（Network File System，网络文件系统） 地址
    server: 192.168.0.27

---

# https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/deployment/
# 创建 Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  # Deployment 名称
  name: admin-server-deployment
  # 命名空间
  namespace: xuxiaowei-cloud
spec:
  selector:
    matchLabels:
      app: admin-server
  replicas: 2
  strategy:
    # 滚动更新
    type: RollingUpdate
    rollingUpdate:
      # 超出所需 replicas 副本数 的最大数量，默认值为 25%
      maxSurge: 1
      # 滚动更新期间允许不可用的最大 replicas 副本数，默认值为 25%
      maxUnavailable: 1
  template:
    metadata:
      labels:
        app: admin-server
    spec:
      containers:
        - name: admin-server
          # admin-server 版本
          image: registry.docker.example.xuxiaowei.cloud/cloud.xuxiaowei/admin-server:0.0.1-SNAPSHOT
          # 指定环境变量
          env:
            - name: nacos_xuxiaowei_cloud_addr
              value: nacos-service
            - name: APP_ARGS
              # 正式环境
              value: --spring.profiles.active=prod
          ports:
            # 容器开放的端口号
            - containerPort: 1201
          # 准备就绪探针
          readinessProbe:
            # 使用 HTTP GET 方法检查
            httpGet:
              # 检查的路径
              # Windows 上使用 /actuator/health
              # k8s 上使用 /actuator/health/readiness
              path: /actuator/health/readiness
              # 应用程序端口号
              port: 1201
            # 初始化延迟 30 秒
            initialDelaySeconds: 30
            # 每隔 10 秒一次检查
            periodSeconds: 10
            # 超时时间
            timeoutSeconds: 5
            # 连续成功的检查次数
            successThreshold: 1
            # 连续失败的检查次数
            failureThreshold: 3
          # 活性探针
          livenessProbe:
            # 使用 HTTP GET 方法检查
            httpGet:
              # 检查的路径
              # Windows 上使用 /actuator/health
              # k8s 上使用 /actuator/health/liveness
              path: /actuator/health/liveness
              # 应用程序端口号
              port: 1201
            # 初始化延迟 30 秒
            initialDelaySeconds: 30
            # 每隔 20 秒一次检查
            periodSeconds: 20
            # 超时时间
            timeoutSeconds: 5
            # 连续成功的检查次数
            successThreshold: 1
            # 连续失败的检查次数
            failureThreshold: 3
          volumeMounts:
            # 挂载主机的时区文件
            - name: time-zone
              mountPath: /etc/localtime
            # 引用持久卷并挂载到容器
            - name: admin-server-logs-volume
              # Admin Server 日志目录
              mountPath: /logs
      # https://kubernetes.io/zh-cn/docs/concepts/storage/volumes/
      # 配置挂载的数据卷
      volumes:
        # 挂载主机的时区文件
        - name: time-zone
          hostPath:
            path: /etc/localtime
        # 引用持久卷
        - name: admin-server-logs-volume
          nfs:
            # NFS 文件系统上的目标路径。需要保证该目录在 NFS 服务器上存在
            # NFS 文档：https://framagit.org/xuxiaowei-com-cn/gitlab-k8s/-/blob/main/k8s/pv/centos-7-nfs-install.md
            path: /nfs/admin-server/logs
            # NFS 服务器的 IP 地址
            # 填写你的 NFS（Network File System，网络文件系统） 地址
            server: 192.168.0.27

---

# 创建 Service（不能指定 nodePort） ：kubectl -n xuxiaowei-cloud expose deployment admin-server-deployment --type=NodePort --name=admin-server-service
# 编辑 Service                    ：kubectl -n xuxiaowei-cloud edit service admin-server-service
# 删除 Service                    ：kubectl -n xuxiaowei-cloud delete service admin-server-service
# 查看 pod、Service               ：kubectl -n xuxiaowei-cloud get pod,svc -o wide

# https://kubernetes.io/zh-cn/docs/concepts/services-networking/service/
# 创建 Service
apiVersion: v1
kind: Service
metadata:
  # Service 名称
  name: admin-server-service
  # 命名空间
  namespace: xuxiaowei-cloud
spec:
  ports:
    # NodePort：集群外部对 Service 访问使用的端口（默认范围：30000~32767）
    # port：Service 内部的端口号
    # targetPort：暴露的 Deployment 中容器的端口号
    # protocol：端口协议，TCP 或 UDP
    # name：仅在存在多个配置时需要填写，如果填写，必须使用字符串（数字需要添加引号）
    - nodePort: 31201
      port: 1201
      protocol: TCP
      targetPort: 1201
  selector:
    # 将 Service 和 Deployment 关联起来
    app: admin-server
  # NodePort 会将该 Service 暴露到整个集群中的节点上，让外部客户端可以通过节点 IP + NodePort 的方式来访问该 Service
  # 还有 ClusterIP 和 LoadBalancer 类型，具体可参考文档
  type: NodePort
```
