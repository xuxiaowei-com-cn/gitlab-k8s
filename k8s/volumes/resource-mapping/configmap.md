# ConfigMap

## 说明

1. [ConfigMap](https://kubernetes.io/zh-cn/docs/concepts/configuration/configmap/)
2. ConfigMap 主要保存应用程序所需的配置文件，并且通过 Volume 形式挂载到容器内的文件系统中，供容器内的应用程序读取。
3. 以下以 Nginx 的 配置文件为例

## 配置

1. 创建 ConfigMap：nginx-default-config-map.yaml
   默认是不生成日志文件 `/var/log/nginx/host.access.log`

    ```shell
    cat > nginx-default-config-map.yaml << EOF
    # https://kubernetes.io/zh-cn/docs/concepts/configuration/configmap/
    # 查看 描述 ：kubectl -n xuxiaowei-cloud describe configmap nginx-default-config-map
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: nginx-default-config-map
      # 命名空间
      # namespace: xuxiaowei-cloud
    data:
      # 此配置文件的作用：仅仅是为了增加日志
      default.conf: |
        server {
          listen       80;
          listen  [::]:80;
          server_name  localhost;
        
          # 此配置文件的作用：仅仅是为了增加日志
          access_log  /var/log/nginx/host.access.log  main;
        
          location / {
              root   /usr/share/nginx/html;
              index  index.html index.htm;
          }
          error_page   500 502 503 504  /50x.html;
          location = /50x.html {
              root   /usr/share/nginx/html;
          }
        }
    
    EOF
    
    cat nginx-default-config-map.yaml
    
    kubectl apply -f nginx-default-config-map.yaml
    
    kubectl get configmap
    ```

2. 使用 ConfigMap：nginx-deployment.yaml

    ```shell
    cat > nginx-deployment.yaml << EOF
    # https://kubernetes.io/zh-cn/docs/concepts/workloads/controllers/deployment/
    # 创建 Deployment
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      # Deployment 名称
      name: nginx-deployment
      # 命名空间
      # namespace: xuxiaowei-cloud
    spec:
      selector:
        matchLabels:
          app: nginx
      replicas: 1
      template:
        metadata:
          labels:
            app: nginx
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
                # 引用 ConfigMap 创建配置文件
                - name: nginx-default-config-volume
                  # 挂载到容器的目录
                  # 用于配置 Nginx
                  mountPath: /etc/nginx/conf.d/
    
          # https://kubernetes.io/zh-cn/docs/concepts/storage/volumes/
          # 配置挂载的数据卷
          volumes:
            # 挂载主机的时区文件
            - name: time-zone
              hostPath:
                path: /etc/localtime
            # 引用 ConfigMap 创建配置文件
            - name: nginx-default-config-volume
              configMap:
                name: nginx-default-config-map
                items:
                  - key: default.conf
                    path: default.conf
    
    ---
    
    # https://kubernetes.io/zh-cn/docs/concepts/services-networking/service/
    # 创建 Service
    apiVersion: v1
    kind: Service
    metadata:
      # Service 名称
      name: nginx-service
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
        app: nginx
      # NodePort 会将该 Service 暴露到整个集群中的节点上，让外部客户端可以通过节点 IP + NodePort 的方式来访问该 Service
      # 还有 ClusterIP 和 LoadBalancer 类型，具体可参考文档
      type: NodePort
    
    
    EOF
    
    cat nginx-deployment.yaml
    
    kubectl apply -f nginx-deployment.yaml
    
    kubectl get pod
    kubectl get svc
    ```

3. 测试效果
    1. 访问 http://k8s宿主机IP:30080，观察是否返回 Nginx 默认页面（触发日志生成）
    2. 查看日志文件
        1. 方法1：进入 pod 内部 `kubectl exec -it nginx的pod名称 bash`，查看日志
            1. `tail -f /var/log/nginx/host.access.log`
        2. 方法2：直接使用命令查看日志
            1. `kubectl exec -it nginx的pod名称 -- tail -f /var/log/nginx/host.access.log`

 
