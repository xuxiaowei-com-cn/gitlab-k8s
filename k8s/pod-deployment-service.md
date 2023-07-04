# Pod、Deployment、Service（未完成）

## 说明

1. [Pod](https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/)
    1. 可以在 Kubernetes 中创建和管理的、最小的可部署的计算单元
2. [Deployment](https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/deployment/)
    1. 为 Pod 和 ReplicaSet 提供声明和更新能力
3. [服务（Service）](https://kubernetes.io/zh-cn/docs/concepts/services-networking/service/)
    1. 将运行在一个或一组 Pod 上的网络应用程序公开为网络服务的方法

## 配置

### 创建简单的 pod

```shell
cat > simple-pod.yaml << EOF
apiVersion: v1
kind: Pod
metadata:
  name: simple-pod-1
spec:
  containers:
  - name: nginx
    image: nginx:1.25.1
    ports:
    - containerPort: 80

EOF

cat simple-pod.yaml

kubectl apply -f simple-pod.yaml

# 或者 kubectl apply -f https://k8s.io/examples/pods/simple-pod.yaml
```

| 获取所有的 pod 信息               | `kubectl get pod --all-namespaces -o wide`    |
|----------------------------|-----------------------------------------------|
| 实时获取所有的 pod 信息             | `kubectl get pod --all-namespaces -o wide -w` |
| 获取名称为 nginx 的 pod 信息       | `kubectl get pod nginx -o wide`               |
| 进入名称为 nginx 的 pod 内部       | `kubectl exec -it nginx bash`                 |
| 查看名称为 nginx 的 pod 描述（创建过程） | `kubectl describe pod nginx`                  |
| 删除名称为 nginx 的 pod          | `kubectl delete pod nginx`                    |

### 创建简单的 Deployment

```shell
cat > simple-deployment.yaml << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: simple-deployment-1
  labels:
    app: simple-deployment-1
spec:
  replicas: 2
  selector:
    matchLabels:
      app: simple-deployment-1
  template:
    metadata:
      labels:
        app: simple-deployment-1
    spec:
      containers:
      - name: nginx
        image: nginx:1.25.0
        ports:
        - containerPort: 80

EOF

cat simple-deployment.yaml

kubectl apply -f simple-deployment.yaml

# 或者 https://raw.githubusercontent.com/kubernetes/website/main/content/zh-cn/examples/controllers/nginx-deployment.yaml
```

| 获取所有的 deployment 信息                          | `kubectl get deployment --all-namespaces -o wide` |
|----------------------------------------------|---------------------------------------------------|
| 获取名称为 nginx-deployment 的 deployment 信息       | `kubectl get deployment nginx-deployment -o wide` |
| 查看名称为 nginx-deployment 的 deployment 描述（创建过程） | `kubectl describe deployment nginx-deployment`    |
| 删除名称为 nginx-deployment 的 deployment          | `kubectl delete deployment nginx-deployment`      |

### 创建简单的 Pod、Service

```shell
cat > simple-pod-service.yaml << EOF
apiVersion: v1
kind: Pod
metadata:
  name: simple-pod-2
  labels:
    app: simple-pod-2
spec:
  containers:
  - name: nginx
    image: nginx:1.24.0
    ports:
      - containerPort: 80

---
apiVersion: v1
kind: Service
metadata:
  name: simple-pod-service
spec:
  selector:
    app: simple-pod-2
  ports:
  - name: name-of-service-port
    protocol: TCP
    port: 80
    targetPort: 80
    nodePort: 32332
  type: NodePort

EOF

cat simple-pod-service.yaml

kubectl apply -f simple-pod-service.yaml

# 访问 http://k8s宿主机IP:32332
```

以下命令中的 `service` 被简写为 `svc`

| 获取所有的 Service 信息                         | `kubectl get svc --all-namespaces -o wide` |
|------------------------------------------|--------------------------------------------|
| 获取名称为 service-deployment 的 deployment 信息 | `kubectl get svc nginx-service -o wide`    |
| 查看名称为 service-deployment 的 deployment 描述 | `kubectl describe svc nginx-service`       |
| 删除名称为 service-deployment 的 deployment    | `kubectl delete svc nginx-service`         |

### 创建简单的 Deployment、Service

```shell
cat > simple-deployment-service.yaml << EOF

# https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/deployment/
# 创建 Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  # Deployment 名称
  name: simple-deployment-2
  # 命名空间
  # namespace: xuxiaowei-cloud
spec:
  selector:
    matchLabels:
      app: simple-deployment-2
  replicas: 2
  template:
    metadata:
      labels:
        app: simple-deployment-2
    spec:
      containers:
        - name: nginx
          # https://hub.docker.com/_/nginx
          # Nginx 版本
          image: nginx:1.23.4
          ports:
            # 容器开放的端口号
            - containerPort: 80
          volumeMounts:
            # 挂载主机的时区文件
            - name: time-zone
              mountPath: /etc/localtime
      # https://kubernetes.io/zh-cn/docs/concepts/storage/volumes/
      # 配置挂载的数据卷
      volumes:
        # 挂载主机的时区文件
        - name: time-zone
          hostPath:
            path: /etc/localtime

---

# https://kubernetes.io/zh-cn/docs/concepts/services-networking/service/
# 创建 Service
apiVersion: v1
kind: Service
metadata:
  # Service 名称
  name: simple-deployment-service
  # 命名空间
  # namespace: xuxiaowei-cloud
spec:
  ports:
    # NodePort：集群外部对 Service 访问使用的端口（默认范围：30000~32767）
    # port：Service 内部的端口号
    # targetPort：暴露的 Deployment 中容器的端口号
    # protocol：端口协议，TCP 或 UDP
    # name：仅在存在多个配置时需要填写，如果填写，必须使用字符串（数字需要添加引号）
    - nodePort: 30080
      port: 80
      protocol: TCP
      targetPort: 80
  selector:
    # 将 Service 和 Deployment 关联起来
    app: simple-deployment-2
  # NodePort 会将该 Service 暴露到整个集群中的节点上，让外部客户端可以通过节点 IP + NodePort 的方式来访问该 Service
  # 还有 ClusterIP 和 LoadBalancer 类型，具体可参考文档
  type: NodePort

EOF

cat simple-deployment-service.yaml

kubectl apply -f simple-deployment-service.yaml
```
