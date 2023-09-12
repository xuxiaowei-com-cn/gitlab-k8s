---
sidebar_position: 101
---

# gitlab runner 添加 gitlab 域名 host

## 查看 gitlab runner 日志

- 查看 gitlab runner pod 名称

```shell
[root@k8s ~]# kubectl -n gitlab-test get pod | grep gitlab-runner
my-gitlab-gitlab-runner-6458d8fb56-ttv4c             0/1     Running   5 (3m27s ago)   18m
[root@k8s ~]# 
```

- 查看 gitlab runner 日志

```shell
[root@k8s ~]# kubectl -n gitlab-test logs -f my-gitlab-gitlab-runner-6458d8fb56-ttv4c
Registration attempt 1 of 30
Runtime platform                                    arch=amd64 os=linux pid=16 revision=782e15da version=16.2.0
WARNING: Running in user-mode.                     
WARNING: The user-mode requires you to manually start builds processing:
WARNING: $ gitlab-runner run                       
WARNING: Use sudo for system-mode:                 
WARNING: $ sudo gitlab-runner...

Merging configuration from template file "/configmaps/config.template.toml"
WARNING: Support for registration tokens and runner parameters in the 'register' command has been deprecated in GitLab Runner 15.6 and will be replaced with support for authentication tokens. For more information, see https://gitlab.com/gitlab-org/gitlab/-/issues/380872
ERROR: Registering runner... failed                 runner=honxghbu status=couldn't execute POST against https://gitlab.test.helm.xuxiaowei.cn/api/v4/runners: Post "https://gitlab.test.helm.xuxiaowei.cn/api/v4/runners": dial tcp: lookup gitlab.test.helm.xuxiaowei.cn on 10.96.0.10:53: no such host
PANIC: Failed to register the runner.              
Registration attempt 2 of 30
```

- 由上述日志 `dial tcp: lookup gitlab.test.helm.xuxiaowei.cn on 10.96.0.10:53: no such host` 可知，注册失败，因为网络问题，无法连接到
  gitlab.test.helm.xuxiaowei.cn，演示环境没有 DNS 解析，两种解决方案如下：

1. 在域名服务商解析 DNS
2. 直接修改 gitlab runner 配置

## gitlab runner 添加 gitlab 的 host

### 导出现在的配置

```shell
helm -n gitlab-test get values my-gitlab > my-gitlab.yaml
```

### 添加 gitlab 的 host

示例如下

```yaml
gitlab-runner:
  hostAliases:
    - hostnames:
        - gitlab.test.helm.xuxiaowei.cn
      ip: 192.168.80.3
```

### 重新配置 gitlab

```shell
helm upgrade -n gitlab-test --install my-gitlab gitlab/gitlab -f my-gitlab.yaml --timeout 600s
```

### 查看 gitlab runner Deployment 配置

```shell
kubectl -n gitlab-test get deployment my-gitlab-gitlab-runner -o yaml
```

可以查看到，配置已经增加了域名 gitlab.test.helm.xuxiaowei.cn 解析到 192.168.80.3

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    deployment.kubernetes.io/revision: "3"
    meta.helm.sh/release-name: my-gitlab
    meta.helm.sh/release-namespace: gitlab-test
  creationTimestamp: "2023-09-11T12:51:03Z"
  generation: 3
  labels:
    app: my-gitlab-gitlab-runner
    app.kubernetes.io/managed-by: Helm
    chart: gitlab-runner-0.55.0
    heritage: Helm
    release: my-gitlab
  name: my-gitlab-gitlab-runner
  namespace: gitlab-test
  resourceVersion: "40729"
  uid: 8b103acc-c4ad-4a04-a607-5242e82205da
