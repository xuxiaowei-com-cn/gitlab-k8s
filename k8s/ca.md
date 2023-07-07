# 生成 Kubernetes（k8s） 证书

```shell
# 颁发者
CN=kubernetes
# 使用者可选名称 DNS Name
CA_DNS=kubernetes


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
# 生成根证书（CA）和密钥对：
openssl genrsa -out ca.key 2048
openssl req -new -key ca.key -out ca.csr -subj "/CN=$CN"
openssl x509 -req -days 36500 -in ca.csr -signkey ca.key -out ca.crt -extensions v3_req -extfile ca-openssl.cnf


```
