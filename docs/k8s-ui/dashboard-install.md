# Kubernetes Dashboard 安装

Kubernetes（k8s）Dashboard 安装

## 说明

1. Kubernetes Dashboard 是一个通用的、基于Web的UI，用于Kubernetes集群管理。
2. 它允许用户管理群集中运行的应用程序并对其进行故障排除，以及管理群集本身。
3. 不同 Kubernetes Dashboard 支持的 Kubernetes 版本不同，可查看 Kubernetes Dashboard
   发版日志中的说明：https://github.com/kubernetes/dashboard/releases
   ，下面列举最近几版的版本支持（仅列举了 **完全支持的版本范围**）
4. **作者镜像仓库**：
    1. https://framagit.org/mirrors-github/kubernetes/dashboard
5. 需要 [安装 Metrics Server](../k8s/metrics-server-install.md) 才能查看资源（内存、CPU）使用情况
6. 使用网址如下：只需要换一下标签名
    1. https://framagit.org/mirrors-github/kubernetes/dashboard/-/raw/v2.7.0/aio/deploy/recommended.yaml

| Kubernetes Dashboard 版本 | Kubernetes 版本 | 使用 GitHub 官方仓库文件执行命令                                                                                       | 使用 作者镜像仓库 文件执行命令                                                                                                   |
|-------------------------|---------------|------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| 2.7.0                   | 1.25          | kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml | kubectl apply -f https://framagit.org/mirrors-github/kubernetes/dashboard/-/raw/v2.7.0/aio/deploy/recommended.yaml |
| 2.6.1                   | 1.24          | kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.6.1/aio/deploy/recommended.yaml | kubectl apply -f https://framagit.org/mirrors-github/kubernetes/dashboard/-/raw/v2.6.1/aio/deploy/recommended.yaml |
| 2.6.0                   | 1.24          | kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.6.0/aio/deploy/recommended.yaml | kubectl apply -f https://framagit.org/mirrors-github/kubernetes/dashboard/-/raw/v2.6.0/aio/deploy/recommended.yaml |
| 2.5.1                   | 1.23          | kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.5.1/aio/deploy/recommended.yaml | kubectl apply -f https://framagit.org/mirrors-github/kubernetes/dashboard/-/raw/v2.5.1/aio/deploy/recommended.yaml |
| 2.5.0                   | 1.23          | kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.5.0/aio/deploy/recommended.yaml | kubectl apply -f https://framagit.org/mirrors-github/kubernetes/dashboard/-/raw/v2.5.0/aio/deploy/recommended.yaml |
| 2.4.0                   | 1.20、1.21     | kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.4.0/aio/deploy/recommended.yaml | kubectl apply -f https://framagit.org/mirrors-github/kubernetes/dashboard/-/raw/v2.4.0/aio/deploy/recommended.yaml |

## 参考链接

