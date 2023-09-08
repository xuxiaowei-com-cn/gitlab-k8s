---
sidebar_position: 2
---

# NFS（Network File System）网络文件系统

## 说明

1. NFS（Network File System）网络文件系统
2. NFS 仅推荐在测试环境使用

## 优点

1. 安装简单
2. 学习简单
3. 使用方便
4. 可不使用 PV、PVC 进行直连

## 缺点

以下内容均出自作者本人测试

1. docker 镜像 /var/lib/docker 路径不可使用 NFS，否则 `docker pull` 命令非常慢，无法忍受
    1. 使用 hostPath 正常运行

2. GitLab 使用 Helm 安装时，发现 postgresql 数据不可使用 NFS 挂载，否则 postgresql pod 无法正常运行
    1. GitLab Helm 使用的是 bitnami/postgresql 镜像
    2. GitLab Helm 全部使用 local PV 正常运行
    3. 安装时，其他 pod 没测试不使用 NFS 是否能正常使用
