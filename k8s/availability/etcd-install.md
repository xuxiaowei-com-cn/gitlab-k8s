# kubernetes（k8s）高可用集群2：etcd 高可用集群（非必须）

## 说明

1. **官方文章
   [利用 kubeadm 创建高可用集群](https://kubernetes.io/zh-cn/docs/setup/production-environment/tools/kubeadm/high-availability/)
   中指出，可以使用“外部etcd 拓扑”（根据本文操作，即：自建 etcd 高可用集群），或者使用“堆叠（Stacked） etcd
   拓扑”，所以本文是非必须的，根据需要选择。**
2. [etcd GitHub 仓库](https://github.com/etcd-io/etcd)
3. etcd 至少部署3个节点
4. etcd 启用基于CA认证的HTTPS安全机制

## 安装

1. 创建CA根证书（第一台机器：192.168.80.81）
   使用root用户在/root目录下执行

   ```shell
   openssl genrsa -out ca.key 2048
   openssl req -x509 -new -nodes -key ca.key -subj "/CN=$MASTER_1_IP" -days 36500 -out ca.crt
   
   mkdir -p /etc/kubernetes/pki/etcd
   cp ca.key /etc/kubernetes/pki/etcd
   cp ca.crt /etc/kubernetes/pki/etcd
   
   ll /etc/kubernetes/pki/etcd
   
   # --subj："/CN"的值为 Master（Control Plane）主机名或IP地址
   # -days：证书有效天数
   
   # 将生成的 ca.key、ca.crt 文件保存在 /etc/kubernetes/pki/etcd 目录下
   ```

2. 下载、解压、复制到指定路径（第一台机器：192.168.80.81）

   ```shell
   ETCD_VERSION=3.4.24
   
   yum -y install wget
   
   wget https://github.com/etcd-io/etcd/releases/download/v${ETCD_VERSION}/etcd-v${ETCD_VERSION}-linux-amd64.tar.gz
   
   tar -zxvf etcd-v${ETCD_VERSION}-linux-amd64.tar.gz
   
   cp etcd-v${ETCD_VERSION}-linux-amd64/etcd /usr/bin/
   cp etcd-v${ETCD_VERSION}-linux-amd64/etcdctl /usr/bin/
   
   ll /usr/bin/etcd*
   ```

3. 新增Service脚本（第一台机器：192.168.80.81）

   ```shell
   cat > /usr/lib/systemd/system/etcd.service << EOF
   [Unit]
   Description=etcd key-value store
   Documentation=https://github.com/etcd-io/etcd
   After=network.target
   
   [Service]
   EnvironmentFile=/etc/etcd/etcd.conf
   ExecStart=/usr/bin/etcd
   Restart=always
   
   [Install]
   WantedBy=multi-user.target
   
   EOF
   
   cat /usr/lib/systemd/system/etcd.service
   ```

4. 创建 etcd CA 证书、复制到指定路径（第一台机器：192.168.80.81）

   ```shell
   cat > etcd_ssl.cnf << EOF
   [ req ]
   req_extensions = v3_req
   distinguished_name = req_distinguished_name
   
   [ req_distinguished_name ]
   
   [ v3_req ]
   basicConstraints = CA:FALSE
   keyUsage = nonRepudiation, digitalSignature, keyEncipherment
   subjectAltName = @alt_names
   
   [ alt_names ]
   IP.1 = $MASTER_1_IP
   IP.2 = $MASTER_2_IP
   IP.3 = $MASTER_3_IP
   
   EOF
   
   cat etcd_ssl.cnf
   ```

   ```shell
   mkdir -p /etc/etcd/pki/
   
   # 创建 etcd 服务端 CA 证书
   openssl genrsa -out etcd_server.key 2048
   openssl req -new -key etcd_server.key -config etcd_ssl.cnf -subj "/CN=etcd-server" -out etcd_server.csr
   openssl x509 -req -in etcd_server.csr -CA /etc/kubernetes/pki/etcd/ca.crt -CAkey /etc/kubernetes/pki/etcd/ca.key -CAcreateserial -days 36500 -extensions v3_req -extfile etcd_ssl.cnf -out etcd_server.crt
   
   cp etcd_server.crt /etc/etcd/pki/
   cp etcd_server.key /etc/etcd/pki/
   
   # 创建 etcd 客户端 CA 证书
   openssl genrsa -out etcd_client.key 2048
   openssl req -new -key etcd_client.key -config etcd_ssl.cnf -subj "/CN=etcd-client" -out etcd_client.csr
   openssl x509 -req -in etcd_client.csr -CA /etc/kubernetes/pki/etcd/ca.crt -CAkey /etc/kubernetes/pki/etcd/ca.key -CAcreateserial -days 36500 -extensions v3_req -extfile etcd_ssl.cnf -out etcd_client.crt
   
   cp etcd_client.crt /etc/etcd/pki/
   cp etcd_client.key /etc/etcd/pki/
   
   ll /etc/etcd/pki/
   ```

5. 创建 etcd 配置文件（第一台机器：192.168.80.81）

   ```shell
   
   cat > /etc/etcd/etcd.conf << EOF
   # 节点名称，每个节点不同
   ETCD_NAME=etcd1
   # 数据目录
   ETCD_DATA_DIR=/etc/etcd/data
   
   # etcd 服务端CA证书-crt
   ETCD_CERT_FILE=/etc/etcd/pki/etcd_server.crt
   # etcd 服务端CA证书-key
   ETCD_KEY_FILE=/etc/etcd/pki/etcd_server.key
   ETCD_TRUSTED_CA_FILE=/etc/kubernetes/pki/etcd/ca.crt
   # 是否启用客户端证书认证
   ETCD_CLIENT_CERT_AUTH=true
   # 客户端提供的服务监听URL地址
   ETCD_LISTEN_CLIENT_URLS=https://$MASTER_1_IP:2379
   ETCD_ADVERTISE_CLIENT_URLS=https://$MASTER_1_IP:2379
   
   # 集群各节点相互认证使用的CA证书-crt
   ETCD_PEER_CERT_FILE=/etc/etcd/pki/etcd_server.crt
   # 集群各节点相互认证使用的CA证书-key
   ETCD_PEER_KEY_FILE=/etc/etcd/pki/etcd_server.key
   # CA 根证书
   ETCD_PEER_TRUSTED_CA_FILE=/etc/kubernetes/pki/etcd/ca.crt
   # 为本集群其他节点提供的服务监听URL地址
   ETCD_LISTEN_PEER_URLS=https://$MASTER_1_IP:2380
   ETCD_INITIAL_ADVERTISE_PEER_URLS=https://$MASTER_1_IP:2380
   
   # 集群名称
   ETCD_INITIAL_CLUSTER_TOKEN=etcd-cluster
   # 集群各节点endpoint列表
   ETCD_INITIAL_CLUSTER="etcd1=https://$MASTER_1_IP:2380,etcd2=https://$MASTER_2_IP:2380,etcd3=https://$MASTER_3_IP:2380"
   # 初始集群状态
   ETCD_INITIAL_CLUSTER_STATE=new
   
   EOF
   
   cat /etc/etcd/etcd.conf
   ```

6. 启动（第一台机器：192.168.80.81）

   ```shell
   # 启动
   systemctl restart etcd
   systemctl enable etcd
   systemctl status etcd
   ```

7. 创建证书文件夹，为后面准备（第一台机器：192.168.80.81）

   ```shell
   mkdir /root/.ssh/
   ```

8. **第二台机器执行：192.168.80.82**

   ```shell
   # 一路回车
   ssh-keygen -t rsa
   ```

   ```shell
   # -P：指定端口
   # 让 MASTER 1 信任 MASTER 2，以后连接不需要再输入密码了
   scp -P 22 /root/.ssh/id_rsa.pub root@$MASTER_1_IP:/root/.ssh/authorized_keys
   ```

   ```shell
   mkdir -p /etc/kubernetes/pki/etcd
   mkdir -p /etc/etcd/pki/
   
   scp -P 22 root@$MASTER_1_IP:/usr/bin/etcd /usr/bin/
   scp -P 22 root@$MASTER_1_IP:/usr/bin/etcdctl /usr/bin/
   
   scp -P 22 root@$MASTER_1_IP:/etc/kubernetes/pki/etcd/ca.key /etc/kubernetes/pki/etcd/
   scp -P 22 root@$MASTER_1_IP:/etc/kubernetes/pki/etcd/ca.crt /etc/kubernetes/pki/etcd/
   
   scp -P 22 root@$MASTER_1_IP:/usr/lib/systemd/system/etcd.service /usr/lib/systemd/system/
   
   scp -P 22 root@$MASTER_1_IP:/etc/etcd/pki/etcd_server.crt /etc/etcd/pki/
   scp -P 22 root@$MASTER_1_IP:/etc/etcd/pki/etcd_server.key /etc/etcd/pki/
   scp -P 22 root@$MASTER_1_IP:/etc/etcd/pki/etcd_client.crt /etc/etcd/pki/
   scp -P 22 root@$MASTER_1_IP:/etc/etcd/pki/etcd_client.key /etc/etcd/pki/
   
   scp -P 22 root@$MASTER_1_IP:/etc/etcd/etcd.conf /etc/etcd/
   
   sudo sed -i "s#ETCD_NAME=etcd1#ETCD_NAME=etcd2#g" /etc/etcd/etcd.conf
   
   sudo sed -i "s#ETCD_LISTEN_CLIENT_URLS=https://$MASTER_1_IP:2379#ETCD_LISTEN_CLIENT_URLS=https://$MASTER_2_IP:2379#g" /etc/etcd/etcd.conf
   sudo sed -i "s#ETCD_ADVERTISE_CLIENT_URLS=https://$MASTER_1_IP:2379#ETCD_ADVERTISE_CLIENT_URLS=https://$MASTER_2_IP:2379#g" /etc/etcd/etcd.conf
   
   sudo sed -i "s#ETCD_LISTEN_PEER_URLS=https://$MASTER_1_IP:2380#ETCD_LISTEN_PEER_URLS=https://$MASTER_2_IP:2380#g" /etc/etcd/etcd.conf
   sudo sed -i "s#ETCD_INITIAL_ADVERTISE_PEER_URLS=https://$MASTER_1_IP:2380#ETCD_INITIAL_ADVERTISE_PEER_URLS=https://$MASTER_2_IP:2380#g" /etc/etcd/etcd.conf
   
   # 关闭防火墙
   systemctl stop firewalld.service
   systemctl disable firewalld.service
   
   # 启动
   systemctl restart etcd
   systemctl enable etcd
   systemctl status etcd
   ```

9. **第三台机器执行：192.168.80.83**

   ```shell
   # 一路回车
   ssh-keygen -t rsa
   ```

   ```shell
   # -P：指定端口
   # 让 MASTER 1 信任 MASTER 3，以后连接不需要再输入密码了
   scp -P 22 /root/.ssh/id_rsa.pub root@$MASTER_1_IP:/root/.ssh/authorized_keys
   ```

   ```shell
   mkdir -p /etc/kubernetes/pki/etcd
   mkdir -p /etc/etcd/pki/
   
   scp -P 22 root@$MASTER_1_IP:/usr/bin/etcd /usr/bin/
   scp -P 22 root@$MASTER_1_IP:/usr/bin/etcdctl /usr/bin/
   
   scp -P 22 root@$MASTER_1_IP:/etc/kubernetes/pki/etcd/ca.key /etc/kubernetes/pki/etcd/
   scp -P 22 root@$MASTER_1_IP:/etc/kubernetes/pki/etcd/ca.crt /etc/kubernetes/pki/etcd/
   
   scp -P 22 root@$MASTER_1_IP:/usr/lib/systemd/system/etcd.service /usr/lib/systemd/system/
   
   scp -P 22 root@$MASTER_1_IP:/etc/etcd/pki/etcd_server.crt /etc/etcd/pki/
   scp -P 22 root@$MASTER_1_IP:/etc/etcd/pki/etcd_server.key /etc/etcd/pki/
   scp -P 22 root@$MASTER_1_IP:/etc/etcd/pki/etcd_client.crt /etc/etcd/pki/
   scp -P 22 root@$MASTER_1_IP:/etc/etcd/pki/etcd_client.key /etc/etcd/pki/
   
   scp -P 22 root@$MASTER_1_IP:/etc/etcd/etcd.conf /etc/etcd/
   
   sudo sed -i "s#ETCD_NAME=etcd1#ETCD_NAME=etcd3#g" /etc/etcd/etcd.conf
   
   sudo sed -i "s#ETCD_LISTEN_CLIENT_URLS=https://$MASTER_1_IP:2379#ETCD_LISTEN_CLIENT_URLS=https://$MASTER_3_IP:2379#g" /etc/etcd/etcd.conf
   sudo sed -i "s#ETCD_ADVERTISE_CLIENT_URLS=https://$MASTER_1_IP:2379#ETCD_ADVERTISE_CLIENT_URLS=https://$MASTER_3_IP:2379#g" /etc/etcd/etcd.conf
   
   sudo sed -i "s#ETCD_LISTEN_PEER_URLS=https://$MASTER_1_IP:2380#ETCD_LISTEN_PEER_URLS=https://$MASTER_3_IP:2380#g" /etc/etcd/etcd.conf
   sudo sed -i "s#ETCD_INITIAL_ADVERTISE_PEER_URLS=https://$MASTER_1_IP:2380#ETCD_INITIAL_ADVERTISE_PEER_URLS=https://$MASTER_3_IP:2380#g" /etc/etcd/etcd.conf
   
   # 关闭防火墙
   systemctl stop firewalld.service
   systemctl disable firewalld.service
   
   # 启动
   systemctl restart etcd
   systemctl enable etcd
   systemctl status etcd
   ```

10. **测试（任意一台都可以执行）**

    ```shell
    etcdctl --cacert=/etc/kubernetes/pki/etcd/ca.crt --cert=/etc/etcd/pki/etcd_client.crt --key=/etc/etcd/pki/etcd_client.key --endpoints=https://$MASTER_1_IP:2379,https://$MASTER_2_IP:2379,https://$MASTER_3_IP:2379 endpoint health
    ```

    ```shell
    https://192.168.80.81:2379 is healthy: successfully committed proposal: took = 10.482222ms
    https://192.168.80.82:2379 is healthy: successfully committed proposal: took = 12.909542ms
    https://192.168.80.83:2379 is healthy: successfully committed proposal: took = 14.499036ms
    ```
