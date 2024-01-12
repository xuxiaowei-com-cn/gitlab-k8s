---
sidebar_position: 13
---

# 创建指定命名空间权限的 KUBECONFIG 文件

- `kubectl` 默认使用 环境变量 `KUBECONFIG`、当前用户文件夹下的 `.kube/config` 作为默认配置来控制 `apiserver`
- `kubectl` 可通过参数 `--kubeconfig` 指定使用的配置文件
- 通过 `kubectl` 配置文件的数据结构（yml 数据结构，部分配置是 Map 类型）可知，一个配置文件可以包含多个 k8s 配置（这些配置可以是同一个
  k8s 不同命名空间的配置，也可以是多个不同 k8s 的配置），可通过修改配置文件中的 `current-context` 来改变默认启用哪个配置

## 文档

1. [命名空间](https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/namespaces/)
2. [服务账号](https://kubernetes.io/zh-cn/docs/concepts/security/service-accounts/)
3. [为 Pod 配置服务账号](https://kubernetes.io/zh-cn/docs/tasks/configure-pod-container/configure-service-account/)
4. [使用 RBAC 鉴权](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)
5. [RoleBinding](https://kubernetes.io/zh-cn/docs/reference/kubernetes-api/authorization-resources/role-binding-v1/)
6. [Secret](https://kubernetes.io/zh-cn/docs/concepts/configuration/secret/)

## 配置

### 环境变量（根据自己的情况与需求设置）

```shell
# namespace 命名空间的名字
export NAMESPACE_NAME=test-namespace
# serviceaccount 服务账号的名字
export SERVICE_ACCOUNT_NAME=test-serviceaccount
# role 使用 RBAC 鉴权的名字
export ROLE_NAME=test-tole
# roleBinding
export ROLEBINDING_NAME=test-rolebinding
# secret
export SECRET_NAME=test-secret

# 集群名称
export CLUSTER_NAME=test-cluster
# 集群地址
export CLUSTER_SERVER=https://192.168.80.3:6443
# 用户
export USER_NAME=test-user
# 当前上下文
export CONTEXT_NAME=test-context
```

### 创建 Namespaces

```shell
kubectl create namespace $NAMESPACE_NAME
```

### 创建一个 ServiceAccount

```shell
kubectl -n $NAMESPACE_NAME create serviceaccount $SERVICE_ACCOUNT_NAME
```

### 创建 Role（根据自己的情况与需求设置）

```shell
cat > role.yaml << EOF
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: $NAMESPACE_NAME
  name: $ROLE_NAME
rules:
- apiGroups: [""] # "" 标明 核心 API 组
  resources: ["pods", "pods/log", "pods/exec", "pods/attach", "services", "secrets", "configmaps", "replicationcontrollers"] # 根据自己的情况与需求设置。使用命令 kubectl api-resources 获取所有可选配置
  verbs: ["*"] # 根据自己的情况与需求设置。* 代表授予所有权限，可选配置如：get, watch, list, create, update, patch, delete, proxy
- apiGroups: ["apps"]
  resources: ["deployments", "replicasets", "statefulsets", "daemonsets"]
  verbs: ["*"]
- apiGroups: ["batch"]
  resources: ["jobs", "cronjobs"]
  verbs: ["*"]
- apiGroups: ["networking.k8s.io"]
  resources: ["ingresses"]
  verbs: ["*"]

EOF
```

```shell
cat role.yaml
```

```shell
kubectl apply -f role.yaml
```

### 创建 RoleBinding

```shell
cat > rolebinding.yaml << EOF
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: $ROLEBINDING_NAME
  namespace: $NAMESPACE_NAME
subjects:
- kind: ServiceAccount
  name: $SERVICE_ACCOUNT_NAME
  namespace: $NAMESPACE_NAME
roleRef:
  kind: Role
  name: $ROLE_NAME
  apiGroup: rbac.authorization.k8s.io

EOF
```

```shell
cat rolebinding.yaml
```

```shell
kubectl apply -f rolebinding.yaml
```

### 创建 ServiceAccount 的 Secret

```shell
cat > serviceaccount-token-secret.yaml << EOF
apiVersion: v1
kind: Secret
metadata:
  name: $SECRET_NAME
  namespace: $NAMESPACE_NAME
  annotations:
    kubernetes.io/service-account.name: $SERVICE_ACCOUNT_NAME
type: kubernetes.io/service-account-token

EOF
```

```shell
cat serviceaccount-token-secret.yaml
```

```shell
kubectl apply -f serviceaccount-token-secret.yaml
```

### 创建 KUBECONFIG 文件

1. 导出 secret 中的 token
    ```shell
    kubectl -n $NAMESPACE_NAME get secret $SECRET_NAME -o jsonpath='{.data.token}' | base64 --decode > token
    ```
    ```shell
    cat token && echo
    ```
    ```shell
    [root@localhost ~]# cat token && echo
    eyJhbGciOiJSUzI1NiIsImtpZCI6IjJQNWF1b0JUQkZWVjF4VGt2UVhoQWIyU25HV2dTckx4dVV3NzZKd1dHV0UifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJ0ZXN0LW5hbWVzcGFjZSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJ0ZXN0LXNlY3JldCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJ0ZXN0LXNlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQudWlkIjoiMzYxNTBjNzMtN2U1ZC00NmUzLWI1MzEtYTcwZTlhMjFkOTVjIiwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50OnRlc3QtbmFtZXNwYWNlOnRlc3Qtc2VydmljZWFjY291bnQifQ.EJChGQSwHLX7MJVZUd-6gRMtJab9zvKsVmqMwUnWMMBMrh3c_ppTgAp4YcnvTCCGKSIaErA8JMcHMaKaCc2SdHfZxGftHY8UCa09YJu1YpbvmBV0zyHboyLR97Nx5m8l_UE5HXMuM6WbhjZnl6NVz-2haoSkHyZmnP5D11MzmbiNnuu4yas-m-KIKtr3G25kEwDeMwy2LVZobC1iWiSz1GlUg2cRrWbmA3WAtwgOuwl3Ft9k3D3KEIzZvh3_BkCUUBlFRTkfcukdwrQx-jRfanI2YtUDNLqwhmr00tydvPmOJ-mg3xmZtU-qcukxOtRuix9wkAddUiQLaB5o6MXR7A
    [root@localhost ~]#
    ```

2. 导出 secret 中的证书 ca.crt
    ```shell
    kubectl -n $NAMESPACE_NAME get secret $SECRET_NAME -o jsonpath='{.data.ca\.crt}' | base64 --decode > ca.crt
    ```
    ```shell
    cat ca.crt
    ```
    ```shell
    [root@localhost ~]# cat ca.crt
    -----BEGIN CERTIFICATE-----
    MIIDBTCCAe2gAwIBAgIIJGhFcF8EZFAwDQYJKoZIhvcNAQELBQAwFTETMBEGA1UE
    AxMKa3ViZXJuZXRlczAeFw0yMzExMTAxMTA3MDlaFw0zMzExMDcxMTEyMDlaMBUx
    EzARBgNVBAMTCmt1YmVybmV0ZXMwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEK
    AoIBAQDNkDnVD2mJVeZ4+vNoSo90KFyo0GANVli1hvN72AopWktYB7dVYaUzpqg5
    APNHSZmlYRNLIcbnnni7iwihlaczQO1LlOFcXTtUPqUcK8dW1PVDLN9jSQs40+NZ
    NCcStKU2bEXv19yXdl71WuzClr4gC/C1XHLpuUsI64VJMwG3/OYuXGEUPC73JBy4
    6HlhvgXQYwkhdDiCnMZP8bKIY7+NoAclwTsjP4J79p04NE/lxQnGw94wFvTn1vL1
    y7c/ptTc1lwAPypj4ui6g8CW2xIkLDaMJ9GPowAkFLg7X+2zpJW7akTU1SNYb+qo
    cVCDMg3HX3+hoNXv/m+nITnu78nnAgMBAAGjWTBXMA4GA1UdDwEB/wQEAwICpDAP
    BgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTDrOEZNXgUxQPSM2niy925B5vNbDAV
    BgNVHREEDjAMggprdWJlcm5ldGVzMA0GCSqGSIb3DQEBCwUAA4IBAQCzdP0Gypab
    f2B59rc6uo/CQGmNullcCexe+kHsikUw3i52EvFZJ5vSo7/oDNQR6yD6n9mirSfp
    HOxKCzrCw8UqID4WYZJahgvS5r9Njs3pUZLntH91fUuXsi9PSOM+dioBL9chrDDz
    Y/k3mb0RSvxClK3YrAaPS7TdrbPNqSfP1ASoImKyEGeZdBBm45zsSUtWPm/mJVXG
    EVjzzKBF7aAiygCOklTOsmH9Ml2iH8+T50RSnjTF8s7LC8wL7ah1CTzU1o2/D5cZ
    U41Gcugh020RyTB+fyTbDuAosomz9baHe2m89AgdPMFI4NRXDmMgkA9DYKT5J1uH
    dBwfvNS7lPrU
    -----END CERTIFICATE-----
    [root@localhost ~]#
    ```

3. 设置 KUBECONFIG 文件中的 集群地址
    ```shell
    kubectl config set-cluster $CLUSTER_NAME --server=$CLUSTER_SERVER --kubeconfig=config
    ```
    ```shell
    cat config
    ```
    ```shell
    apiVersion: v1
    clusters:
    - cluster:
        server: https://192.168.80.3:6443
      name: test-cluster
    contexts: null
    current-context: ""
    kind: Config
    preferences: {}
    users: null
    ```

4. 设置 KUBECONFIG 文件中的证书 ca.crt
    ```shell
    kubectl config set clusters.$CLUSTER_NAME.certificate-authority-data $(cat ca.crt | base64 -w 0) --kubeconfig=config
    ```
    ```shell
    cat config
    ```
    ```shell
    [root@localhost ~]# cat config
    apiVersion: v1
    clusters:
    - cluster:
        certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURCVENDQWUyZ0F3SUJBZ0lJSkdoRmNGOEVaRkF3RFFZSktvWklodmNOQVFFTEJRQXdGVEVUTUJFR0ExVUUKQXhNS2EzVmlaWEp1WlhSbGN6QWVGdzB5TXpFeE1UQXhNVEEzTURsYUZ3MHpNekV4TURjeE1URXlNRGxhTUJVeApFekFSQmdOVkJBTVRDbXQxWW1WeWJtVjBaWE13Z2dFaU1BMEdDU3FHU0liM0RRRUJBUVVBQTRJQkR3QXdnZ0VLCkFvSUJBUUROa0RuVkQybUpWZVo0K3ZOb1NvOTBLRnlvMEdBTlZsaTFodk43MkFvcFdrdFlCN2RWWWFVenBxZzUKQVBOSFNabWxZUk5MSWNibm5uaTdpd2lobGFjelFPMUxsT0ZjWFR0VVBxVWNLOGRXMVBWRExOOWpTUXM0MCtOWgpOQ2NTdEtVMmJFWHYxOXlYZGw3MVd1ekNscjRnQy9DMVhITHB1VXNJNjRWSk13RzMvT1l1WEdFVVBDNzNKQnk0CjZIbGh2Z1hRWXdraGREaUNuTVpQOGJLSVk3K05vQWNsd1RzalA0Sjc5cDA0TkUvbHhRbkd3OTR3RnZUbjF2TDEKeTdjL3B0VGMxbHdBUHlwajR1aTZnOENXMnhJa0xEYU1KOUdQb3dBa0ZMZzdYKzJ6cEpXN2FrVFUxU05ZYitxbwpjVkNETWczSFgzK2hvTlh2L20rbklUbnU3OG5uQWdNQkFBR2pXVEJYTUE0R0ExVWREd0VCL3dRRUF3SUNwREFQCkJnTlZIUk1CQWY4RUJUQURBUUgvTUIwR0ExVWREZ1FXQkJURHJPRVpOWGdVeFFQU00ybml5OTI1QjV2TmJEQVYKQmdOVkhSRUVEakFNZ2dwcmRXSmxjbTVsZEdWek1BMEdDU3FHU0liM0RRRUJDd1VBQTRJQkFRQ3pkUDBHeXBhYgpmMkI1OXJjNnVvL0NRR21OdWxsY0NleGUra0hzaWtVdzNpNTJFdkZaSjV2U283L29ETlFSNnlENm45bWlyU2ZwCkhPeEtDenJDdzhVcUlENFdZWkphaGd2UzVyOU5qczNwVVpMbnRIOTFmVXVYc2k5UFNPTStkaW9CTDljaHJERHoKWS9rM21iMFJTdnhDbEszWXJBYVBTN1RkcmJQTnFTZlAxQVNvSW1LeUVHZVpkQkJtNDV6c1NVdFdQbS9tSlZYRwpFVmp6ektCRjdhQWl5Z0NPa2xUT3NtSDlNbDJpSDgrVDUwUlNualRGOHM3TEM4d0w3YWgxQ1R6VTFvMi9ENWNaClU0MUdjdWdoMDIwUnlUQitmeVRiRHVBb3NvbXo5YmFIZTJtODlBZ2RQTUZJNE5SWERtTWdrQTlEWUtUNUoxdUgKZEJ3ZnZOUzdsUHJVCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K
        server: https://192.168.80.3:6443
      name: ""
    contexts: null
    current-context: ""
    kind: Config
    preferences: {}
    users: null
    [root@localhost ~]#
    ```

5. 设置 KUBECONFIG 文件中的 用户 user、凭证 token
    ```shell
    kubectl config set-credentials $USER_NAME --token=$(cat token) --kubeconfig=config
    ```
    ```shell
    cat config
    ```
    ```shell
    [root@localhost ~]# cat config 
    apiVersion: v1
    clusters:
    - cluster:
        certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURCVENDQWUyZ0F3SUJBZ0lJSkdoRmNGOEVaRkF3RFFZSktvWklodmNOQVFFTEJRQXdGVEVUTUJFR0ExVUUKQXhNS2EzVmlaWEp1WlhSbGN6QWVGdzB5TXpFeE1UQXhNVEEzTURsYUZ3MHpNekV4TURjeE1URXlNRGxhTUJVeApFekFSQmdOVkJBTVRDbXQxWW1WeWJtVjBaWE13Z2dFaU1BMEdDU3FHU0liM0RRRUJBUVVBQTRJQkR3QXdnZ0VLCkFvSUJBUUROa0RuVkQybUpWZVo0K3ZOb1NvOTBLRnlvMEdBTlZsaTFodk43MkFvcFdrdFlCN2RWWWFVenBxZzUKQVBOSFNabWxZUk5MSWNibm5uaTdpd2lobGFjelFPMUxsT0ZjWFR0VVBxVWNLOGRXMVBWRExOOWpTUXM0MCtOWgpOQ2NTdEtVMmJFWHYxOXlYZGw3MVd1ekNscjRnQy9DMVhITHB1VXNJNjRWSk13RzMvT1l1WEdFVVBDNzNKQnk0CjZIbGh2Z1hRWXdraGREaUNuTVpQOGJLSVk3K05vQWNsd1RzalA0Sjc5cDA0TkUvbHhRbkd3OTR3RnZUbjF2TDEKeTdjL3B0VGMxbHdBUHlwajR1aTZnOENXMnhJa0xEYU1KOUdQb3dBa0ZMZzdYKzJ6cEpXN2FrVFUxU05ZYitxbwpjVkNETWczSFgzK2hvTlh2L20rbklUbnU3OG5uQWdNQkFBR2pXVEJYTUE0R0ExVWREd0VCL3dRRUF3SUNwREFQCkJnTlZIUk1CQWY4RUJUQURBUUgvTUIwR0ExVWREZ1FXQkJURHJPRVpOWGdVeFFQU00ybml5OTI1QjV2TmJEQVYKQmdOVkhSRUVEakFNZ2dwcmRXSmxjbTVsZEdWek1BMEdDU3FHU0liM0RRRUJDd1VBQTRJQkFRQ3pkUDBHeXBhYgpmMkI1OXJjNnVvL0NRR21OdWxsY0NleGUra0hzaWtVdzNpNTJFdkZaSjV2U283L29ETlFSNnlENm45bWlyU2ZwCkhPeEtDenJDdzhVcUlENFdZWkphaGd2UzVyOU5qczNwVVpMbnRIOTFmVXVYc2k5UFNPTStkaW9CTDljaHJERHoKWS9rM21iMFJTdnhDbEszWXJBYVBTN1RkcmJQTnFTZlAxQVNvSW1LeUVHZVpkQkJtNDV6c1NVdFdQbS9tSlZYRwpFVmp6ektCRjdhQWl5Z0NPa2xUT3NtSDlNbDJpSDgrVDUwUlNualRGOHM3TEM4d0w3YWgxQ1R6VTFvMi9ENWNaClU0MUdjdWdoMDIwUnlUQitmeVRiRHVBb3NvbXo5YmFIZTJtODlBZ2RQTUZJNE5SWERtTWdrQTlEWUtUNUoxdUgKZEJ3ZnZOUzdsUHJVCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K
        server: https://192.168.80.3:6443
      name: ""
    contexts: null
    current-context: ""
    kind: Config
    preferences: {}
    users:
    - name: test-user
      user:
        token: eyJhbGciOiJSUzI1NiIsImtpZCI6IjJQNWF1b0JUQkZWVjF4VGt2UVhoQWIyU25HV2dTckx4dVV3NzZKd1dHV0UifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJ0ZXN0LW5hbWVzcGFjZSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJ0ZXN0LXNlY3JldCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJ0ZXN0LXNlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQudWlkIjoiMzYxNTBjNzMtN2U1ZC00NmUzLWI1MzEtYTcwZTlhMjFkOTVjIiwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50OnRlc3QtbmFtZXNwYWNlOnRlc3Qtc2VydmljZWFjY291bnQifQ.EJChGQSwHLX7MJVZUd-6gRMtJab9zvKsVmqMwUnWMMBMrh3c_ppTgAp4YcnvTCCGKSIaErA8JMcHMaKaCc2SdHfZxGftHY8UCa09YJu1YpbvmBV0zyHboyLR97Nx5m8l_UE5HXMuM6WbhjZnl6NVz-2haoSkHyZmnP5D11MzmbiNnuu4yas-m-KIKtr3G25kEwDeMwy2LVZobC1iWiSz1GlUg2cRrWbmA3WAtwgOuwl3Ft9k3D3KEIzZvh3_BkCUUBlFRTkfcukdwrQx-jRfanI2YtUDNLqwhmr00tydvPmOJ-mg3xmZtU-qcukxOtRuix9wkAddUiQLaB5o6MXR7A
    [root@localhost ~]#
    ```

6. 设置 KUBECONFIG 文件中的 上下文名称 context、集群信息 cluster、命名空间 namespace、用户 user
    ```shell
    kubectl config set-context $CONTEXT_NAME --cluster=$CLUSTER_NAME --user=$USER_NAME --namespace=$NAMESPACE_NAME --kubeconfig=config
    ```
    ```shell
    cat config
    ```
    ```shell
    [root@localhost ~]# cat config 
    apiVersion: v1
    clusters:
    - cluster:
        certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURCVENDQWUyZ0F3SUJBZ0lJSkdoRmNGOEVaRkF3RFFZSktvWklodmNOQVFFTEJRQXdGVEVUTUJFR0ExVUUKQXhNS2EzVmlaWEp1WlhSbGN6QWVGdzB5TXpFeE1UQXhNVEEzTURsYUZ3MHpNekV4TURjeE1URXlNRGxhTUJVeApFekFSQmdOVkJBTVRDbXQxWW1WeWJtVjBaWE13Z2dFaU1BMEdDU3FHU0liM0RRRUJBUVVBQTRJQkR3QXdnZ0VLCkFvSUJBUUROa0RuVkQybUpWZVo0K3ZOb1NvOTBLRnlvMEdBTlZsaTFodk43MkFvcFdrdFlCN2RWWWFVenBxZzUKQVBOSFNabWxZUk5MSWNibm5uaTdpd2lobGFjelFPMUxsT0ZjWFR0VVBxVWNLOGRXMVBWRExOOWpTUXM0MCtOWgpOQ2NTdEtVMmJFWHYxOXlYZGw3MVd1ekNscjRnQy9DMVhITHB1VXNJNjRWSk13RzMvT1l1WEdFVVBDNzNKQnk0CjZIbGh2Z1hRWXdraGREaUNuTVpQOGJLSVk3K05vQWNsd1RzalA0Sjc5cDA0TkUvbHhRbkd3OTR3RnZUbjF2TDEKeTdjL3B0VGMxbHdBUHlwajR1aTZnOENXMnhJa0xEYU1KOUdQb3dBa0ZMZzdYKzJ6cEpXN2FrVFUxU05ZYitxbwpjVkNETWczSFgzK2hvTlh2L20rbklUbnU3OG5uQWdNQkFBR2pXVEJYTUE0R0ExVWREd0VCL3dRRUF3SUNwREFQCkJnTlZIUk1CQWY4RUJUQURBUUgvTUIwR0ExVWREZ1FXQkJURHJPRVpOWGdVeFFQU00ybml5OTI1QjV2TmJEQVYKQmdOVkhSRUVEakFNZ2dwcmRXSmxjbTVsZEdWek1BMEdDU3FHU0liM0RRRUJDd1VBQTRJQkFRQ3pkUDBHeXBhYgpmMkI1OXJjNnVvL0NRR21OdWxsY0NleGUra0hzaWtVdzNpNTJFdkZaSjV2U283L29ETlFSNnlENm45bWlyU2ZwCkhPeEtDenJDdzhVcUlENFdZWkphaGd2UzVyOU5qczNwVVpMbnRIOTFmVXVYc2k5UFNPTStkaW9CTDljaHJERHoKWS9rM21iMFJTdnhDbEszWXJBYVBTN1RkcmJQTnFTZlAxQVNvSW1LeUVHZVpkQkJtNDV6c1NVdFdQbS9tSlZYRwpFVmp6ektCRjdhQWl5Z0NPa2xUT3NtSDlNbDJpSDgrVDUwUlNualRGOHM3TEM4d0w3YWgxQ1R6VTFvMi9ENWNaClU0MUdjdWdoMDIwUnlUQitmeVRiRHVBb3NvbXo5YmFIZTJtODlBZ2RQTUZJNE5SWERtTWdrQTlEWUtUNUoxdUgKZEJ3ZnZOUzdsUHJVCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K
        server: https://192.168.80.3:6443
      name: ""
    contexts:
    - context:
        cluster: test-cluster
        namespace: test-namespace
        user: test-user
      name: test-context
    current-context: ""
    kind: Config
    preferences: {}
    users:
    - name: test-user
      user:
        token: eyJhbGciOiJSUzI1NiIsImtpZCI6IjJQNWF1b0JUQkZWVjF4VGt2UVhoQWIyU25HV2dTckx4dVV3NzZKd1dHV0UifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJ0ZXN0LW5hbWVzcGFjZSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJ0ZXN0LXNlY3JldCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJ0ZXN0LXNlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQudWlkIjoiMzYxNTBjNzMtN2U1ZC00NmUzLWI1MzEtYTcwZTlhMjFkOTVjIiwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50OnRlc3QtbmFtZXNwYWNlOnRlc3Qtc2VydmljZWFjY291bnQifQ.EJChGQSwHLX7MJVZUd-6gRMtJab9zvKsVmqMwUnWMMBMrh3c_ppTgAp4YcnvTCCGKSIaErA8JMcHMaKaCc2SdHfZxGftHY8UCa09YJu1YpbvmBV0zyHboyLR97Nx5m8l_UE5HXMuM6WbhjZnl6NVz-2haoSkHyZmnP5D11MzmbiNnuu4yas-m-KIKtr3G25kEwDeMwy2LVZobC1iWiSz1GlUg2cRrWbmA3WAtwgOuwl3Ft9k3D3KEIzZvh3_BkCUUBlFRTkfcukdwrQx-jRfanI2YtUDNLqwhmr00tydvPmOJ-mg3xmZtU-qcukxOtRuix9wkAddUiQLaB5o6MXR7A
    [root@localhost ~]# 
    ```

7. 设置 KUBECONFIG 文件中的 当前上下文 current-context
    ```shell
    kubectl config use-context $CONTEXT_NAME --kubeconfig=config
    ```
    ```shell
    cat config
    ```
    ```shell
    [root@localhost ~]# cat config 
    apiVersion: v1
    clusters:
    - cluster:
        certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURCVENDQWUyZ0F3SUJBZ0lJSkdoRmNGOEVaRkF3RFFZSktvWklodmNOQVFFTEJRQXdGVEVUTUJFR0ExVUUKQXhNS2EzVmlaWEp1WlhSbGN6QWVGdzB5TXpFeE1UQXhNVEEzTURsYUZ3MHpNekV4TURjeE1URXlNRGxhTUJVeApFekFSQmdOVkJBTVRDbXQxWW1WeWJtVjBaWE13Z2dFaU1BMEdDU3FHU0liM0RRRUJBUVVBQTRJQkR3QXdnZ0VLCkFvSUJBUUROa0RuVkQybUpWZVo0K3ZOb1NvOTBLRnlvMEdBTlZsaTFodk43MkFvcFdrdFlCN2RWWWFVenBxZzUKQVBOSFNabWxZUk5MSWNibm5uaTdpd2lobGFjelFPMUxsT0ZjWFR0VVBxVWNLOGRXMVBWRExOOWpTUXM0MCtOWgpOQ2NTdEtVMmJFWHYxOXlYZGw3MVd1ekNscjRnQy9DMVhITHB1VXNJNjRWSk13RzMvT1l1WEdFVVBDNzNKQnk0CjZIbGh2Z1hRWXdraGREaUNuTVpQOGJLSVk3K05vQWNsd1RzalA0Sjc5cDA0TkUvbHhRbkd3OTR3RnZUbjF2TDEKeTdjL3B0VGMxbHdBUHlwajR1aTZnOENXMnhJa0xEYU1KOUdQb3dBa0ZMZzdYKzJ6cEpXN2FrVFUxU05ZYitxbwpjVkNETWczSFgzK2hvTlh2L20rbklUbnU3OG5uQWdNQkFBR2pXVEJYTUE0R0ExVWREd0VCL3dRRUF3SUNwREFQCkJnTlZIUk1CQWY4RUJUQURBUUgvTUIwR0ExVWREZ1FXQkJURHJPRVpOWGdVeFFQU00ybml5OTI1QjV2TmJEQVYKQmdOVkhSRUVEakFNZ2dwcmRXSmxjbTVsZEdWek1BMEdDU3FHU0liM0RRRUJDd1VBQTRJQkFRQ3pkUDBHeXBhYgpmMkI1OXJjNnVvL0NRR21OdWxsY0NleGUra0hzaWtVdzNpNTJFdkZaSjV2U283L29ETlFSNnlENm45bWlyU2ZwCkhPeEtDenJDdzhVcUlENFdZWkphaGd2UzVyOU5qczNwVVpMbnRIOTFmVXVYc2k5UFNPTStkaW9CTDljaHJERHoKWS9rM21iMFJTdnhDbEszWXJBYVBTN1RkcmJQTnFTZlAxQVNvSW1LeUVHZVpkQkJtNDV6c1NVdFdQbS9tSlZYRwpFVmp6ektCRjdhQWl5Z0NPa2xUT3NtSDlNbDJpSDgrVDUwUlNualRGOHM3TEM4d0w3YWgxQ1R6VTFvMi9ENWNaClU0MUdjdWdoMDIwUnlUQitmeVRiRHVBb3NvbXo5YmFIZTJtODlBZ2RQTUZJNE5SWERtTWdrQTlEWUtUNUoxdUgKZEJ3ZnZOUzdsUHJVCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K
        server: https://192.168.80.3:6443
      name: ""
    contexts:
    - context:
        cluster: test-cluster
        namespace: test-namespace
        user: test-user
      name: test-context
    current-context: test-context
    kind: Config
    preferences: {}
    users:
    - name: test-user
      user:
        token: eyJhbGciOiJSUzI1NiIsImtpZCI6IjJQNWF1b0JUQkZWVjF4VGt2UVhoQWIyU25HV2dTckx4dVV3NzZKd1dHV0UifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJ0ZXN0LW5hbWVzcGFjZSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJ0ZXN0LXNlY3JldCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJ0ZXN0LXNlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQudWlkIjoiMzYxNTBjNzMtN2U1ZC00NmUzLWI1MzEtYTcwZTlhMjFkOTVjIiwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50OnRlc3QtbmFtZXNwYWNlOnRlc3Qtc2VydmljZWFjY291bnQifQ.EJChGQSwHLX7MJVZUd-6gRMtJab9zvKsVmqMwUnWMMBMrh3c_ppTgAp4YcnvTCCGKSIaErA8JMcHMaKaCc2SdHfZxGftHY8UCa09YJu1YpbvmBV0zyHboyLR97Nx5m8l_UE5HXMuM6WbhjZnl6NVz-2haoSkHyZmnP5D11MzmbiNnuu4yas-m-KIKtr3G25kEwDeMwy2LVZobC1iWiSz1GlUg2cRrWbmA3WAtwgOuwl3Ft9k3D3KEIzZvh3_BkCUUBlFRTkfcukdwrQx-jRfanI2YtUDNLqwhmr00tydvPmOJ-mg3xmZtU-qcukxOtRuix9wkAddUiQLaB5o6MXR7A
    [root@localhost ~]#
    ```

### 测试新创建的 KUBECONFIG 文件

```shell
kubectl --kubeconfig=config get pod
```

```shell
[root@localhost ~]# kubectl --kubeconfig=config get pod
No resources found in test-namespace namespace.
[root@localhost ~]# 
```
