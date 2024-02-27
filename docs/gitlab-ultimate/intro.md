---
sidebar_position: 1
---

# GitLab 旗舰版 简介

以 [极狐GitLab](https://jihulab.com) 旗舰版 为例

## 说明

1. 只要你没有付费，无论你安装的是 `gitlab-ce(社区版)`、`gitlab-ee(企业版)`、`gitlab-jh(极狐版，中国特供企业版)`
   其中的哪个版本，只能体验`免费版`的功能

## 权益与功能

### 权益

1. `群组`中流水线配额 50000 分钟：[流水线使用量配额](pipelines-quota-tab.md)
2. `受保护分支`、`受保护的标签` 的配置精确到`用户`，而不是只能设置到角色：
   [仓库受保护分支和标签](repository-protected-branches-tags.md)

### 功能

- 功能标志
    - [极狐GitLab](https://docs.gitlab.cn/jh/operations/feature_flags.html)
    - [GitLab](https://docs.gitlab.com/ee/operations/feature_flags.html)
- 群组配置
    - <strong><font color="red">`下方表格中带括号的代表群组相关配置`</font></strong>，如：
        1. 项目 `依赖列表` 引入于 GitLab 14.6
        2. 群组 `依赖列表` 引入于 GitLab 16.2，`默认禁用`，群组 `依赖列表` 功能标志是 `group_level_dependencies`
        3. 群组 `依赖列表` 默认启用于 GitLab 16.4

| 功能                              | 适用版本    | 引入版本       | 功能标志                       | 默认启用版本 | 中文(更新慢)/英文文档                                                                                                                                                                                                                                                            |
|---------------------------------|---------|------------|----------------------------|--------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [待命计划管理](oncall-schedules.md)   | 旗舰版、专业版 | 13.11      |                            |        | [中文](https://docs.gitlab.cn/jh/operations/incident_management/oncall_schedules.html)/[英文](https://docs.gitlab.com/ee/operations/incident_management/oncall_schedules.html)                                                                                              |
| [审计事件](audit-events.md)         | 旗舰版、专业版 |            |                            |        | [中文](https://docs.gitlab.cn/jh/administration/audit_events.html)/[英文](https://docs.gitlab.com/ee/administration/audit_events.html)                                                                                                                                      |
| [依赖列表](dependency-list.md)      | 旗舰版     | 14.6(16.2) | (group_level_dependencies) | (16.4) | [中文](https://docs.gitlab.cn/jh/user/application_security/dependency_list/index.html)/[英文](https://docs.gitlab.com/ee/user/application_security/dependency_list/index.html)                                                                                              |
| [安全仪表盘](security-dashboard.md)  | 旗舰版     |            |                            |        | [中文](https://docs.gitlab.cn/jh/user/application_security/security_dashboard/)/[英文](https://docs.gitlab.com/ee/user/application_security/security_dashboard/)                                                                                                            |
| [漏洞报告](vulnerability-report.md) | 旗舰版     |            |                            |        | [中文](https://docs.gitlab.cn/jh/user/application_security/vulnerability_report/)/[英文](https://docs.gitlab.com/ee/user/application_security/vulnerability_report/)                                                                                                        |
| [许可证合规](license-compliance.md)  | 旗舰版     |            |                            |        | [中文](https://docs.gitlab.cn/jh/user/compliance/license_compliance/index.html)/[英文](https://docs.gitlab.com/ee/user/compliance/license_compliance/index.html)                                                                                                            |
| [默认分支文件和目录锁](file-lock.md)      | 旗舰版、专业版 |            |                            |        | [中文](https://docs.gitlab.cn/jh/user/project/file_lock.html#%E9%BB%98%E8%AE%A4%E5%88%86%E6%94%AF%E6%96%87%E4%BB%B6%E5%92%8C%E7%9B%AE%E5%BD%95%E9%94%81-premium-all)/[英文](https://docs.gitlab.com/ee/user/project/file_lock.html#default-branch-file-and-directory-locks) |
