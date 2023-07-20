# CentOS、Anolis 龙蜥 源码编译 异常处理

## 常见异常

1. 异常：
    ```shell
    /bin/sh: cc: command not found
    ```
   解决：
    ```shell
    yum -y install gcc
    ```

2. 异常
    ```shell
    #include <openssl/ssl.h>
    ```
   解决：
    ```shell
    yum -y install openssl-devel
    ```

3. 异常
    ```shell
    #include <curl/curl.h>
    ```
   解决：
    ```shell
    yum -y install curl-devel
    ```

4. 异常
    ```shell
    #include <expat.h>
    ```
   解决：
    ```shell
    yum -y install expat-devel
    ```

5. 异常
    ```shell
    -bash: make: command not found
    ```
   解决：
    ```shell
    yum -y install make
    ```

6. 异常
    ```shell
    #include <jemalloc/jemalloc.h>
    ```
   解决：
    ```shell
    make MALLOC=libc
    ```

7. 异常
    ```shell
    You need tcl 8.5 or newer in order to run the Redis test
    ```
   解决：
    ```shell
    yum -y install tcl
    ```

8. 异常
    ```shell
    #error "Required C99 support is in a test phase
    ```
   解决：
    ```shell
    make CFLAGS=-std=c99
    ```

9. 异常
   ```shell
   -bash: autoreconf: command not found
   ```
   解决：
   ```shell
   yum -y install autoconf
   ```

10. 异常
    ```shell
    Can't exec "aclocal": No such file or directory at /usr/share/autoconf/Autom4te/FileUtils.pm line 326.
    autoreconf: failed to run aclocal: No such file or directory
    ```
    解决：
    ```shell
    yum install -y libtool
    ```

11. 异常
    ```shell
    configure: error: *** zlib.h missing - please install first or check config.log ***
    ```
    解决：
    ```shell
    yum -y install zlib-devel
    ```

12. 异常

    ```shell
    configure: error: *** working libcrypto not found, check config.log
    ```
    解决：
    ```shell
    yum -y install openssl-devel
    ```

13. 异常
    ```shell
    -bash: tar: command not found
    ```
    解决：
    ```shell
    yum -y install tar 
    ```

14. 异常
    ```shell
    #error "Required C99 support is in a test phase.
    ```
    解决：
    ```shell
    make CFLAGS=-std=c99
    make CFLAGS=-std=c99 install
    ```

15. 异常
    ```shell
    error: no acceptable C compiler found in $PATH
    ```
    解决
    ```shell
    yum -y install gcc
    ```

16. 异常
    ```shell
    configure: error: 
      !!! OpenSSL is not properly installed on your system. !!!
      !!! Can not include OpenSSL headers files.            !!!
    ```
    解决
    ```shell
    yum -y install openssl-devel
    ```

17. 异常
    ```shell
    *** WARNING - this build will not support IPVS with IPv6. Please install libnl/libnl-3 dev libraries to support IPv6 with IPVS.
    ```
    解决
    ```shell
    yum -y install libnl3-devel
    ```

18. 异常
    ```shell
    src/haproxy.c:80:31: fatal error: systemd/sd-daemon.h: No such file or directory
     #include <systemd/sd-daemon.h>
    ```
    解决
    ```shell
    yum -y install systemd-devel
    ```

19. 异常
    ```shell
    Please install libnl/libnl-3 dev libraries to support IPv6 with IPVS.
    ```
    解决：
    ```shell
    yum -y install libnl3-devel
    # yum -y install libnl-devel
    ```

## 总结

1. 如果遇见 `#include <**xxx**.h>`时，什么都不用考虑，直接取执行安装命令：`yum -y install **xxx**-devel`，然后进行重试
