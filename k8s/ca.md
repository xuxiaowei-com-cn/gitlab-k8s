# 生成 Kubernetes（k8s） 证书

```shell
# 颁发者
CN=kubernetes
# 使用者可选名称 DNS Name
CA_DNS=kubernetes

# 使用者、颁发给（使用 ca.key 颁发 apiserver.crt）
APISERVER_CN=kube-apiserver

# 集群名称，主机名
CLUSTER_NAME=k8s
# 集群内部IP
CLUSTER_IP=10.96.0.1
# 集群服务器IP，apiserver 使用的 IP
CLUSTER_SERVER_IP=192.168.80.201

```

```shell
cat > ca-openssl.cnf << EOF
[req]
req_extensions = v3_req
distinguished_name = req_distinguished_name

[v3_req]
subjectAltName = @alt_names

[alt_names]
DNS.1 = $CA_DNS

EOF

cat ca-openssl.cnf
```

```shell
cat > apiserver-openssl.cnf << EOF
[req]
req_extensions = v3_req
distinguished_name = req_distinguished_name

[v3_req]
subjectAltName = @alt_names

[alt_names]
DNS.1 = $CLUSTER_NAME
DNS.2 = $CA_DNS
DNS.3 = kubernetes.default
DNS.4 = kubernetes.default.svc
DNS.5 = kubernetes.default.svc.cluster.local
IP.1 = $CLUSTER_IP
IP.2 = $CLUSTER_SERVER_IP

EOF

cat apiserver-openssl.cnf
```

```shell
# 生成根证书（CA）和密钥对：
openssl genrsa -out ca.key 2048
openssl req -new -key ca.key -out ca.csr -subj "/CN=$CN"
openssl x509 -req -days 36500 -in ca.csr -signkey ca.key -out ca.crt -extensions v3_req -extfile ca-openssl.cnf


# 生成 API Server 相关的证书和密钥对：
openssl genrsa -out apiserver.key 2048
openssl req -new -key apiserver.key -out apiserver.csr -subj "/CN=$APISERVER_CN"
openssl x509 -req -days 36500 -CA ca.crt -CAkey ca.key -CAcreateserial -in apiserver.csr -out apiserver.crt -extensions v3_req -extfile apiserver-openssl.cnf


```