spec:
  progressDeadlineSeconds: 600
  replicas: 1
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      app: my-gitlab-gitlab-runner
  strategy:
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
    type: RollingUpdate
  template:
    metadata:
      annotations:
        checksum/configmap: baafa40d18ee910f46e2649abc752b6f9bd7c1daeefbcc91503f264a9f2bed81
        checksum/secrets: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
        gitlab.com/prometheus_port: "9252"
        gitlab.com/prometheus_scrape: "true"
      creationTimestamp: null
      labels:
        app: my-gitlab-gitlab-runner
        chart: gitlab-runner-0.55.0
        heritage: Helm
        release: my-gitlab
    spec:
      containers:
        - command:
            - /usr/bin/dumb-init
            - --
            - /bin/bash
            - /configmaps/entrypoint
          env:
            - name: CI_SERVER_URL
              value: https://gitlab.test.helm.xuxiaowei.cn
            - name: RUNNER_EXECUTOR
              value: kubernetes
            - name: REGISTER_LOCKED
              value: "false"
            - name: RUNNER_TAG_LIST
            - name: KUBERNETES_NAMESPACE
              value: gitlab-test
          image: registry.gitlab.com/gitlab-org/gitlab-runner:alpine-v16.2.0
          imagePullPolicy: IfNotPresent
          livenessProbe:
            exec:
              command:
                - /bin/bash
                - /configmaps/check-live
            failureThreshold: 3
            initialDelaySeconds: 60
            periodSeconds: 10
            successThreshold: 1
            timeoutSeconds: 1
          name: my-gitlab-gitlab-runner
          ports:
            - containerPort: 9252
              name: metrics
              protocol: TCP
          readinessProbe:
            exec:
              command:
                - /usr/bin/pgrep
                - gitlab.*runner
            failureThreshold: 3
            initialDelaySeconds: 10
            periodSeconds: 10
            successThreshold: 1
            timeoutSeconds: 1
          resources: { }
          securityContext:
            allowPrivilegeEscalation: false
            capabilities:
              drop:
                - ALL
            privileged: false
            readOnlyRootFilesystem: false
            runAsNonRoot: true
          terminationMessagePath: /dev/termination-log
          terminationMessagePolicy: File
          volumeMounts:
            - mountPath: /secrets
              name: projected-secrets
            - mountPath: /home/gitlab-runner/.gitlab-runner
              name: etc-gitlab-runner
            - mountPath: /configmaps
              name: configmaps
      dnsPolicy: ClusterFirst
      hostAliases:
        - hostnames:
            - gitlab.test.helm.xuxiaowei.cn
          ip: 192.168.80.3
      restartPolicy: Always
      schedulerName: default-scheduler
      securityContext:
        fsGroup: 65533
        runAsUser: 100
      serviceAccount: my-gitlab-gitlab-runner
      serviceAccountName: my-gitlab-gitlab-runner
      terminationGracePeriodSeconds: 3600
      volumes:
        - emptyDir:
            medium: Memory
          name: runner-secrets
        - emptyDir:
            medium: Memory
          name: etc-gitlab-runner
        - name: projected-secrets
          projected:
            defaultMode: 420
            sources:
              - secret:
                  name: my-gitlab-minio-secret
              - secret:
                  items:
                    - key: runner-registration-token
                      path: runner-registration-token
                    - key: runner-token
                      path: runner-token
                  name: my-gitlab-gitlab-runner-secret
        - configMap:
            defaultMode: 420
            name: my-gitlab-gitlab-runner
          name: configmaps
status:
  conditions:
    - lastTransitionTime: "2023-09-11T12:51:03Z"
      lastUpdateTime: "2023-09-11T15:45:36Z"
      message: ReplicaSet "my-gitlab-gitlab-runner-ff8b6b8f5" has successfully progressed.
      reason: NewReplicaSetAvailable
      status: "True"
      type: Progressing
    - lastTransitionTime: "2023-09-11T15:46:06Z"
      lastUpdateTime: "2023-09-11T15:46:06Z"
      message: Deployment does not have minimum availability.
      reason: MinimumReplicasUnavailable
      status: "False"
      type: Available
  observedGeneration: 3
  replicas: 1
  unavailableReplicas: 1
  updatedReplicas: 1
