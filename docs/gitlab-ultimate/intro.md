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

| 功能                              | 适用版本    | 引入版本  | 群组引入版本 | 功能标志 | 群组功能标志                   | 默认启用版本 | 移除功能标记 | UI 管理 | 中文文档(更新较慢)                                                                                 | 英文文档                                                                                      |
|---------------------------------|---------|-------|--------|------|--------------------------|--------|--------|-------|--------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| [待命计划管理](oncall-schedules.md)   | 专业版、旗舰版 | 13.11 |        |      |                          |        |        |       | [极狐GitLab](https://docs.gitlab.cn/jh/operations/incident_management/oncall_schedules.html) | [GitLab](https://docs.gitlab.com/ee/operations/incident_management/oncall_schedules.html) |
| [审计事件](audit-events.md)         | 专业版、旗舰版 |       |        |      |                          |        |        |       | [极狐GitLab](https://docs.gitlab.cn/jh/administration/audit_events.html)                     | [GitLab](https://docs.gitlab.com/ee/administration/audit_events.html)                     |
| [依赖列表](dependency-list.md)      | 旗舰版     | 14.6  | 16.2   |      | group_level_dependencies |        |        |       | [极狐GitLab](https://docs.gitlab.cn/jh/user/application_security/dependency_list/index.html) | [GitLab](https://docs.gitlab.com/ee/user/application_security/dependency_list/index.html) |
| [安全仪表盘](security-dashboard.md)  | 旗舰版     |       |        |      |                          |        |        |       | [极狐GitLab](https://docs.gitlab.cn/jh/user/application_security/security_dashboard/)        | [GitLab](https://docs.gitlab.com/ee/user/application_security/security_dashboard/)        |
| [漏洞报告](vulnerability-report.md) | 旗舰版     |       |        |      |                          |        |        |       | [极狐GitLab](https://docs.gitlab.cn/jh/user/application_security/vulnerability_report/)      | [GitLab](https://docs.gitlab.com/ee/user/application_security/vulnerability_report/)      |
| [许可证合规](license-compliance.md)  | 旗舰版     |       |        |      |                          |        |        |       | [极狐GitLab](https://docs.gitlab.cn/jh/user/compliance/license_compliance/index.html)        | [GitLab](https://docs.gitlab.com/ee/user/compliance/license_compliance/index.html)        |
