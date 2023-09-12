---
sidebar_position: 1
---

# 使用 helm 安装 gitlab

## 前提条件

- k8s 完成 helm 的配置
- k8s 完成 ingress 的配置

## 说明

- gitlab-ce（社区版）、gitlab-ee（企业版）、gitlab-jh（极狐版）的区别：[GitLab 导读](/docs/guide/gitlab.md)
- 本文以 helm gitlab 7.3.2 为例（即：gitlab v16.3.2）
- 演示环境使用 k8s 单机器群测试，数据使用 local PV 储存
- 使用 helm 安装/配置 gitlab 的域名信息如下，如果特别说明，则使用下表中的值

| 域名                              | 作用              | 说明                  |
|---------------------------------|-----------------|---------------------|
| test.helm.xuxiaowei.cn          | 将用于所有对外暴露服务的域名  | 默认情况下，其他域名在此域名前拼接得到 |
| gitlab.test.helm.xuxiaowei.cn   | 外部访问gitlab实例的域名 |                     |
| minio.test.helm.xuxiaowei.cn    | 对象储存域名          |                     |
| registry.test.helm.xuxiaowei.cn | 容器镜像仓库域名        |                     |

## 文档

- [TLS 配置](https://docs.gitlab.cn/charts/installation/command-line-options.html#tls-%E9%85%8D%E7%BD%AE)
    - certmanager-issuer.email
- [基本配置](https://docs.gitlab.cn/charts/installation/command-line-options.html#%E5%9F%BA%E6%9C%AC%E9%85%8D%E7%BD%AE)
    - global.hosts.domain
    - global.edition
- [Deploy the Community Edition](https://docs.gitlab.com/charts/installation/deployment.html#deploy-the-community-edition)
    - global.edition

## 添加 helm gitlab 仓库

|                  | ArtifactHub 网址                                        | 仓库地址                     | 版本        |
|------------------|-------------------------------------------------------|--------------------------|-----------|
| gitlab/gitlab    | https://artifacthub.io/packages/helm/gitlab/gitlab    | http://charts.gitlab.io  | 社区版、企业版   |
| gitlab-jh/gitlab | https://artifacthub.io/packages/helm/gitlab-jh/gitlab | https://charts.gitlab.cn | 企业版（中国特供） |

### 国外用户推荐使用 gitlab/gitlab 仓库

```shell
helm repo add gitlab https://charts.gitlab.io
```

### 国内用户推荐使用 gitlab-jh/gitlab 仓库

```shell
helm repo add gitlab-jh https://charts.gitlab.cn
```

## 更新仓库

```shell
helm repo update
```

## 查看仓库中可用的版本

```shell
helm search repo gitlab
helm search repo gitlab --versions
```

- gitlab、gitlab-jh 仓库中可用的部分版本如下

| CHART VERSION | APP VERSION |
|---------------|-------------|
| 7.3.2         | v16.3.2     |
| 7.2.5         | v16.2.5     |
| 7.1.5         | v16.1.5     |
| 7.0.8         | v16.0.8     |

## helm 安装 gitlab

```shell
# 创建命令空间，可选，强烈建议使用独立命名空间安装 helm gitlab
kubectl create namespace gitlab-test
```

```shell
# 其中 my-gitlab 是安装到本地的 helm gitlab 的名称
# 其中 gitlab/gitlab 是需要安装的软件名称，gitlab-jh 使用 gitlab-jh/gitlab
# 其中 gitlab/gitlab 默认为企业版，如果要使用社区版，请增加参数 --set global.edition=ce
# 其中 7.3.2 是 gitlab 版本，可自行选择
# 其中 certmanager-issuer.email 是 Let’s Encrypt 账号的电子邮件地址，填写一个自己的邮件地址即可，用于证书到期前提醒
# 其中 --timeout 600s 表示超时时间为 600s

# Helm v3
helm -n gitlab-test install my-gitlab gitlab/gitlab --version 7.3.2 \
  --set certmanager-issuer.email=your@email.com \
  --set global.hosts.domain=test.helm.xuxiaowei.cn \
  --timeout 600s

# Helm v2
#helm -n gitlab-test install --name my-gitlab gitlab/gitlab --version 7.3.2 \
#  --set certmanager-issuer.email=your@email.com \
#  --set global.hosts.domain=test.helm.xuxiaowei.cn \
#  --timeout 600s
```

## 导出 helm gitlab 配置

```Shell
# 将已配置的值导出到文件中
helm -n gitlab-test get values my-gitlab > my-gitlab.yaml
```

```Shell
[root@k8s ~]# cat my-gitlab.yaml
USER-SUPPLIED VALUES:
certmanager-issuer:
  email: your@email.com
global:
  hosts:
    domain: test.helm.xuxiaowei.cn
[root@k8s ~]# 
```

## 创建 PV、绑定 PVC

#### 查看 PVC

```shell
[root@k8s ~]# kubectl -n gitlab-test get pvc
NAME                                  STATUS    VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS   AGE
data-my-gitlab-postgresql-0           Pending                                                     2m49s
my-gitlab-minio                       Pending                                                     2m50s
my-gitlab-prometheus-server           Pending                                                     2m50s
redis-data-my-gitlab-redis-master-0   Pending                                                     2m49s
repo-data-my-gitlab-gitaly-0          Pending                                                     2m49s
[root@k8s ~]#
```

#### 创建 PVC

- 演示环境使用 k8s 单机器群测试，数据使用 local PV 储存
- 由于使用 local PV，local PV 需要指定节点调度，所以需要给节点打标签
- 下面操作是给节点 k8s 增加一个标签，标签名是 `gitlab-test`，标签值是 `local-pv`
   - 演示环境使用 k8s 单机器群测试，只有一个接节点，名称就是 k8s
   - 此处的 标签名、标签值 与 下面 PV 配置文件中的 标签名、标签值 对应

```shell
# 演示环境
[root@k8s ~]# kubectl get node --show-labels
NAME   STATUS   ROLES           AGE   VERSION   LABELS
k8s    Ready    control-plane   93m   v1.28.1   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=k8s,kubernetes.io/os=linux,node-role.kubernetes.io/control-plane=,node.kubernetes.io/exclude-from-external-load-balancers=
[root@k8s ~]# kubectl label nodes k8s gitlab-test=local-pv
node/k8s labeled
[root@k8s ~]# kubectl get node --show-labels
NAME   STATUS   ROLES           AGE   VERSION   LABELS
k8s    Ready    control-plane   93m   v1.28.1   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,gitlab-test=local-pv,kubernetes.io/arch=amd64,kubernetes.io/hostname=k8s,kubernetes.io/os=linux,node-role.kubernetes.io/control-plane=,node.kubernetes.io/exclude-from-external-load-balancers=
[root@k8s ~]# 
```

- 创建 PV 文件夹

```shell
# PV 数据储存在 /gitlab-test 文件夹
mkdir -p /gitlab-test/data-my-gitlab-postgresql-0-pv
mkdir -p /gitlab-test/my-gitlab-minio-pv
mkdir -p /gitlab-test/my-gitlab-prometheus-server-pv
mkdir -p /gitlab-test/redis-data-my-gitlab-redis-master-0-pv
mkdir -p /gitlab-test/repo-data-my-gitlab-gitaly-0-pv
```

如果需要情况数据请执行

```shell
rm /gitlab-test/data-my-gitlab-postgresql-0-pv/* -rf
rm /gitlab-test/my-gitlab-minio-pv/* -rf
rm /gitlab-test/my-gitlab-prometheus-server-pv/* -rf
rm /gitlab-test/redis-data-my-gitlab-redis-master-0-pv/* -rf
rm /gitlab-test/repo-data-my-gitlab-gitaly-0-pv/* -rf
```

- 创建 PV、绑定 PVC

```shell
# 编辑文件
vim gitlab-test-pv.yaml
```

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: data-my-gitlab-postgresql-0-pv
spec:
  accessModes:
    - ReadWriteOnce
  capacity:
    storage: 8Gi
  claimRef:
    apiVersion: v1
    kind: PersistentVolumeClaim
    name: data-my-gitlab-postgresql-0
    namespace: gitlab-test
  local:
    path: /gitlab-test/data-my-gitlab-postgresql-0-pv
  nodeAffinity:
    required:
      nodeSelectorTerms:
        - matchExpressions:
            - key: gitlab-test
              operator: In
              values:
                - local-pv
  persistentVolumeReclaimPolicy: Retain
  volumeMode: Filesystem

---

apiVersion: v1
kind: PersistentVolume
metadata:
  name: my-gitlab-minio-pv
spec:
  accessModes:
    - ReadWriteOnce
  capacity:
    storage: 10Gi
  claimRef:
    apiVersion: v1
    kind: PersistentVolumeClaim
    name: my-gitlab-minio
    namespace: gitlab-test
  local:
    path: /gitlab-test/my-gitlab-minio-pv
  nodeAffinity:
    required:
      nodeSelectorTerms:
        - matchExpressions:
            - key: gitlab-test
              operator: In
              values:
                - local-pv
  persistentVolumeReclaimPolicy: Retain
  volumeMode: Filesystem

---

apiVersion: v1
kind: PersistentVolume
metadata:
  name: my-gitlab-prometheus-server-pv
spec:
  accessModes:
    - ReadWriteOnce
  capacity:
    storage: 8Gi
  claimRef:
    apiVersion: v1
    kind: PersistentVolumeClaim
    name: my-gitlab-prometheus-server
    namespace: gitlab-test
  local:
    path: /gitlab-test/my-gitlab-prometheus-server-pv
  nodeAffinity:
    required:
      nodeSelectorTerms:
        - matchExpressions:
            - key: gitlab-test
              operator: In
              values:
                - local-pv
  persistentVolumeReclaimPolicy: Retain
  volumeMode: Filesystem

---

apiVersion: v1
kind: PersistentVolume
metadata:
  name: redis-data-my-gitlab-redis-master-0-pv
spec:
  accessModes:
    - ReadWriteOnce
  capacity:
    storage: 8Gi
  claimRef:
    apiVersion: v1
    kind: PersistentVolumeClaim
    name: redis-data-my-gitlab-redis-master-0
    namespace: gitlab-test
  local:
    path: /gitlab-test/redis-data-my-gitlab-redis-master-0-pv
  nodeAffinity:
    required:
      nodeSelectorTerms:
        - matchExpressions:
            - key: gitlab-test
              operator: In
              values:
                - local-pv
  persistentVolumeReclaimPolicy: Retain
  volumeMode: Filesystem

---

apiVersion: v1
kind: PersistentVolume
metadata:
  name: repo-data-my-gitlab-gitaly-0-pv
spec:
  accessModes:
    - ReadWriteOnce
  capacity:
    storage: 50Gi
  claimRef:
    apiVersion: v1
    kind: PersistentVolumeClaim
    name: repo-data-my-gitlab-gitaly-0
    namespace: gitlab-test
  local:
    path: /gitlab-test/repo-data-my-gitlab-gitaly-0-pv
  nodeAffinity:
    required:
      nodeSelectorTerms:
        - matchExpressions:
            - key: gitlab-test
              operator: In
              values:
                - local-pv
  persistentVolumeReclaimPolicy: Retain
  volumeMode: Filesystem
```

```shell
# 应用
kubectl apply -f gitlab-test-pv.yaml
```

```shell
# 查看结果
[root@k8s ~]# kubectl get pv
NAME                                     CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                                             STORAGECLASS   REASON   AGE
data-my-gitlab-postgresql-0-pv           8Gi        RWO            Retain           Bound    gitlab-test/data-my-gitlab-postgresql-0                                   20s
my-gitlab-minio-pv                       10Gi       RWO            Retain           Bound    gitlab-test/my-gitlab-minio                                               20s
my-gitlab-prometheus-server-pv           8Gi        RWO            Retain           Bound    gitlab-test/my-gitlab-prometheus-server                                   20s
redis-data-my-gitlab-redis-master-0-pv   8Gi        RWO            Retain           Bound    gitlab-test/redis-data-my-gitlab-redis-master-0                           20s
repo-data-my-gitlab-gitaly-0-pv          50Gi       RWO            Retain           Bound    gitlab-test/repo-data-my-gitlab-gitaly-0                                  20s
[root@k8s ~]# kubectl -n gitlab-test get pvc
NAME                                  STATUS   VOLUME                                   CAPACITY   ACCESS MODES   STORAGECLASS   AGE
data-my-gitlab-postgresql-0           Bound    data-my-gitlab-postgresql-0-pv           8Gi        RWO                           24m
my-gitlab-minio                       Bound    my-gitlab-minio-pv                       10Gi       RWO                           24m
my-gitlab-prometheus-server           Bound    my-gitlab-prometheus-server-pv           8Gi        RWO                           24m
redis-data-my-gitlab-redis-master-0   Bound    redis-data-my-gitlab-redis-master-0-pv   8Gi        RWO                           24m
repo-data-my-gitlab-gitaly-0          Bound    repo-data-my-gitlab-gitaly-0-pv          50Gi       RWO                           24m
[root@k8s ~]# 
```

## 查看 helm gitlab pod 状态

```shell
[root@k8s ~]# kubectl -n gitlab-test get pod
NAME                                                 READY   STATUS             RESTARTS        AGE
cm-acme-http-solver-kds9n                            1/1     Running            0               7m47s
cm-acme-http-solver-l968v                            1/1     Running            0               7m47s
cm-acme-http-solver-m8rgb                            1/1     Running            0               7m47s
cm-acme-http-solver-wqdx2                            1/1     Running            0               7m47s
my-gitlab-certmanager-757b99868c-dc8bk               1/1     Running            0               8m9s
my-gitlab-certmanager-cainjector-598b8d5d8b-lnsmc    1/1     Running            0               8m9s
my-gitlab-certmanager-webhook-7bb5fc7d5b-pw56n       1/1     Running            0               8m9s
my-gitlab-gitaly-0                                   0/1     Pending            0               8m9s
my-gitlab-gitlab-exporter-79d7d5df5c-9bwl5           1/1     Running            0               8m9s
my-gitlab-gitlab-runner-6458d8fb56-pddfr             0/1     Error              2 (2m58s ago)   8m8s
my-gitlab-gitlab-shell-5bcb8cdc46-cnqmk              1/1     Running            0               7m54s
my-gitlab-gitlab-shell-5bcb8cdc46-tszf6              1/1     Running            0               8m8s
my-gitlab-issuer-1-fktz7                             0/1     Completed          0               8m9s
my-gitlab-kas-78d78f74dc-8fgl8                       0/1     CrashLoopBackOff   6 (113s ago)    8m9s
my-gitlab-kas-78d78f74dc-f4zph                       0/1     CrashLoopBackOff   6 (119s ago)    7m54s
my-gitlab-migrations-1-f5657                         1/1     Running            2 (64s ago)     8m9s
my-gitlab-minio-7989684dd8-89kbz                     0/1     Pending            0               8m9s
my-gitlab-minio-create-buckets-1-dbnhg               1/1     Running            0               8m9s
my-gitlab-nginx-ingress-controller-6bdd56c45-28rxc   1/1     Running            0               8m8s
my-gitlab-nginx-ingress-controller-6bdd56c45-bwk66   1/1     Running            0               8m8s
my-gitlab-postgresql-0                               0/2     Pending            0               8m9s
my-gitlab-prometheus-server-646489c599-gwstk         0/2     Pending            0               8m8s
my-gitlab-redis-master-0                             0/2     Pending            0               8m9s
my-gitlab-registry-67c947ccb9-dfqhr                  1/1     Running            0               8m9s
my-gitlab-registry-67c947ccb9-f8llk                  1/1     Running            0               7m54s
my-gitlab-sidekiq-all-in-1-v2-775f4bbccc-wrzqx       0/1     Init:2/3           2 (67s ago)     8m9s
my-gitlab-toolbox-5f686bb594-cg87l                   1/1     Running            0               8m9s
my-gitlab-webservice-default-564cc76bff-ch668        0/2     Init:2/3           2 (61s ago)     8m8s
my-gitlab-webservice-default-564cc76bff-jhlgz        0/2     Init:2/3           2 (77s ago)     7m54s
[root@k8s ~]# 
```

## 删除没有正常运行的pod，主动触发进行下一步故障恢复，节省时间

```shell
# 删除示例如下：
[root@k8s ~]# kubectl -n gitlab-test delete pod --field-selector 'status.phase!=Running'
pod "my-gitlab-gitaly-0" deleted
pod "my-gitlab-issuer-1-z6w7x" deleted
pod "my-gitlab-minio-7989684dd8-8d8cb" deleted
pod "my-gitlab-prometheus-server-646489c599-hgkwk" deleted
pod "my-gitlab-redis-master-0" deleted
pod "my-gitlab-sidekiq-all-in-1-v2-557754944b-fj786" deleted
pod "my-gitlab-webservice-default-7b574d9fc-vr7s9" deleted
pod "my-gitlab-webservice-default-7b574d9fc-wvl59" deleted
[root@k8s ~]# 
```

```shell
# 或者删除所有 pod
# 删除示例如下：
[root@k8s ~]# kubectl -n gitlab-test delete pod --all
pod "my-gitlab-certmanager-757b99868c-2gtd6" deleted
pod "my-gitlab-certmanager-cainjector-598b8d5d8b-6nmkp" deleted
pod "my-gitlab-certmanager-webhook-7bb5fc7d5b-dgjjp" deleted
pod "my-gitlab-gitaly-0" deleted
pod "my-gitlab-gitlab-exporter-79d7d5df5c-rltr7" deleted
pod "my-gitlab-gitlab-runner-698c5649bf-jwskd" deleted
pod "my-gitlab-gitlab-shell-5bcb8cdc46-gnssx" deleted
pod "my-gitlab-gitlab-shell-5bcb8cdc46-zzmfd" deleted
pod "my-gitlab-issuer-1-kj5d6" deleted
pod "my-gitlab-kas-c96d777f8-9h4ph" deleted
pod "my-gitlab-kas-c96d777f8-jz2bz" deleted
pod "my-gitlab-migrations-1-pt7vh" deleted
pod "my-gitlab-minio-7989684dd8-fppbg" deleted
pod "my-gitlab-minio-create-buckets-1-qgchw" deleted
pod "my-gitlab-nginx-ingress-controller-6bdd56c45-jlx4j" deleted
pod "my-gitlab-nginx-ingress-controller-6bdd56c45-lmxdb" deleted
pod "my-gitlab-postgresql-0" deleted
pod "my-gitlab-prometheus-server-646489c599-2kbmp" deleted
pod "my-gitlab-redis-master-0" deleted
pod "my-gitlab-registry-c65988947-jd8zq" deleted
pod "my-gitlab-registry-c65988947-ltlvm" deleted
pod "my-gitlab-sidekiq-all-in-1-v2-557754944b-rpsq8" deleted
pod "my-gitlab-toolbox-85c66fcfc9-kc6wp" deleted
pod "my-gitlab-webservice-default-7b574d9fc-997vx" deleted
pod "my-gitlab-webservice-default-7b574d9fc-pb7ts" deleted
[root@k8s ~]# 
```

## 等待所有 pod 都处于 Running 状态

- pod 名称包含 `gitlab-runner` 的除外
    - `gitlab-runner` pod 使用域名和 https 协议注册到 GitLab，由于 DNS 和证书均为配置，所以 gitlab-runner
      无法正常工作，这是正常现象，如果你不使用 GitLab Runner CI/CD 流水线，可不用理会

```shell
[root@k8s ~]# kubectl -n gitlab-test get pod
NAME                                                 READY   STATUS      RESTARTS        AGE
cm-acme-http-solver-kds9n                            1/1     Running     0               19m
cm-acme-http-solver-l968v                            1/1     Running     0               19m
cm-acme-http-solver-m8rgb                            1/1     Running     0               19m
cm-acme-http-solver-wqdx2                            1/1     Running     0               19m
my-gitlab-certmanager-757b99868c-dc8bk               1/1     Running     1 (86s ago)     19m
my-gitlab-certmanager-cainjector-598b8d5d8b-lnsmc    1/1     Running     1 (86s ago)     19m
my-gitlab-certmanager-webhook-7bb5fc7d5b-pw56n       1/1     Running     0               19m
my-gitlab-gitaly-0                                   1/1     Running     0               9m55s
my-gitlab-gitlab-exporter-79d7d5df5c-9bwl5           1/1     Running     0               19m
my-gitlab-gitlab-runner-6458d8fb56-pddfr             0/1     Error       5               19m
my-gitlab-gitlab-shell-5bcb8cdc46-cnqmk              1/1     Running     0               19m
my-gitlab-gitlab-shell-5bcb8cdc46-tszf6              1/1     Running     0               19m
my-gitlab-kas-78d78f74dc-f4zph                       1/1     Running     8 (8m26s ago)   19m
my-gitlab-kas-78d78f74dc-g4rct                       1/1     Running     0               4m1s
my-gitlab-migrations-1-f5657                         0/1     Completed   3               19m
my-gitlab-minio-7989684dd8-74xjt                     1/1     Running     0               9m55s
my-gitlab-nginx-ingress-controller-6bdd56c45-28rxc   1/1     Running     0               19m
my-gitlab-nginx-ingress-controller-6bdd56c45-bwk66   1/1     Running     0               19m
my-gitlab-postgresql-0                               2/2     Running     0               9m55s
my-gitlab-prometheus-server-646489c599-q2hsk         2/2     Running     0               9m55s
my-gitlab-redis-master-0                             2/2     Running     0               9m55s
my-gitlab-registry-67c947ccb9-dfqhr                  1/1     Running     0               19m
my-gitlab-registry-67c947ccb9-f8llk                  1/1     Running     0               19m
my-gitlab-sidekiq-all-in-1-v2-775f4bbccc-qtr25       1/1     Running     1 (114s ago)    5m2s
my-gitlab-toolbox-5f686bb594-cg87l                   1/1     Running     0               19m
my-gitlab-webservice-default-564cc76bff-qjlpt        2/2     Running     1 (89s ago)     5m2s
my-gitlab-webservice-default-564cc76bff-zkrbq        2/2     Running     1 (91s ago)     5m2s
[root@k8s ~]# 
```

## 修改 DNS，访问 gitlab

- 演示环境：Windows 修改 `C:\Windows\System32\drivers\etc\hosts`

```Shell
192.168.80.3    gitlab.test.helm.xuxiaowei.cn
192.168.80.3    minio.test.helm.xuxiaowei.cn

# 不使用 GitLab 提供的 镜像库 可忽略 registry 域名
192.168.80.3    registry.test.helm.xuxiaowei.cn

# Pages 页面 域名
# 不使用 Pages 功能可忽略 Pages 域名
192.168.80.3    pages.test.helm.xuxiaowei.cn

# 此处演示仅增加两个 pages 子域名，如果要使用 Pages 功能，请使用通配符将 *.pages.test.helm.xuxiaowei.cn 解析到服务器IP

# 用户 Pages 页面 域名，其中用户名为 root
192.168.80.3    root.pages.test.helm.xuxiaowei.cn
# 用户 Pages 页面 域名，其中用户名为 xuxiaowei
192.168.80.3    xuxiaowei.pages.test.helm.xuxiaowei.cn
```

## 修改已安装的 helm gitlab 配置

```Shell
# 将已配置的值导出到文件中

helm -n gitlab-test get values my-gitlab > my-gitlab.yaml

# 更新配置
helm upgrade -n gitlab-test --install my-gitlab gitlab/gitlab \
  --set 你需要设置的配置 \
  --version 7.3.2 \
  -f my-gitlab.yaml \
  --timeout 600s
```

## 登陆 GitLab

### 访问 [https://gitlab.test.helm.xuxiaowei.cn](https://gitlab.test.helm.xuxiaowei.cn) ，浏览器提示：

![](static/gitlab-1.png)

### 点击 `继续前往gitlab.test.helm.xuxiaowei.cn（不安全）` ，可选择 `中文`

![](static/gitlab-2.png)

### 获取管理员 `root` 用户的初始化密码

```Shell
kubectl -n gitlab-test get secrets my-gitlab-gitlab-initial-root-password -ojsonpath='{.data.password}' | base64 --decode ; echo
```

### 登陆之后的结果

![](static/gitlab-3.png)

### 关闭新导航栏（可选）

![](static/gitlab-4.png)

### 进入偏好设置，修改为中文菜单（可选）

1. 偏好设置网址：https://gitlab.test.helm.xuxiaowei.cn/-/profile/preferences

2. 新版导航栏
   ![](static/gitlab-5.png)
   ![](static/gitlab-8.png)

3. 旧版导航栏
   ![](static/gitlab-6.png)
   ![](static/gitlab-7.png)

## 本地化配置（可选）

设置未登录用户的默认语言为中文

1. 进入管理员页面

   ![](static/gitlab-9.png)

2. 进入偏好设置

   ![](static/gitlab-10.png)

3. 设置未登录用户的默认语言为中文

   ![](static/gitlab-11.png)

## 禁用注册功能（可选）

![](static/gitlab-12.png)
![](static/gitlab-13.png)
![](static/gitlab-14.png)
