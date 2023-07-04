# kubernetes（k8s）高可用集群4：利用 kubeadm 创建高可用集群-堆叠（Stacked） etcd 拓扑

## 说明

1. **本文使用“堆叠（Stacked） etcd
   拓扑”，即：不需要自建etcd高可用集群，不需要[kubernetes（k8s）高可用集群2：etcd 高可用集群（非必须）](etcd-install.md)**
2. **如需使用“外部 etcd 拓扑”，即：自建etcd高可用集群，请参考：[kubernetes（k8s）高可用集群5：利用 kubeadm 创建高可用集群-外部
   etcd 拓扑](external-etcd.md)**
3. 使用两种 etcd 拓展时的区别
   由于两种方式操作时，仅存在首个 Master（Control Plane）初始化命令的区别，故仅提供更复杂的“外部 etcd
   拓扑”（自建etcd高可用集群）的具体文章步骤，本文仅介绍区别。
    1. 堆叠（Stacked） etcd 拓扑
        1. 首个 Master（Control Plane）初始化命令

            ```shell
            # https://kubernetes.io/zh-cn/docs/setup/production-environment/tools/kubeadm/high-availability/#%E4%BD%BF%E7%94%A8%E5%A0%86%E6%8E%A7%E5%88%B6%E5%B9%B3%E9%9D%A2%E5%92%8C-etcd-%E8%8A%82%E7%82%B9
            
            sudo kubeadm init --control-plane-endpoint "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT" --upload-certs --image-repository=registry.aliyuncs.com/google_containers 
            
            # LOAD_BALANCER_DNS:LOAD_BALANCER_PORT：负载均衡器的地址和端口，该端口将会被代理到 Master（Control Plane） 的控制端口，默认为 6443
            ```

        2. kube-system 命名空间存在 etcd

           ```shell
           kubectl -n kube-system get pod -o wide | grep etcd
           ```

           ```shell
           # 结果类似为：
           etcd-主机名                            1/1     Running   2 (6d21h ago)   10d   IP地址    主机名   <none>           <none>
           ```

    2. 外部 etcd 拓扑，即：自建etcd高可用集群
        1. 首个 Master（Control Plane）初始化命令

             ```shell
             # https://kubernetes.io/zh-cn/docs/setup/production-environment/tools/kubeadm/high-availability/#%E8%AE%BE%E7%BD%AE%E7%AC%AC%E4%B8%80%E4%B8%AA%E6%8E%A7%E5%88%B6%E5%B9%B3%E9%9D%A2%E8%8A%82%E7%82%B9
             
             cat > kubeadm-config.yaml << EOF
             apiVersion: kubeadm.k8s.io/v1beta3
             kind: ClusterConfiguration
             kubernetesVersion: stable
             controlPlaneEndpoint: "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT" # change this (see below)
             imageRepository=registry.aliyuncs.com/google_containers 
             etcd:
               external:
                 endpoints:
                   - https://ETCD_0_IP:2379 # 适当地更改 ETCD_0_IP，修改为你的 etcd 高可用集群的具体地址
                   - https://ETCD_1_IP:2379 # 适当地更改 ETCD_1_IP，修改为你的 etcd 高可用集群的具体地址
                   - https://ETCD_2_IP:2379 # 适当地更改 ETCD_2_IP，修改为你的 etcd 高可用集群的具体地址
                 caFile: /etc/kubernetes/pki/etcd/ca.crt # 修改为你的 etcd 高可用集群根证书的路径
                 certFile: /etc/kubernetes/pki/apiserver-etcd-client.crt # 修改为你的 etcd 高可用集群的客户端证书文件路径
                 keyFile: /etc/kubernetes/pki/apiserver-etcd-client.key # 修改为你的 etcd 高可用集群的客户端证书秘钥文件路径
             
             EOF
             
             cat kubeadm-config.yaml
             
             # # LOAD_BALANCER_DNS:LOAD_BALANCER_PORT：负载均衡器的地址和端口，该端口将会被代理到 Master（Control Plane） 的控制端口，默认为 6443
             
             sudo kubeadm init --config kubeadm-config.yaml --upload-certs
             ```

        2. kube-system 命名空间**不**存在 etcd

            ```shell
            kubectl -n kube-system get pod -o wide | grep etcd
            
            # k8s 初始化完成后，输入该命令后，应该无结果
            ```
