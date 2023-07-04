# Downward API

## 说明

1. [Downward API](https://kubernetes.io/zh-cn/docs/concepts/workloads/pods/downward-api/)
2. 通过 Downward API 可以将 Pod 或 Container 的某些元数据信息（例如：Pod 名称、Pod IP、Node
   IP、Label、Annotation、容器资源限制等）以文件的形式挂载到容器内，供容器内的应用使用。
3. 以下示例将 Pod 的标签通过 Downward API 挂载为容器内文件。

## 配置

1. 创建 Downward API

    ```shell
    cat > downwardapi.yaml << EOF
    
    apiVersion: v1
    kind: Pod
    metadata:
      name: kubernetes-downwardapi-volume-example
      labels:
        zone: us-est-coast
        cluster: test-cluster1
        rack: rack-22
      annotations:
        build: two
        builder: john-doe
    spec:
      containers:
        - name: client-container
          image: busybox
          command: [ "sh", "-c" ]
          args:
            # 循环查看 /etc/podinfo/labels、/etc/podinfo/annotations 文件
            - while true; do
              if [[ -e /etc/podinfo/labels ]]; then
              echo -en '\n\n'; cat /etc/podinfo/labels; fi;
              if [[ -e /etc/podinfo/annotations ]]; then
              echo -en '\n\n'; cat /etc/podinfo/annotations; fi;
              sleep 5;
              done;
          volumeMounts:
            - name: podinfo
              mountPath: /etc/podinfo
      volumes:
        - name: podinfo
            # Downward API 配置
          downwardAPI:
            items:
              - path: "labels"
                fieldRef:
                  fieldPath: metadata.labels
              - path: "annotations"
                fieldRef:
                  fieldPath: metadata.annotations
    
    EOF
    
    cat downwardapi.yaml
    
    kubectl apply -f downwardapi.yaml
    
    kubectl get pod
    ```

2. 测试效果
    1. 方法1：进入 pod 内部 `kubectl exec -it kubernetes-downwardapi-volume-example sh`，查看文件
        1. `cat /etc/podinfo/annotations`
        2. `cat /etc/podinfo/labels`
    2. 方法2：直接使用命令查看文件
        1. `kubectl exec -it kubernetes-downwardapi-volume-example -- cat /etc/podinfo/annotations`
        2. `kubectl exec -it kubernetes-downwardapi-volume-example -- cat /etc/podinfo/labels`
    3. 方法3：由于启动是一直循环使用 `cat` 查看文件，所以可以通过日志查看
        1. `kubectl logs -f kubernetes-downwardapi-volume-example`

