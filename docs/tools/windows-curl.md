# 小工具：Windows curl.exe

## 说明与使用

1. GitHub 仓库：[https://github.com/curl/curl](https://github.com/curl/curl)
2. GitHub 仓库 Windows 版：[https://github.com/curl/curl-for-win](https://github.com/curl/curl-for-win)
3. 下载页面：[https://curl.se/download.html](https://curl.se/download.html)
4. Windows 版下载页面：[https://curl.se/windows/](https://curl.se/windows/)
    1. 支持 64
       位，最新版下载链接：[https://curl.se/windows/latest.cgi?p=win64-mingw.zip](https://curl.se/windows/latest.cgi?p=win64-mingw.zip)
    2. 支持 ARM 64
       位，最新版下载链接：[https://curl.se/windows/latest.cgi?p=win64a-mingw.zip](https://curl.se/windows/latest.cgi?p=win64a-mingw.zip)
    3. 支持 32
       位，最新版下载链接：[https://curl.se/windows/latest.cgi?p=win32-mingw.zip](https://curl.se/windows/latest.cgi?p=win32-mingw.zip)
5. 解压
    ```shell
    C:\Users\xuxiaowei\Downloads\curl-7.88.1_2-win32-mingw>dir bin
     驱动器 C 中的卷没有标签。
     卷的序列号是 FEAB-1023
    
     C:\Users\xuxiaowei\Downloads\curl-7.88.1_2-win32-mingw\bin 的目录
    
    2023-03-16  08:36    <DIR>          .
    2023-03-16  08:36    <DIR>          ..
    2023-01-10  04:12           216,583 curl-ca-bundle.crt
    2023-02-20  07:30         4,628,040 curl.exe
    2023-02-20  07:30             2,269 libcurl.def
    2023-02-20  07:30         4,427,336 libcurl.dll
                   4 个文件      9,274,228 字节
                   2 个目录 32,503,496,704 可用字节
    
    C:\Users\xuxiaowei\Downloads\curl-7.88.1_2-win32-mingw>
    ```

6. 将 curl.exe 文件直接放入 C:\Windows 或 C:\Windows\System32 或 C:\Windows\SysWOW64 文件夹
7. cmd 可直接运行 curl
    ```shell
    C:\Users\xuxiaowei>curl -V
    curl 7.88.1 (i686-w64-mingw32) libcurl/7.88.1 OpenSSL/3.0.8 (Schannel) zlib/1.2.13 brotli/1.0.9 zstd/1.5.4 WinIDN libssh2/1.10.0 nghttp2/1.52.0 ngtcp2/0.13.1 nghttp3/0.9.0 libgsasl/2.2.0
    Release-Date: 2023-02-20
    Protocols: dict file ftp ftps gopher gophers http https imap imaps ldap ldaps mqtt pop3 pop3s rtsp scp sftp smb smbs smtp smtps telnet tftp ws wss
    Features: alt-svc AsynchDNS brotli gsasl HSTS HTTP2 HTTP3 HTTPS-proxy IDN IPv6 Kerberos Largefile libz MultiSSL NTLM SPNEGO SSL SSPI threadsafe TLS-SRP UnixSockets zstd
    
    C:\Users\xuxiaowei>
    ```
