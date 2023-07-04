# EmptyDir 空目录

## 说明

1. [EmptyDir](https://kubernetes.io/zh-cn/docs/concepts/storage/volumes/#emptydir)
2. 与 Pod 同生命周期的 Node 临时储存
3. 在 Pod 被调度到 Node 时进行创建，在初始状态下目录是空的。
4. 与 Pod 具有相同的生命周期，当 Pod 被销毁时，Node 上相应的目录也会被删除
5. 同一个 Pod 可以有多个容器，多个容器都可以挂载这种 Volume
6. 由于 EmptyDir 类型的储存卷的临时性特点，通常在以下场景中使用
    1. 基于磁盘进行合并排序操作时需要的暂存空间
    2. 长时间计算任务的中间检查点文件
    3. 为某个Web服务提供的临时网站内容文件
7. 以下以 Nginx 的 配置文件为例

## 配置

1. 创建 EmptyDir

    ```shell
    cat > test-emptydir-pod.yaml << EOF
    
    apiVersion: v1
    kind: Pod
    metadata:
      name: test-emptydir-pod
    spec:
      containers:
      - name: nginx
        image: nginx:1.25.0
        volumeMounts:
        - mountPath: /cache
          name: cache-volume
      volumes:
      - name: cache-volume
        emptyDir: {}
    
    EOF
    
    cat test-emptydir-pod.yaml
    
    kubectl apply -f test-emptydir-pod.yaml
    
    kubectl get pod
    ```

2. 测试效果
    1. 方法1：进入 pod 内部
        1. 进入 pod 内部 `kubectl exec -it test-emptydir-pod bash`，查看文件：
            1. `ls /cache`
    2. 方法2：直接使用命令查看
        1. `kubectl exec -it test-emptydir-pod -- ls /cache`

