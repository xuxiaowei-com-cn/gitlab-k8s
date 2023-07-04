# Projected Volume 投射卷

## 说明

1. [投射卷](https://kubernetes.io/zh-cn/docs/concepts/storage/projected-volumes/)
2. 如果想把配置文件（ConfigMap）和秘钥文件（Secret）放在容器内的同一目录下，通过多个 Volume 是**无法实现**的
3. Projected Volume 投射卷是一种特殊的储存卷类型，用于将一个或多个资源对象（ConfigMap、Secret、Downward API）一次性挂载到容器的同一目录下
4. ServiceAccountToken 通常用于容器内应用访问 API Server 鉴权的场景
5. 以下以 Nginx 为例

## 配置 Projected Volume 中的 ConfigMap、Secret、Downward API

1. 创建 Projected Volume

    ```shell
    cat > projected.yaml << EOF
    
    apiVersion: v1
    kind: Secret
    metadata:
      name: projected-mysecret-1
    type: Opaque
    data:
      # xuxiaowei 计算 Base64 为 eHV4aWFvd2Vp
      username: eHV4aWFvd2Vp
    
    ---
    
    apiVersion: v1
    kind: Secret
    metadata:
      name: projected-mysecret-2
    type: Opaque
    data:
      # xuxiaowei.com.cn 计算 Base64 为 eHV4aWFvd2VpLmNvbS5jbg==
      password: eHV4aWFvd2VpLmNvbS5jbg==
    
    ---
    
    # https://kubernetes.io/zh-cn/docs/concepts/configuration/configmap/
    # 查看 描述 ：kubectl -n xuxiaowei-cloud describe configmap nginx-default-config-map
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: projected-myconfigmap
    data:
      my-config: |
        server {
          listen       80;
          listen  [::]:80;
          server_name  localhost;
        
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
    
    ---
    
    apiVersion: v1
    kind: Pod
    metadata:
      name: projected-volume-test-1
      labels:
        zone: us-est-coast
        cluster: test-cluster1
        rack: rack-22
      annotations:
        build: two
        builder: john-doe
    spec:
      containers:
        - name: container-test
          image: nginx:1.25.0
          volumeMounts:
            - name: all-in-one
              mountPath: "/projected-volume"
              readOnly: true
      volumes:
        - name: all-in-one
          projected:
            sources:
              - secret:
                  name: projected-mysecret-1
                  items:
                    - key: username
                      path: my-group/my-username
              - downwardAPI:
                  items:
                    - path: "labels"
                      fieldRef:
                        fieldPath: metadata.labels
                    - path: "cpu_limit"
                      resourceFieldRef:
                        containerName: container-test
                        resource: limits.cpu
              - configMap:
                  name: projected-myconfigmap
                  items:
                    - key: my-config
                      path: my-group/my-config
    
    ---
    
    apiVersion: v1
    kind: Pod
    metadata:
      name: projected-volume-test-2
    spec:
      containers:
        - name: container-test
          image: nginx:1.25.0
          volumeMounts:
            - name: all-in-one
              mountPath: "/projected-volume"
              readOnly: true
      volumes:
        - name: all-in-one
          projected:
            sources:
              - secret:
                  name: projected-mysecret-1
                  items:
                    - key: username
                      path: my-group/my-username
              - secret:
                  name: projected-mysecret-2
                  items:
                    - key: password
                      path: my-group/my-password
                      mode: 511
    
    EOF
    
    cat projected.yaml
    
    kubectl apply -f projected.yaml
    
    kubectl get configmap
    kubectl get secret
    kubectl get pod
    ```

2. 测试效果
    1. 方法1：进入 pod 内部
        1. 进入 pod 内部 `kubectl exec -it projected-volume-test-1 bash`，查看文件：
            1. `cat /projected-volume/cpu_limit`
            2. `cat /projected-volume/my-group/my-config`
            3. `cat /projected-volume/my-group/my-username`
            4. `cat /projected-volume/labels`
        2. 进入 pod 内部 `kubectl exec -it projected-volume-test-2 bash`，查看文件：
            1. `cat /projected-volume/my-group/my-username`
            2. `cat /projected-volume/my-group/my-password`
    2. 方法2：直接使用命令查看
        1. `kubectl exec -it projected-volume-test-1 -- cat /projected-volume/cpu_limit`
        2. `kubectl exec -it projected-volume-test-1 -- cat /projected-volume/my-group/my-config`
        3. `kubectl exec -it projected-volume-test-1 -- cat /projected-volume/my-group/username`
        4. `kubectl exec -it projected-volume-test-1 -- cat /projected-volume/labels`
        5. `kubectl exec -it projected-volume-test-2 -- cat /projected-volume/my-group/username`
        6. `kubectl exec -it projected-volume-test-2 -- cat /projected-volume/my-group/password`

## 配置 Projected Volume 中的 ServiceAccountToken

1. 创建 Projected Volume

    ```shell
    cat > projected-volume-service-account-token.yaml << EOF
    apiVersion: v1
    kind: Pod
    metadata:
      name: projected-volume-service-account-token
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
            - name: token-vol
              mountPath: "/service-account"
              readOnly: true
    
      # https://kubernetes.io/zh-cn/docs/concepts/storage/volumes/
      # 配置挂载的数据卷
      volumes:
        # 挂载主机的时区文件
        - name: time-zone
          hostPath:
            path: /etc/localtime
        - name: token-vol
          projected:
            sources:
              - serviceAccountToken:
                  # 预期受众的名称
                  audience: api
                  # 过期时间，默认 1h，最少 10min，管理员可以通过 kube-apiserver 启动参数 --service-account-max-token-expiration 限制令牌的最长有效期
                  expirationSeconds: 3600
                  path: token
    
    EOF
    
    cat projected-volume-service-account-token.yaml
    
    kubectl apply -f projected-volume-service-account-token.yaml
    
    kubectl get pod
    ```

2. 测试效果
    1. 方法1：进入 pod 内部 `kubectl exec -it projected-volume-service-account-token bash`，查看文件
        1. `cat /service-account/token`
    2. 方法2：直接使用命令查看文件
        1. `kubectl exec -it projected-volume-service-account-token -- cat /service-account/token`

