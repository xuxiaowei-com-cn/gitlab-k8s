# GitLab 导读

开源代码托管平台，可免费私有部署，完善的代码全生命周期的管理功能。

## 资料

1. [DevOps 工具布局一览](https://gitlab.cn/devops-tools/)
2. [极狐GitLab vs GitHub](https://gitlab.cn/devops-tools/github-vs-gitlab/)
3. [极狐GitLab vs GitLab vs GitHub vs Gitee](https://gitlab.cn/comparison/)

## 介绍

1. `GitLab` 是基于 `Git` 的一个开源的代码管理平台
2. 支持 代码测试与覆盖
3. 支持 持续集成(`CI`)
4. 支持 持续交付(`CD`)
5. 支持 持续部署(`CD`)
6. 支持 `Pages`
7. 支持 `K8S`
8. 支持代码审查
9. 支持 `Web IDE`
10. 支持流水线缓存
11. 支持产物上传
12. 支持高级部署
13. 支持合并队列
14. 支持发布编排
15. 支持镜像 & 包仓库（`docker` 镜像仓库、`Maven` 仓库等）
16. 等等

## 说明

1. `GitLab` 是一个代码管理平台，同时也是一个公司
2. [https://gitlab.com](https://gitlab.com) 是 gitlab 公司提供的代码托平台
3. `GitLab` 现在仅发布了三款软件：`gitlab-ce`（社区版）、`gitlab-ee`（企业版）、`gitlab-jh`（极狐版）
    1. 对于非付费用户来说，没有本质区别
    2. 使用 `gitlab-jh`（极狐版）可以使用更多国内用户个性化的需求
        1. [钉钉扫码登录](https://docs.gitlab.cn/jh/integration/ding_talk.html)
        2. [钉钉集成](https://docs.gitlab.cn/jh/user/project/integrations/dingtalk_integration.html)
            1. 引入于极狐GitLab `15.1`，功能标志为 `dingtalk_integration`。默认禁用。
            2. 功能标志 `dingtalk_integration` 移除于极狐GitLab `15.5`。
            3. [钉钉命令](https://docs.gitlab.cn/jh/user/project/integrations/dingtalk_command.html)
        3. [飞书集成和通知](https://docs.gitlab.cn/jh/user/project/integrations/feishu_integration_and_notification.html)
            1. 引入于极狐GitLab `15.2`，功能标志为 `feishu_integration`。默认禁用。
            2. 功能标志 `feishu_integration` 移除于极狐GitLab `15.4`。
        4. [飞书机器人](https://docs.gitlab.cn/jh/user/project/integrations/feishu_bot_command.html)
            1. 引入于极狐GitLab `15.4`，功能标志为 `feishu_bot_integration`。默认禁用。
            2. 功能标志 `feishu_bot_integration` 移除于极狐GitLab `15.6`。
        5. [企业微信集成和通知](https://docs.gitlab.cn/jh/user/project/integrations/wecom_notifications.html)
            1. 引入于极狐GitLab `16.2`，功能标志为 `wecom_integration`。默认禁用。
4. 公司与个人搭建`GitLab`时，可以选择任意一种，如果有计划购买，推荐安装 `gitlab-jh`（极狐版）、`gitlab-ee`（企业版）。本人推荐在安装时就选择
   `gitlab-jh`（极狐版），后期有需要直接购买即可，不用担心从`gitlab-ce`（社区版）版本升级的问题（安装 `gitlab-jh`、`gitlab-ee`
   不购买授权，默认使用社区版的功能）
5. 极狐GitLab 是一家国内的公司，GitLab 官方以技术入股的形式参股
