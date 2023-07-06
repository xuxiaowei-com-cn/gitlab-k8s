# MySQL 下载、安装

1. 安装镜像源

   |           | CentOS 7                                                                                                                          | CentOS 8                                                                                                                          |
   |-----------|-----------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
   | MySQL 5.7 | yum -y install [http://repo.mysql.com/mysql57-community-release-el7.rpm](http://repo.mysql.com/mysql57-community-release-el7.rpm) | 官方未提供，可尝试其他版本                                                                                                                     |
   | MySQL 8.0 | yum -y install [http://repo.mysql.com/mysql80-community-release-el7.rpm](http://repo.mysql.com/mysql80-community-release-el7.rpm) | yum -y install [http://repo.mysql.com/mysql80-community-release-el8.rpm](http://repo.mysql.com/mysql80-community-release-el8.rpm) |

2. 查看已安装的源
    ```shell
    ll /etc/yum.repos.d/
    ```
    ```shell
    [root@192 ~]# ll /etc/yum.repos.d/
    total 48
    -rw-r--r--. 1 root root 1664 Oct 23  2020 CentOS-Base.repo
    -rw-r--r--. 1 root root 1309 Oct 23  2020 CentOS-CR.repo
    -rw-r--r--. 1 root root  649 Oct 23  2020 CentOS-Debuginfo.repo
    -rw-r--r--. 1 root root  314 Oct 23  2020 CentOS-fasttrack.repo
    -rw-r--r--. 1 root root  630 Oct 23  2020 CentOS-Media.repo
    -rw-r--r--. 1 root root 1331 Oct 23  2020 CentOS-Sources.repo
    -rw-r--r--. 1 root root 8515 Oct 23  2020 CentOS-Vault.repo
    -rw-r--r--. 1 root root  616 Oct 23  2020 CentOS-x86_64-kernel.repo
    -rw-r--r--. 1 root root 1838 Apr 27  2017 mysql-community.repo
    -rw-r--r--. 1 root root 1885 Apr 27  2017 mysql-community-source.repo
    [root@192 ~]# 
    ```

3. 搜索MySQL版本
    ```shell
    yum --showduplicates list mysql-community-server --nogpgcheck
    # 其中 --nogpgcheck 是不验证gpg签名。根据需要选择
    ```
    ```shell
    [root@192 ~]# yum --showduplicates list mysql-community-server --nogpgcheck
    Loaded plugins: fastestmirror
    Determining fastest mirrors
    * base: mirrors.aliyun.com
    * extras: mirrors.aliyun.com
    * updates: mirrors.163.com
    base                                                                                                                                         | 3.6 kB  00:00:00     
    extras                                                                                                                                       | 2.9 kB  00:00:00     
    mysql-connectors-community                                                                                                                   | 2.6 kB  00:00:00     
    mysql-tools-community                                                                                                                        | 2.6 kB  00:00:00     
    mysql57-community                                                                                                                            | 2.6 kB  00:00:00     
    updates                                                                                                                                      | 2.9 kB  00:00:00     
    (1/7): base/7/x86_64/primary_db                                                                                                              | 6.1 MB  00:00:00     
    (2/7): base/7/x86_64/group_gz                                                                                                                | 153 kB  00:00:00     
    (3/7): mysql-tools-community/x86_64/primary_db                                                                                               |  91 kB  00:00:01     
    (4/7): extras/7/x86_64/primary_db                                                                                                            | 249 kB  00:00:01     
    (5/7): updates/7/x86_64/primary_db                                                                                                           |  19 MB  00:00:00     
    (6/7): mysql-connectors-community/x86_64/primary_db                                                                                          |  96 kB  00:00:01     
    (7/7): mysql57-community/x86_64/primary_db                                                                                                   | 331 kB  00:00:02     
    Available Packages
    mysql-community-server.x86_64                                                     5.7.9-1.el7                                                      mysql57-community
    mysql-community-server.x86_64                                                     5.7.10-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.11-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.12-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.13-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.14-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.15-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.16-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.17-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.18-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.19-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.20-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.21-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.22-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.23-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.24-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.25-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.26-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.27-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.28-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.29-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.30-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.31-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.32-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.33-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.34-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.35-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.36-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.37-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.38-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.39-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.40-1.el7                                                     mysql57-community
    mysql-community-server.x86_64                                                     5.7.41-1.el7                                                     mysql57-community
    [root@192 ~]# 
    ```

4. 安装
    1. 安装指定版本，如：5.7.35-1.el7
        ```shell
        yum -y install mysql-community-server-5.7.35-1.el7 --nogpgcheck
        # 其中 --nogpgcheck 是不验证gpg签名。根据需要选择
        ```

    2. 安装最新版（根据已安装的源进行选择）
        ```shell
        yum -y install mysql-community-server --nogpgcheck
        # 其中 --nogpgcheck 是不验证gpg签名。根据需要选择
        ```

5. 启动
    ```shell
    systemctl start mysqld
    ```

6. 开启开机自启
    ```shell
    systemctl enable mysqld
    ```

7. 查看临时密码（仅本地连接）
    ```shell
    grep 'temporary password' /var/log/mysqld.log
    ```
    ```shell
    [root@192 ~]# grep 'temporary password' /var/log/mysqld.log
    2023-03-08T13:44:54.413365Z 1 [Note] A temporary password is generated for root@localhost: J)p2oBnpm=fk
    [root@192 ~]# 
    ```

8. 连接
    ```shell
    mysql -u root -p
    ```
    ```shell
    [root@192 ~]# mysql -u root -p
    Enter password: 
    Welcome to the MySQL monitor.  Commands end with ; or \g.
    Your MySQL connection id is 2
    Server version: 5.7.35
    
    Copyright (c) 2000, 2023, Oracle and/or its affiliates.
    
    Oracle is a registered trademark of Oracle Corporation and/or its
    affiliates. Other names may be trademarks of their respective
    owners.
    
    Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
    
    mysql> 
    ```

9. 修改密码强度
    1. MySQL 5.7
        ```shell
        set global validate_password_policy=0;
        set global validate_password_mixed_case_count=0;
        set global validate_password_number_count=0;
        set global validate_password_special_char_count=0;
        set global validate_password_length=4;
        ```
        ```shell
        mysql> set global validate_password_policy=0;
        Query OK, 0 rows affected (0.00 sec)
        
        mysql> set global validate_password_mixed_case_count=0;
        Query OK, 0 rows affected (0.00 sec)
        
        mysql> set global validate_password_number_count=0;
        Query OK, 0 rows affected (0.00 sec)
        
        mysql> set global validate_password_special_char_count=0;
        Query OK, 0 rows affected (0.00 sec)
        
        mysql> set global validate_password_length=4;
        Query OK, 0 rows affected (0.00 sec)
        
        mysql> 
        ```

    2. MySQL 8.0

         ```shell
         set global validate_password.policy=0;
         set global validate_password.mixed_case_count=0;
         set global validate_password.number_count=0;
         set global validate_password.special_char_count=0;
         set global validate_password.length=4;
         ```

10. 修改密码

    ```shell
    # 首次登录需要修改密码
    ALTER USER 'root'@'localhost' IDENTIFIED BY 'MyNewPass4!';
    ```

11. 授权远程连接

    ```shell
    RENAME USER `root`@`localhost` TO `root`@`%`;
    ```

12. 开放端口

    ```shell
    firewall-cmd --zone=public --add-port=3306/tcp --permanent
    firewall-cmd --reload
    firewall-cmd --list-all
    ```
