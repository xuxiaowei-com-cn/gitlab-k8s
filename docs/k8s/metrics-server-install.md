---
sidebar_position: 4
---

# Metrics Server 安装

用于支持 `kubectl top` 命令，用于查看 pod 内存/CPU 使用情况

## 说明

1. 官方github仓库：[https://github.com/kubernetes-sigs/metrics-server](https://github.com/kubernetes-sigs/metrics-server)
2. 个人镜像：https://jihulab.com/xuxiaowei-com-cn/k8s.sh/-/tree/main/mirrors/kubernetes-sigs/metrics-server
3. Metrics Server 是一个 Kubernetes 组件，用于收集群集中的容器和节点的资源度量指标，并将这些指标提供给用户和其他组件。Metrics
   Server 采集的指标包括CPU使用率、内存使用率、网络流量等。这些指标可以帮助用户了解应用程序、服务以及它们所在的节点和容器的健康情况，帮助用户优化资源使用和应用程序性能。
4. Metrics Server 可以通过 Kubernetes API Server 提供度量指标查询接口，以支持其他组件、工具和应用程序对度量指标进行查询、监控、告警等操作。Metrics
   Server 还支持自动横向扩展，以适应更大规模的 Kubernetes 集群。总之，Metrics Server
   可以帮助用户更好地管理和优化Kubernetes集群中的资源使用和应用程序性能。
5. 不使用 helm，所以只需关注 `v*.*.*`的标签（即：不含 helm 的标签）
6. 版本介绍：
    1. [GitHub](https://github.com/kubernetes-sigs/metrics-server#compatibility-matrix)
    2. [JiHuLab 个人镜像](https://jihulab.com/mirrors-github/kubernetes-sigs/metrics-server#compatibility-matrix)
7. 本文以 v0.6.4 为例（其他版本仅需更换下面的链接中的 v0.6.4）

   | 文件类型                 | 文件链接                                                                                                    | 个人镜像                                                                                                                              |
   |----------------------|---------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
   | k8s 配置文件             | https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.6.4/components.yaml              | https://jihulab.com/xuxiaowei-com-cn/k8s.sh/-/raw/main/mirrors/kubernetes-sigs/metrics-server/v0.6.4/components.yaml              |
   | k8s 高可用配置文件          | https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.6.4/high-availability.yaml       | https://jihulab.com/xuxiaowei-com-cn/k8s.sh/-/raw/main/mirrors/kubernetes-sigs/metrics-server/v0.6.4/high-availability.yaml       |
   | k8s 1.21+ 以上 高可用配置文件 | https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.6.4/high-availability-1.21+.yaml | https://jihulab.com/xuxiaowei-com-cn/k8s.sh/-/raw/main/mirrors/kubernetes-sigs/metrics-server/v0.6.4/high-availability-1.21+.yaml |

8. 未安装 Metrics Server 查看 pod 内存、CPU 将报错

    ```shell
    [root@k8s ~]# kubectl top pods --all-namespaces
    error: Metrics API not available
    [root@k8s ~]# 
    ```

9. 未安装 Metrics Server 时，Kubernetes Dashboard 无法查看资源（内存、CPU）使用情况

## 配置

1. 下载配置文件

   ```shell
   wget https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.6.4/components.yaml
   ```

2. 修改 components.yaml 配置，不验证证书

   ```shell
   sed -i '/- args:/a \ \ \ \ \ \ \ \ - --kubelet-insecure-tls' components.yaml
   ```

   否则查看创建完成的pod，日志会输出，即：metrics-server 无法使用

   ```shell
   E0424 02:30:45.702055       1 scraper.go:140] "Failed to scrape node" err="Get \"https://192.168.61.143:10250/metrics/resource\": x509: cannot validate certificate for 192.168.61.143 because it doesn't contain any IP SANs" node="k8s"
   ```

3. 修改镜像（根据自己的需要进行选择）

   ```shell
   # 由于 components.yaml 使用的是 registry.k8s.io 域名下的镜像，国内访问困难
   # 本人已将 registry.k8s.io/metrics-server/metrics-server 中所有镜像上传至 https://hub.docker.com/r/xuxiaoweicomcn/metrics-server
   # 使用 gitlab 流水线下载后上传
   # 代码：https://gitlab.com/xuxiaowei-com-cn/metrics-server
   # 北京时间，每周日20点执行 auto 分支，获取最新5个标签对应的镜像并推送
   # 如果你需要的镜像版本在 https://hub.docker.com/r/xuxiaoweicomcn/metrics-server 中不存在，
   # 可以在 gitlab 项目中留言，或者等到过了周日20点后在查看
   sed -i 's|registry\.k8s\.io/metrics-server/metrics-server|docker.io/xuxiaoweicomcn/metrics-server|g' components.yaml
   
   # sed -i 's#registry.k8s.io/metrics-server/metrics-server#docker.io/xuxiaoweicomcn/metrics-server#g' components.yaml
   ```

4. 配置

   ```shell
   kubectl apply -f components.yaml
   ```

5. 查看 k8s pod、svc

   ```shell
   kubectl get pod,svc --all-namespaces -o wide
   ```

   ```shell
   [root@k8s ~]# kubectl get pod,svc --all-namespaces -o wide
   NAMESPACE     NAME                                          READY   STATUS    RESTARTS       AGE    IP               NODE   NOMINATED NODE   READINESS GATES
   default       pod/nginx-deployment-565887c86b-cb8bn         1/1     Running   1 (44m ago)    146m   172.16.77.9      k8s    <none>           <none>
   default       pod/nginx-deployment-565887c86b-xlnrc         1/1     Running   1 (142m ago)   146m   172.16.77.10     k8s    <none>           <none>
   kube-system   pod/calico-kube-controllers-57b57c56f-hvpmr   1/1     Running   1 (44m ago)    146m   172.16.77.7      k8s    <none>           <none>
   kube-system   pod/calico-node-dgtlq                         1/1     Running   1 (44m ago)    146m   192.168.61.143   k8s    <none>           <none>
   kube-system   pod/coredns-5bbd96d687-2m85c                  1/1     Running   1 (44m ago)    147m   172.16.77.6      k8s    <none>           <none>
   kube-system   pod/coredns-5bbd96d687-8pbrw                  1/1     Running   1 (44m ago)    147m   172.16.77.8      k8s    <none>           <none>
   kube-system   pod/etcd-k8s                                  1/1     Running   1 (44m ago)    147m   192.168.61.143   k8s    <none>           <none>
   kube-system   pod/kube-apiserver-k8s                        1/1     Running   1 (44m ago)    147m   192.168.61.143   k8s    <none>           <none>
   kube-system   pod/kube-controller-manager-k8s               1/1     Running   1 (44m ago)    147m   192.168.61.143   k8s    <none>           <none>
   kube-system   pod/kube-proxy-v4btv                          1/1     Running   1 (44m ago)    147m   192.168.61.143   k8s    <none>           <none>
   kube-system   pod/kube-scheduler-k8s                        1/1     Running   1 (44m ago)    147m   192.168.61.143   k8s    <none>           <none>
   kube-system   pod/metrics-server-77f557c654-2lxvn           1/1     Running   0              28m    172.16.77.13     k8s    <none>           <none>
   
   NAMESPACE     NAME                     TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                  AGE    SELECTOR
   default       service/kubernetes       ClusterIP   10.96.0.1       <none>        443/TCP                  147m   <none>
   default       service/nginx-service    NodePort    10.111.40.48    <none>        80:31222/TCP             146m   app=nginx
   kube-system   service/kube-dns         ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP,9153/TCP   147m   k8s-app=kube-dns
   kube-system   service/metrics-server   ClusterIP   10.109.92.196   <none>        443/TCP                  35m    k8s-app=metrics-server
   [root@k8s ~]# 
   ```

6. 查看 k8s pod 内存、CPU

   ```shell
   kubectl top pods --all-namespaces
   ```

   ```shell
   [root@k8s ~]# kubectl top pods --all-namespaces
   NAMESPACE     NAME                                      CPU(cores)   MEMORY(bytes)   
   default       nginx-deployment-565887c86b-cb8bn         0m           4Mi             
   default       nginx-deployment-565887c86b-xlnrc         0m           1Mi             
   kube-system   calico-kube-controllers-57b57c56f-hvpmr   2m           22Mi            
   kube-system   calico-node-dgtlq                         71m          131Mi           
   kube-system   coredns-5bbd96d687-2m85c                  3m           18Mi            
   kube-system   coredns-5bbd96d687-8pbrw                  2m           16Mi            
   kube-system   etcd-k8s                                  46m          76Mi            
   kube-system   kube-apiserver-k8s                        88m          423Mi           
   kube-system   kube-controller-manager-k8s               53m          58Mi            
   kube-system   kube-proxy-v4btv                          1m           18Mi            
   kube-system   kube-scheduler-k8s                        7m           22Mi            
   kube-system   metrics-server-77f557c654-2lxvn           6m           21Mi            
   [root@k8s ~]# 
   ```

7. 如果提示
   可能是还没启动成功，或者是配置有问题，稍等一会再试，或者查看日志

   ```shell
   [root@k8s ~]# kubectl top pod --all-namespaces
   Error from server (ServiceUnavailable): the server is currently unable to handle the request (get pods.metrics.k8s.io)
   [root@k8s ~]# 
   ```