1. https://github.com/kubernetes/dashboard/blob/master/docs/user/accessing-dashboard/README.md
2. https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/README.md
3. https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/creating-sample-user.md
4. 以上参考连接列举的都是最新版，请结合自身的版本选择对应的标签
5. 作者镜像仓库：
   镜像仓库：[https://framagit.org/mirrors-github/kubernetes/dashboard](https://framagit.org/mirrors-github/kubernetes/dashboard)

## 安装

1. 在管理节点上执行

   ```shell
   # 作者镜像仓库：kubectl apply -f https://framagit.org/mirrors-github/kubernetes/dashboard/-/raw/v2.7.0/aio/deploy/recommended.yaml
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml
   ```

2. 查看是否创建完成

   ```shell
   # Kubernetes（k8s）Dashboard 的命名空间是 kubernetes-dashboard
   kubectl get pods -n kubernetes-dashboard -o wide
   ```

   ```shell
   [root@centos-7-9-14 ~]# kubectl get pods -n kubernetes-dashboard -o wide
   NAME                                         READY   STATUS    RESTARTS   AGE   IP               NODE            NOMINATED NODE   READINESS GATES
   dashboard-metrics-scraper-64bcc67c9c-w6z9g   1/1     Running   0          28m   172.16.191.252   centos-7-9-14   <none>           <none>
   kubernetes-dashboard-5c8bd6b59-wh4vq         1/1     Running   0          28m   172.16.191.251   centos-7-9-14   <none>           <none>
   [root@centos-7-9-14 ~]# 
   ```

   ```shell
   kubectl -n kubernetes-dashboard get service kubernetes-dashboard
   ```

   ```shell
   [root@centos-7-9-14 ~]# kubectl -n kubernetes-dashboard get service kubernetes-dashboard
   NAME                   TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE
   kubernetes-dashboard   ClusterIP   10.108.225.163   <none>        443/TCP   49m
   [root@centos-7-9-14 ~]#
   ```

3. 修改 kubernetes-dashboard 服务，使其支持远程访问

   ```shell
   # https://github.com/kubernetes/dashboard/blob/master/docs/user/accessing-dashboard/README.md
   kubectl -n kubernetes-dashboard edit service kubernetes-dashboard
   ```

   将 `type: ClusterIP` 修改成 `type: NodePort` 即可

4. 修改完成后，再次查看 kubernetes-dashboard 服务

   ```shell
   kubectl -n kubernetes-dashboard get service kubernetes-dashboard
   ```

   ```shell
   [root@centos-7-9-14 ~]# kubectl -n kubernetes-dashboard get service kubernetes-dashboard
   NAME                   TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)         AGE
   kubernetes-dashboard   NodePort   10.108.225.163   <none>        443:30320/TCP   54m
   [root@centos-7-9-14 ~]#
   ```

5. 由上一步执行的结果可以得出，使用 30320 即可访问 kubernetes-dashboard 服务
   假如集群的IP为 192.168.80.14，访问地址为 https://192.168.80.14:30320
6. 创建服务帐户

    ```shell
    cat > dashboard-adminuser.yaml << EOF
    apiVersion: v1
    kind: ServiceAccount
    metadata:
      name: admin-user
      namespace: kubernetes-dashboard
    
    EOF
    
    cat dashboard-adminuser.yaml
    
    kubectl apply -f dashboard-adminuser.yaml
    ```

7. 创建群集角色绑定

    ```shell
    cat > cluster-admin.yaml << EOF
    apiVersion: rbac.authorization.k8s.io/v1
    kind: ClusterRoleBinding
    metadata:
      name: admin-user
    roleRef:
      apiGroup: rbac.authorization.k8s.io
      kind: ClusterRole
      name: cluster-admin
    subjects:
    - kind: ServiceAccount
      name: admin-user
      namespace: kubernetes-dashboard
    
    EOF
    
    cat cluster-admin.yaml
    
    kubectl apply -f cluster-admin.yaml
    ```

8. 获取持有者令牌

   ```shell
   kubectl -n kubernetes-dashboard create token admin-user
   
   # 1 天
   # kubectl -n kubernetes-dashboard create token admin-user --duration=86400s
   
   # 3 天
   # kubectl -n kubernetes-dashboard create token admin-user --duration=259200s
   
   # 7 天
   # kubectl -n kubernetes-dashboard create token admin-user --duration=604800s
   
   # 14 天
   # kubectl -n kubernetes-dashboard create token admin-user --duration=1209600s
   
   # 1 个月
   # kubectl -n kubernetes-dashboard create token admin-user --duration=2592000s
   
   # 2 个月
   # kubectl -n kubernetes-dashboard create token admin-user --duration=5184000s
   
   # 3 个月
   # kubectl -n kubernetes-dashboard create token admin-user --duration=7776000s
   
   # 6 个月
   # kubectl -n kubernetes-dashboard create token admin-user --duration=15552000s
   
   # 1 年
   # kubectl -n kubernetes-dashboard create token admin-user --duration=31536000s
   
   # 2 年
   # kubectl -n kubernetes-dashboard create token admin-user --duration=62208000s
   
   # 3 年
   # kubectl -n kubernetes-dashboard create token admin-user --duration=94608000s
   
   # 5 年
   # kubectl -n kubernetes-dashboard create token admin-user --duration=157680000s
   
   # 10 年
   # kubectl -n kubernetes-dashboard create token admin-user --duration=315360000s
   
   # 100 年
   # kubectl -n kubernetes-dashboard create token admin-user --duration=3153600000s
   ```

9. 使用上述令牌即可登录系统
10. 其他命令

```shell
kubectl -n kubernetes-dashboard delete serviceaccount admin-user
```

```shell
kubectl -n kubernetes-dashboard delete clusterrolebinding admin-user
```
