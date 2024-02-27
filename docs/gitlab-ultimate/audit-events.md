---
sidebar_position: 5
---

# 审计事件

## 说明

1. 只要你没有付费，无论你安装的是 `gitlab-ce(社区版)`、`gitlab-ee(企业版)`、`gitlab-jh(极狐版，中国特供企业版)`
   其中的哪个版本，只能体验`免费版`的功能

## 群组审计事件

### 可根据`成员`、`时间范围`搜索`成员操作日志`

![audit-events-1.png](static/audit-events-1.png)

### 可将`群组审计事件`发送到`HTTP端点`、`Google Cloud 日志`、`AWS S3(对象储存)`

![audit-events-2.png](static/audit-events-2.png)

1. `HTTP端点`可自定义`HTTP headers`、`事件`、`群组或项目`发送到指定URL
   ![audit-events-3.png](static/audit-events-3.png)

2. `Google Cloud 日志`配置如下
   ![audit-events-4.png](static/audit-events-4.png)

3. `AWS S3(对象储存)`配置如下
   ![audit-events-5.png](static/audit-events-5.png)

## 项目审计事件

### 可根据`成员`、`时间范围`搜索`成员操作日志`

![audit-events-6.png](static/audit-events-6.png)
