---
sidebar_position: 8
---

# 批量删除 k8s（ctr）使用的历史镜像

批量删除历史镜像，减小磁盘占用

## 说明

1. 以 k8s 使用 containerd 为例
2. k8s 滚动发布时，一般采用改动镜像ID，比如：某个镜像，首次发布的时候是 0.0.1-SNAPSHOT，第一次更新时版本号为
   0.0.1-SNAPSHOT-1，第二次更新时版本号为 0.0.1-SNAPSHOT-2，第三次更新时版本号为
   0.0.1-SNAPSHOT-3，以此类推（其中在版本号后面新增的数字，可以使用各种CI/CD流水线中的环境变量来解决，比如 GitLab Runner 中的
   $CI_PIPELINE_ID），更新次数越多，k8s历史使用的镜像越大，占用磁盘越多。
3. 并且 k8s 使用 ctr 时，镜像在磁盘中保存一份，镜像ID保存两份，一份是制作镜像时的镜像名称，一份是镜像名中包含镜像的 sha256
   值，**只有两个都删除时，才能删除磁盘中的镜像文件**，查看镜像时，两者同时展示。
4. k8s 使用 ctr 时，镜像储存在 k8s.io 的命名空间中

## 命令

以镜像名中包含 xuxiaowei 为例去操作

| 查看 ctr 中 k8s 使用过的镜像                 | ctr -n=k8s.io i ls                                                          |
|-------------------------------------|-----------------------------------------------------------------------------|
| 查看 ctr 中 k8s 使用过的镜像：搜索              | ctr -n=k8s.io i ls &#124; grep xuxiaowei                                    |
| 查看 ctr 中 k8s 使用过的镜像：搜索：展示镜像ID       | ctr -n=k8s.io i ls -q &#124; grep xuxiaowei                                 |
| 查看 ctr 中 k8s 使用过的镜像：搜索：展示镜像ID：拼接    | ctr -n=k8s.io i ls -q &#124; grep xuxiaowei &#124; xargs                    |
| 查看 ctr 中 k8s 使用过的镜像：搜索：展示镜像ID：拼接：删除 | ctr -n=k8s.io i ls -q &#124; grep xuxiaowei &#124; xargs ctr -n=k8s.io i rm |
