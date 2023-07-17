# HostPath 宿主机路径

## 说明

1. [HostPath](https://kubernetes.io/zh-cn/docs/concepts/storage/volumes/#hostpath)
2. 用于将 Node 文件系统的目录或文件挂载到容器内部使用
3. 适合的场景
    1. 容器应用的关键数据需要持久化到宿主机上
    2. 需要使用Docker中的某些内部数据，可以将主机的 `/var/lib/docker` 目录挂载到容器内
    3. 监控系统，例如 cAdvisor 需要采集宿主机 `/sys` 目录下的内容
    4. Pod 的启动/运行依赖于宿主机上的某个目录或文件
        1. 容器需要与宿主机使用相同的时区（挂载 `/etc/localtime`）
        2. 容器需要与宿主机使用相同的本地 DNS（挂载 `/etc/hosts`，如：自建 GitLab 时，GitLab 使用的是域名，无 DNS
           记录，宿主机自定义了 `hosts`可以访问，而新建的容器无法访问 GitLab 的域名）
4. 注意事项
    1. 如果有多个 Node 节点时，多个 Node 节点上需要被挂载的文件（夹）不同时，会导致多个 Pod 结果不同（例如：多个 Node
       节点上的时区/`hosts`不同，可能会导致多个Pod的时区/`hosts`不同）
    2. 基于储存资源情况的调度策略，无法计算 HostPath 目录下的磁盘空间，无法计入 Node 的可用资源范围内，可能出现与预期不同的调度结果
    3. 如果路径不存在，kubectl 会自动创建目录或文件，owner（所有者）是 root（超级管理员），这意味着容器中的用户（User）不是 root
       则无法进行写操作，除非容器时以特权模式（Privileged）运行，或者修改 HostPath 的权限以支持非 root 用户可写
    4. HostPath 设置的宿主机目录或文件，不会跟着 Pod 的销毁而删除，只能人为删除
5. 以下以 Nginx 的 配置文件为例

## 配置

1. 创建 hostPath，挂载 `/etc/localtime`

    ```shell
    cat > host-path-volume-pod.yaml << EOF
    
    apiVersion: v1
    kind: Pod
    metadata:
      name: host-path-volume-pod
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
    
      # https://kubernetes.io/zh-cn/docs/concepts/storage/volumes/
      # 配置挂载的数据卷
      volumes:
        # 挂载主机的时区文件
        - name: time-zone
          hostPath:
            path: /etc/localtime
    
    EOF
    
    cat host-path-volume-pod.yaml
    
    kubectl apply -f host-path-volume-pod.yaml
    
    kubectl get pod
    ```

   测试时间

    ```shell
    # 如果没有 volume 相关的配置，默认为 格林尼治标准时间（0 时区），与北京时间相差 8 小时
    # 如果挂载了宿主机的 /etc/localtime 文件，时间输出与宿主机时间相同，为北京时间（以宿主机是东8区北京时间为例）
    kubectl exec -it host-path-volume-pod date
    ```

2. 创建 hostPath，指定 `type: Directory`

    ```shell
    cat > host-path-directory-volume-pod.yaml << EOF
    apiVersion: v1
    kind: Pod
    metadata:
      name: host-path-directory-volume-pod
    spec:
      containers:
        - name: nginx
          # https://hub.docker.com/_/nginx
          # Nginx 版本
          image: nginx:1.25.0
          volumeMounts:
            - mountPath: /host-data
              name: test-volume
      volumes:
        - name: test-volume
          hostPath:
            path: /data
            # 可选配置
            # Directory 表示 目录必须存在，否则 pod 无法创建
            type: Directory
    
    EOF
    
    cat host-path-directory-volume-pod.yaml
    
    kubectl apply -f host-path-directory-volume-pod.yaml
    
    kubectl get pod
    ```

3. 创建 hostPath，指定 `type: FileOrCreate/DirectoryOrCreate`
   对于 type 为 `FileOrCreate` 模式的情况，需要注意的是
    1. 如果挂载文件有上层目录，则系统不会自动创建上层目录，当上层目录不存在时，Pod 将启动失败
    2. 可以将上层目录也设置为一个 hostPath 类型的 Volume，并且设置 type 为 `DirectoryOrCreate`，确保目录不存在时，系统将该目录自动创建出来

    ```shell
    cat > host-path-file-or-create-volume-pod.yaml << EOF
    apiVersion: v1
    kind: Pod
    metadata:
      name: host-path-file-or-create-volume-pod
    spec:
      containers:
        - name: nginx
          # https://hub.docker.com/_/nginx
          # Nginx 版本
          image: nginx:1.25.0
          volumeMounts:
            - mountPath: /var/local/aaa
              name: mydir
            - mountPath: /var/local/aaa/1.txt
              name: myfile
      volumes:
        - name: mydir
          hostPath:
            path: /var/local/aaa					# 文件 1.txt 的上层目录
            type: DirectoryOrCreate				# 确保该目录存在
        - name: myfile
          hostPath:
            path: /var/local/aaa/1.txt
            type: FileOrCreate						# 确保该文件存在
    
    EOF
    
    cat host-path-file-or-create-volume-pod.yaml
    
    kubectl apply -f host-path-file-or-create-volume-pod.yaml
    
    kubectl get pod
    ```
