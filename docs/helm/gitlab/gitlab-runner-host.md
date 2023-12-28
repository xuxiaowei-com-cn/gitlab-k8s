---
sidebar_position: 101
---

# GitLab Runner 添加 GitLab 域名 host

自定义 GitLab 域名解析

## 查看 gitlab runner 日志

- 查看 gitlab runner pod 名称

```shell
[root@anolis-7-9 ~]# kubectl -n gitlab-test get pod | grep gitlab-runner
my-gitlab-gitlab-runner-6fb4bf7468-nmnkp             0/1     Running   29 (62s ago)     117m
[root@anolis-7-9 ~]# 
```

- 查看 gitlab runner 日志

```shell
[root@anolis-7-9 ~]# kubectl -n gitlab-test logs -f my-gitlab-gitlab-runner-6fb4bf7468-nmnkp 
Registration attempt 1 of 30
Runtime platform                                    arch=amd64 os=linux pid=16 revision=f5da3c5a version=16.6.1
WARNING: Running in user-mode.                     
WARNING: The user-mode requires you to manually start builds processing: 
WARNING: $ gitlab-runner run                       
WARNING: Use sudo for system-mode:                 
WARNING: $ sudo gitlab-runner...                   
                                                   
Merging configuration from template file "/configmaps/config.template.toml" 
WARNING: Support for registration tokens and runner parameters in the 'register' command has been deprecated in GitLab Runner 15.6 and will be replaced with support for authentication tokens. For more information, see https://docs.gitlab.com/ee/ci/runners/new_creation_workflow 
ERROR: Registering runner... failed                 runner=BtGwLEwc status=couldn't execute POST against https://gitlab.test.helm.xuxiaowei.cn/api/v4/runners: Post "https://gitlab.test.helm.xuxiaowei.cn/api/v4/runners": dial tcp: lookup gitlab.test.helm.xuxiaowei.cn on 10.96.0.10:53: no such host
PANIC: Failed to register the runner.              
Registration attempt 2 of 30
Runtime platform                                    arch=amd64 os=linux pid=25 revision=f5da3c5a version=16.6.1
WARNING: Running in user-mode.                     
WARNING: The user-mode requires you to manually start builds processing: 
WARNING: $ gitlab-runner run                       
WARNING: Use sudo for system-mode:                 
WARNING: $ sudo gitlab-runner...                   
                                                   
Merging configuration from template file "/configmaps/config.template.toml" 
WARNING: Support for registration tokens and runner parameters in the 'register' command has been deprecated in GitLab Runner 15.6 and will be replaced with support for authentication tokens. For more information, see https://docs.gitlab.com/ee/ci/runners/new_creation_workflow 
ERROR: Registering runner... failed                 runner=BtGwLEwc status=couldn't execute POST against https://gitlab.test.helm.xuxiaowei.cn/api/v4/runners: Post "https://gitlab.test.helm.xuxiaowei.cn/api/v4/runners": dial tcp: lookup gitlab.test.helm.xuxiaowei.cn on 10.96.0.10:53: no such host
PANIC: Failed to register the runner.              
Registration attempt 3 of 30
Runtime platform                                    arch=amd64 os=linux pid=33 revision=f5da3c5a version=16.6.1
WARNING: Running in user-mode.                     
WARNING: The user-mode requires you to manually start builds processing: 
WARNING: $ gitlab-runner run                       
WARNING: Use sudo for system-mode:                 
WARNING: $ sudo gitlab-runner...
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
      ip: 172.25.25.32
```

### 重新配置 gitlab

```shell
helm upgrade -n gitlab-test --install my-gitlab gitlab/gitlab -f my-gitlab.yaml --timeout 600s
```

### 查看 gitlab runner Deployment 配置

```shell
kubectl -n gitlab-test get deployment my-gitlab-gitlab-runner -o yaml
```

可以查看到，配置已经增加了域名 gitlab.test.helm.xuxiaowei.cn 解析到 172.25.25.32

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    deployment.kubernetes.io/revision: "2"
    meta.helm.sh/release-name: my-gitlab
    meta.helm.sh/release-namespace: gitlab-test
  creationTimestamp: "2023-12-22T05:03:46Z"
  generation: 2
  labels:
    app: my-gitlab-gitlab-runner
    app.kubernetes.io/managed-by: Helm
    chart: gitlab-runner-0.59.2
    heritage: Helm
    release: my-gitlab
  name: my-gitlab-gitlab-runner
  namespace: gitlab-test
  resourceVersion: "24030"
  uid: 8c46c44a-5b67-44ae-90d0-008daa3fa388
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
        checksum/configmap: f35865354f043583d0903b0a8350830a486eb0e289d18271cf3f533e7d89c5f7
        checksum/secrets: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
        gitlab.com/prometheus_port: "9252"
        gitlab.com/prometheus_scrape: "true"
      creationTimestamp: null
      labels:
        app: my-gitlab-gitlab-runner
        chart: gitlab-runner-0.59.2
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
          image: registry.gitlab.com/gitlab-org/gitlab-runner:alpine-v16.6.1
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
            timeoutSeconds: 3
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
            timeoutSeconds: 3
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
          ip: 172.25.25.32
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
  availableReplicas: 1
  conditions:
    - lastTransitionTime: "2023-12-22T07:04:29Z"
      lastUpdateTime: "2023-12-22T07:04:29Z"
      message: Deployment has minimum availability.
      reason: MinimumReplicasAvailable
      status: "True"
      type: Available
    - lastTransitionTime: "2023-12-22T05:03:46Z"
      lastUpdateTime: "2023-12-22T07:04:29Z"
      message: ReplicaSet "my-gitlab-gitlab-runner-f59d8c4b8" is progressing.
      reason: ReplicaSetUpdated
      status: "True"
      type: Progressing
  observedGeneration: 2
  readyReplicas: 1
  replicas: 2
  unavailableReplicas: 1
  updatedReplicas: 1
