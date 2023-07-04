# Secret

## 说明

1. [Secret](https://kubernetes.io/zh-cn/docs/concepts/configuration/secret/)
2. 与 ConfigMap 的用法类似，在 Pod 的 YAML 中可以将 Secret 设置为一个 Volume，然后在容器内通过 volumeMounts 将 Secret 类型的
   Volume 挂载到指定目录下
3. 以下以 Nginx 为例

## 配置

1. 创建 Secret：my-secret.yaml

    ```shell
    cat > my-secret.yaml << EOF
    # https://kubernetes.io/zh-cn/docs/concepts/configuration/secret/
    # 创建 Secret
    apiVersion: v1
    kind: Secret
    metadata:
      # Secret 名称
      # 注意：此处为冗余写法（相同命名空间、相同名称只会存在一个 Secret）
      name: my-secret
      # 命名空间
      # namespace: xuxiaowei-cloud
    # Secret 类型 Opaque 用于存储任何基于字节数组的数据
    type: Opaque
    data:
      # password：Secret 名称为 "my-secret"，主键为 "password" 的值
      # 这里的值是经过 base64 编码处理的 MySQL root 用户密码，需要解码才能使用
      # xuxiaowei.com.cn 计算 base64 之后为 eHV4aWFvd2VpLmNvbS5jbg==
      password: eHV4aWFvd2VpLmNvbS5jbg==
    
    EOF
    
    cat my-secret.yaml
    
    kubectl apply -f my-secret.yaml
    
    kubectl get secret
    ```

2. 使用 Secret：nginx-deployment-secret.yaml

    ```shell
    cat > nginx-deployment-secret.yaml << EOF
    # https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/deployment/
    # 创建 Deployment
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      # Deployment 名称
      name: nginx-deployment-secret
      # 命名空间
      # namespace: xuxiaowei-cloud
    spec:
      selector:
        matchLabels:
          app: nginx-secret
      replicas: 1
      template:
        metadata:
          labels:
            app: nginx-secret
        spec:
          containers:
            - name: nginx
              # https://hub.docker.com/_/nginx
              # Nginx 版本
              image: nginx:1.25.0
              ports:
                # 容器开放的端口号
                - containerPort: 80
              volumeMounts:
                # 挂载主机的时区文件
                - name: time-zone
                  mountPath: /etc/localtime
                # 引用 Secret 创建文件
                - name: foo
                  mountPath: /etc/foo
    
          # https://kubernetes.io/zh-cn/docs/concepts/storage/volumes/
          # 配置挂载的数据卷
          volumes:
            # 挂载主机的时区文件
            - name: time-zone
              hostPath:
                path: /etc/localtime
            # 引用 Secret 创建文件
            - name: foo
              secret:
                secretName: my-secret
    
    ---
    
    # https://kubernetes.io/zh-cn/docs/concepts/services-networking/service/
    # 创建 Service
    apiVersion: v1
    kind: Service
    metadata:
      # Service 名称
      name: nginx-service-secret
      # 命名空间
      # namespace: xuxiaowei-cloud
    spec:
      ports:
        # NodePort：集群外部对 Service 访问使用的端口（默认范围：30000~32767）
        # port：Service 内部的端口号
        # targetPort：暴露的 Deployment 中容器的端口号
        # protocol：端口协议，TCP 或 UDP
        # name：仅在存在多个配置时需要填写，如果填写，必须使用字符串（数字需要添加引号）
        - nodePort: 30081
          port: 80
          protocol: TCP
          targetPort: 80
      selector:
        # 将 Service 和 Deployment 关联起来
        app: nginx-secret
      # NodePort 会将该 Service 暴露到整个集群中的节点上，让外部客户端可以通过节点 IP + NodePort 的方式来访问该 Service
      # 还有 ClusterIP 和 LoadBalancer 类型，具体可参考文档
      type: NodePort
    
    EOF
    
    cat nginx-deployment-secret.yaml
    
    kubectl apply -f nginx-deployment-secret.yaml
    
    kubectl get pod
    kubectl get svc
    ```

3. 测试效果
    1. 方法1：进入 pod 内部 `kubectl exec -it nginx的pod名称 bash`，查看 Secret
        1. `cat /etc/foo/password`
    2. 方法2：直接使用命令查看日志
        1. `kubectl exec -it nginx的pod名称 -- cat /etc/foo/password`

