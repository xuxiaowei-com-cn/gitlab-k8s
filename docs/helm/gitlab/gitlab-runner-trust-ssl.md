---
sidebar_position: 102
---

# gitlab runner 信任域名证书（未完成）

## 问题

参见 [gitlab-runner-host.md](gitlab-runner-host.md)

## 说明

- 解决方案是使用颁发给域名 gitlab.test.helm.xuxiaowei.cn 的证书，可以使用自己的域名去各大云厂商免费申请，或者使用自己根据域名
  gitlab.test.helm.xuxiaowei.cn 生成的证书
    1. [阿里云SSL(https)证书免费申请](https://yundun.console.aliyun.com/?p=cas#/certExtend/buy)
    2. [腾讯云SSL(https)证书免费申请](https://console.cloud.tencent.com/ssl)
    3. [华为云SSL(https)证书免费申请](https://console.huaweicloud.com/console/#/ccm/scs/certList)
    4. [百度云SSL(https)证书免费申请](https://console.bce.baidu.com/cas/#/cas/purchased/common/list)

## 域名证书解决方案

### 方案1：重新配置 gitlab，自动生成对应证书并自动配置，然后在 gitlab runner 中信任证书

### 方案2：配置正规机构颁发的证书（如：上述各大云厂商的证书），一般无需在 gitlab 配置信任证书，即可正常使用

- 正规机构颁发的证书，在 gitlab runner 中依然无法正常使用的解决办法
