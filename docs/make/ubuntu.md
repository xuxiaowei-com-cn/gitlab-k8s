# Ubuntu 乌班图 源码编译 异常处理

## 常见异常

1. 异常
    ```shell
    error: C compiler cc is not found
    ```
   解决：
    ```shell
    sudo apt update
    sudo apt -y install gcc
    ```

2. 异常
    ```shell
    --with-openssl=<path>
    ```
   解决：
    ```shell
    sudo apt update
    sudo apt -y install libssl-dev
    ```

3. 异常
    ```shell
    <zlib.h>
    --with-zlib=<path>
    ```
   解决：
    ```shell
    sudo apt update
    sudo apt -y install zlib1g-dev
    ```

4. 异常
    ```shell
    <curl/curl.h>
    ```
   解决：
    ```shell
    sudo apt -y install libcurl4-gnutls-dev
    ```

5. 异常
    ```shell
    <expat.h>
    ```
   解决：
    ```shell
    sudo apt update
    sudo apt -y install libexpat1-dev
    ```

6. 异常
    ```shell
    GITGUI_VERSION = 0.21.GITGUI
        * new locations or Tcl/Tk interpreter
        GEN git-gui
        INDEX lib/
        * tclsh failed; using unoptimized loading
        MSGFMT po/pt_pt.msg make[1]: *** [Makefile:254：po/pt_pt.msg] 错误 127
    make: *** [Makefile:2109：all] 错误 2
    ```
   解决：
    ```shell
    sudo apt update
    sudo apt -y install gettext
    ```

7. 异常
    ```shell
    --with-pcre=<path>
    ```
   解决：
    ```shell
    sudo apt update
    sudo apt -y install libpcre3-dev
    ```

8. 异常
    ```shell
    Command 'make' not found
    ```
   解决：
    ```shell
    sudo apt update
    sudo apt -y install make
    ```

9. 异常
    ```shell
    Command 'autoreconf' not found
    ```
   解决：
    ```shell
    sudo apt update
    sudo apt -y install autoconf
    ```

10. 异常
    ```shell
    Please install libnl/libnl-3 dev libraries to support IPv6 with IPVS.
    ```
    解决：
    ```shell
    apt -y install libnl-3-dev
    # apt -y install libnl-dev
    ```