```

## 增加 host 后，查看 gitlab runner pod 名称

- 查看 gitlab runner pod 名称
    1. 如果出现多个，根据时间选择，查看最新的 pod

```shell
[root@k8s ~]# kubectl -n gitlab-test get pod | grep gitlab-runner
my-gitlab-gitlab-runner-ff8b6b8f5-96cmk              0/1     Running     3 (68s ago)   9m1s
[root@k8s ~]# 
```

- 查看 gitlab runner 日志

```shell
[root@k8s ~]# kubectl -n gitlab-test logs -f my-gitlab-gitlab-runner-ff8b6b8f5-96cmk
Registration attempt 1 of 30
Runtime platform                                    arch=amd64 os=linux pid=16 revision=782e15da version=16.2.0
WARNING: Running in user-mode.                     
WARNING: The user-mode requires you to manually start builds processing: 
WARNING: $ gitlab-runner run                       
WARNING: Use sudo for system-mode:                 
WARNING: $ sudo gitlab-runner...                   
                                                   
Merging configuration from template file "/configmaps/config.template.toml" 
WARNING: Support for registration tokens and runner parameters in the 'register' command has been deprecated in GitLab Runner 15.6 and will be replaced with support for authentication tokens. For more information, see https://gitlab.com/gitlab-org/gitlab/-/issues/380872 
ERROR: Registering runner... failed                 runner=honxghbu status=couldn't execute POST against https://gitlab.test.helm.xuxiaowei.cn/api/v4/runners: Post "https://gitlab.test.helm.xuxiaowei.cn/api/v4/runners": tls: failed to verify certificate: x509: certificate is valid for ingress.local, not gitlab.test.helm.xuxiaowei.cn
PANIC: Failed to register the runner.              
Registration attempt 2 of 30
```

-

由上述日志 `tls: failed to verify certificate: x509: certificate is valid for ingress.local, not gitlab.test.helm.xuxiaowei.cn`
可知，注册失败，因为使用的域名是 gitlab.test.helm.xuxiaowei.cn，但是证书仅包含 ingress.local，导致 GitLab Runner
无法正常注册

- 如果日志出现下列内容，则说明 域名与证书是匹配的，但是 <strong><font color="red">证书不是授信机构控颁发的</font></strong>
  ，需要 gitlab runner 信任此证书后，gitlab runner 才能正常注册与使用

```shell
[root@k8s ~]# kubectl -n gitlab-test logs -f my-gitlab-gitlab-runner-ff8b6b8f5-sv9b2 
Registration attempt 1 of 30
Runtime platform                                    arch=amd64 os=linux pid=16 revision=782e15da version=16.2.0
WARNING: Running in user-mode.                     
WARNING: The user-mode requires you to manually start builds processing: 
WARNING: $ gitlab-runner run                       
WARNING: Use sudo for system-mode:                 
WARNING: $ sudo gitlab-runner...                   
                                                   
Merging configuration from template file "/configmaps/config.template.toml" 
WARNING: Support for registration tokens and runner parameters in the 'register' command has been deprecated in GitLab Runner 15.6 and will be replaced with support for authentication tokens. For more information, see https://gitlab.com/gitlab-org/gitlab/-/issues/380872 
ERROR: Registering runner... failed                 runner=wgpCYf05 status=couldn't execute POST against https://gitlab.test.helm.xuxiaowei.cn/api/v4/runners: Post "https://gitlab.test.helm.xuxiaowei.cn/api/v4/runners": tls: failed to verify certificate: x509: certificate signed by unknown authority
PANIC: Failed to register the runner.              
Registration attempt 2 of 30
```

- gitlab runner 证书验证失败解决方案：[gitlab runner 信任域名证书](gitlab-runner-trust-ssl.md)