```

## 增加 host 后，查看 gitlab runner pod 名称

- 查看 gitlab runner pod 名称
    1. 如果出现多个，根据时间选择，查看最新的 pod

```shell
[root@anolis-7-9 ~]# kubectl -n gitlab-test get pod | grep gitlab-runner
my-gitlab-gitlab-runner-f59d8c4b8-jcr6k              0/1     Running       0                2m27s
[root@anolis-7-9 ~]# 
```

- 查看 gitlab runner 日志

```shell
[root@anolis-7-9 ~]# kubectl -n gitlab-test logs -f my-gitlab-gitlab-runner-f59d8c4b8-jcr6k 
Registration attempt 1 of 30
Runtime platform                                    arch=amd64 os=linux pid=16 revision=f5da3c5a version=16.6.1
WARNING: Running in user-mode.                     
WARNING: The user-mode requires you to manually start builds processing: 
WARNING: $ gitlab-runner run                       
WARNING: Use sudo for system-mode:                 
WARNING: $ sudo gitlab-runner...                   
                                                   
Merging configuration from template file "/configmaps/config.template.toml" 
WARNING: Support for registration tokens and runner parameters in the 'register' command has been deprecated in GitLab Runner 15.6 and will be replaced with support for authentication tokens. For more information, see https://docs.gitlab.com/ee/ci/runners/new_creation_workflow 
ERROR: Registering runner... failed                 runner=BtGwLEwc status=couldn't execute POST against https://gitlab.test.helm.xuxiaowei.cn/api/v4/runners: Post "https://gitlab.test.helm.xuxiaowei.cn/api/v4/runners": tls: failed to verify certificate: x509: certificate signed by unknown authority
PANIC: Failed to register the runner.              
Registration attempt 2 of 30
Runtime platform                                    arch=amd64 os=linux pid=24 revision=f5da3c5a version=16.6.1
WARNING: Running in user-mode.                     
WARNING: The user-mode requires you to manually start builds processing: 
WARNING: $ gitlab-runner run                       
WARNING: Use sudo for system-mode:                 
WARNING: $ sudo gitlab-runner...                   
                                                   
Merging configuration from template file "/configmaps/config.template.toml" 
WARNING: Support for registration tokens and runner parameters in the 'register' command has been deprecated in GitLab Runner 15.6 and will be replaced with support for authentication tokens. For more information, see https://docs.gitlab.com/ee/ci/runners/new_creation_workflow 
ERROR: Registering runner... failed                 runner=BtGwLEwc status=couldn't execute POST against https://gitlab.test.helm.xuxiaowei.cn/api/v4/runners: Post "https://gitlab.test.helm.xuxiaowei.cn/api/v4/runners": tls: failed to verify certificate: x509: certificate signed by unknown authority
PANIC: Failed to register the runner.              
Registration attempt 3 of 30
Runtime platform                                    arch=amd64 os=linux pid=33 revision=f5da3c5a version=16.6.1
WARNING: Running in user-mode.                     
WARNING: The user-mode requires you to manually start builds processing: 
WARNING: $ gitlab-runner run                       
WARNING: Use sudo for system-mode:                 
WARNING: $ sudo gitlab-runner...
```

```shell
[root@anolis-7-9 ~]# kubectl -n gitlab-test logs -f my-gitlab-gitlab-runner-f59d8c4b8-jcr6k 
Registration attempt 1 of 30
Runtime platform                                    arch=amd64 os=linux pid=16 revision=782e15da version=16.2.0
WARNING: Running in user-mode.                     
WARNING: The user-mode requires you to manually start builds processing: 
WARNING: $ gitlab-runner run                       
WARNING: Use sudo for system-mode:                 
WARNING: $ sudo gitlab-runner...                   
                                                   
Merging configuration from template file "/configmaps/config.template.toml" 
WARNING: Support for registration tokens and runner parameters in the 'register' command has been deprecated in GitLab Runner 15.6 and will be replaced with support for authentication tokens. For more information, see https://gitlab.com/gitlab-org/gitlab/-/issues/380872 
ERROR: Registering runner... failed                 runner=wgpCYf05 status=couldn't execute POST against https://gitlab.test.helm.xuxiaowei.cn/api/v4/runners: Post "https://gitlab.test.helm.xuxiaowei.cn/api/v4/runners": tls: failed to verify certificate: x509: certificate is valid for ingress.local, not gitlab.test.helm.xuxiaowei.cn
PANIC: Failed to register the runner.              
Registration attempt 2 of 30
```

- 由上述日志
  `tls: failed to verify certificate: x509: certificate signed by unknown authority` 或
  `tls: failed to verify certificate: x509: certificate is valid for ingress.local, not gitlab.test.helm.xuxiaowei.cn`
  可知，注册失败

- 失败原因
    1. 未配置证书，使用软件自己生成的证书，属于不合法的证书，默认无法信任
    2. 由于安装 helm gitlab 过程中，修改过域名，而域名证书没有重新生成（即使重新生成也无法信任），默认无法信任
    3. 如果自己正确配置了合法证书，但是还是无法验证，原因是证书链太新，gitlab runner 镜像中没有包含此证书链，所以导致无法信任

- gitlab runner 证书验证失败解决方案：[gitlab runner 信任域名证书](gitlab-runner-trust-ssl.md)
