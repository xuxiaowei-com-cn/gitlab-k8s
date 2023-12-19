---
sidebar_position: 13
---

# 创建指定命名空间的 KUBECONFIG 文件

## 文档

1. [命名空间](https://kubernetes.io/zh-cn/docs/concepts/overview/working-with-objects/namespaces/)
2. [服务账号](https://kubernetes.io/zh-cn/docs/concepts/security/service-accounts/)
3. [使用 RBAC 鉴权](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)
4. [RoleBinding](https://kubernetes.io/zh-cn/docs/reference/kubernetes-api/authorization-resources/role-binding-v1/)
5. [Secret](https://kubernetes.io/docs/concepts/configuration/secret/)

## 配置

1. 环境变量（根据自己的情况与需求设置）
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
    
    export CLUSTER_NAME=test-cluster
    export CLUSTER_SERVER=https://192.168.80.3:6443
    export USER_NAME=test-user
    export CONTEXT_NAME=test-context
    ```

2. 创建 Namespaces
    ```shell
    kubectl create namespace $NAMESPACE_NAME
    ```

3. 创建一个 ServiceAccount
    ```shell
    kubectl -n $NAMESPACE_NAME create serviceaccount $SERVICE_ACCOUNT_NAME
    ```

4. 创建 Role（根据自己的情况与需求设置）
    ```shell
    cat > role.yaml << EOF
    apiVersion: rbac.authorization.k8s.io/v1
    kind: Role
    metadata:
      namespace: $NAMESPACE_NAME
      name: $ROLE_NAME
    rules:
    - apiGroups: [""] # "" 标明 core API 组
      resources: ["pods"] # 根据自己的情况与需求设置
      verbs: ["get", "watch", "list"] # 根据自己的情况与需求设置
    
    EOF
    ```
    ```shell
    cat role.yaml
    ```
    ```shell
    kubectl apply -f role.yaml
    ```

5. 创建 RoleBinding
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

6. 获取 ServiceAccount 的 Secret
    ```shell
    # 查看 ServiceAccount 的 Secret 数量
    kubectl -n $NAMESPACE_NAME get serviceaccount $SERVICE_ACCOUNT_NAME
    ```
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

7. 创建 KUBECONFIG 文件
    ```shell
    kubectl -n $NAMESPACE_NAME get secret $SECRET_NAME -o jsonpath='{.data.token}' | base64 --decode > token
    kubectl -n $NAMESPACE_NAME get secret $SECRET_NAME -o jsonpath='{.data.ca\.crt}' | base64 --decode > ca.crt
    kubectl config set-cluster $CLUSTER_NAME --server=$CLUSTER_SERVER --certificate-authority=ca.crt --kubeconfig=config
    kubectl config set-credentials $USER_NAME --token=$(cat token) --kubeconfig=config
    kubectl config set-context $CONTEXT_NAME --cluster=$CLUSTER_NAME --user=$USER_NAME --namespace=$NAMESPACE_NAME --kubeconfig=config
    kubectl config use-context $CONTEXT_NAME --kubeconfig=config
    ```

8. 测试新创建的 KUBECONFIG 文件
    ```shell
    kubectl --kubeconfig=config get pod
    ```
