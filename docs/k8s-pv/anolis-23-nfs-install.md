---
sidebar_position: 4
---

# AnolisOS 23 中安装 NFS

## 说明

1. NFS（Network File System）网络文件系统
2. NFS 仅推荐在测试环境使用

## 配置

1. 安装 NFS

    ```shell
    yum -y install rpcbind nfs-utils
    ```

2. 创建用于储存 NFS 的文件夹

    ```shell
    mkdir -p /nfs
    ```

3. 配置 NFS

    ```shell
    # -bash: vim: command not found
    # yum -y install vim
    vim /etc/exports
    ```

    ```shell
    /nfs *(rw,sync,all_squash,anonuid=0,anongid=0)
    
    # rw：
    # sync：
    # all_squash：
    # anonuid：
    # anongid：
    ```

4. 启动 rpcbind

    ```shell
    # 查看状态
    systemctl status rpcbind.service
    
    # 查看开机自启状态
    systemctl list-unit-files | grep rpcbind.service
    
    # 启动
    systemctl start rpcbind.service
    
    # 设置开机自启
    systemctl enable rpcbind.service
    ```

    ```shell
    # 停止
    systemctl stop rpcbind.service
    
    # 关闭开机自启
    systemctl disable rpcbind.service
    ```

5. 启动 nfs **或者是 nfs-server**

    ```shell
    # 查看状态
    systemctl status nfs-server.service
    
    # 查看开机自启状态
    systemctl list-unit-files | grep nfs-server.service
    
    # 启动
    systemctl start nfs-server.service
    
    # 设置开机自启
    systemctl enable nfs-server.service
    ```

    ```shell
    # 停止
    systemctl stop nfs-server.service
    
    # 关闭开机自启
    systemctl disable nfs-server.service
    ```

6. 检查端口与进程

    ```shell
    rpcinfo -p 127.0.0.1
    ```

    ```shell
    [root@localhost ~]# rpcinfo -p 127.0.0.1
    program vers proto   port  service
     100000    4   tcp    111  portmapper
     100000    3   tcp    111  portmapper
     100000    2   tcp    111  portmapper
     100000    4   udp    111  portmapper
     100000    3   udp    111  portmapper
     100000    2   udp    111  portmapper
     100024    1   udp  51091  status
     100024    1   tcp  57787  status
     100005    1   udp  20048  mountd
     100005    1   tcp  20048  mountd
     100005    2   udp  20048  mountd
     100005    2   tcp  20048  mountd
     100005    3   udp  20048  mountd
     100005    3   tcp  20048  mountd
     100003    3   tcp   2049  nfs
     100003    4   tcp   2049  nfs
     100227    3   tcp   2049  nfs_acl
     100021    1   udp  32987  nlockmgr
     100021    3   udp  32987  nlockmgr
     100021    4   udp  32987  nlockmgr
     100021    1   tcp  39167  nlockmgr
     100021    3   tcp  39167  nlockmgr
     100021    4   tcp  39167  nlockmgr
     [root@localhost ~]# 
    ```

7. 查看NFS

    ```shell
    showmount -e 127.0.0.1
    ```

    ```shell
    [root@localhost ~]# showmount -e 127.0.0.1
    Export list for 127.0.0.1:
    /nfs *
    [root@localhost ~]# 
    ```

8. 将NFS客户IP添加到信任区

    ```shell
    # 将NFS客户端IP添加到信任区
    firewall-cmd --zone=trusted --add-source=172.25.25.4 --permanent
    # 重载防火墙
    firewall-cmd --reload
    # 查看信任区的配置
    firewall-cmd --list-all --zone=trusted
    ```

9. 测试
    1. Linux 挂载 NFS
        1. 挂载（本机挂载，仅用于测试，其他Linux客户端挂载同理，客户端与服务端安装相同的软件）

            ```shell
            mkdir -p /test/nfs
            mount -t nfs 127.0.0.1:/nfs /test/nfs
            
            # 永久挂载
            # vim /etc/fstab
            # 127.0.0.1:/nfs  /test/nfs       nfs     defaults,_netdev 0 0
            ```

            ```shell
            [root@localhost ~]# mkdir /test/nfs
            [root@localhost ~]# mount -t nfs 127.0.0.1:/nfs /test/nfs
            [root@localhost ~]#
            ```

            ```shell
            [root@localhost ~]# df -h
            Filesystem                  Size  Used Avail Use% Mounted on
            devtmpfs                    4.0M     0  4.0M   0% /dev
            tmpfs                       2.0G     0  2.0G   0% /dev/shm
            tmpfs                       784M  1.7M  782M   1% /run
            /dev/mapper/ao_anolis-root   95G  6.3G   89G   7% /
            tmpfs                       2.0G     0  2.0G   0% /tmp
            /dev/sda2                  1014M  163M  852M  17% /boot
            tmpfs                       392M     0  392M   0% /run/user/0
            127.0.0.1:/nfs               95G  6.3G   89G   7% /test/nfs
            [root@localhost ~]# 
            ```
