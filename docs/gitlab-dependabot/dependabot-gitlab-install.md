---
sidebar_position: 1
---

# GitLab 依赖机器人 安装

GitLab 依赖机器人 dependabot-gitlab 使用 docker compose 安装

## 说明

1. 源代码：[https://gitlab.com/dependabot-gitlab/dependabot](https://gitlab.com/dependabot-gitlab/dependabot)
2. 文档：[https://dependabot-gitlab.gitlab.io/dependabot/](https://dependabot-gitlab.gitlab.io/dependabot/)
    1. [入门](https://dependabot-gitlab.gitlab.io/dependabot/guide/getting-started.html)
    2. [配置文件](https://dependabot-gitlab.gitlab.io/dependabot/config/configuration.html)
    3. [环境变量](https://dependabot-gitlab.gitlab.io/dependabot/config/environment.html)
    4. [钩子Webhook](https://dependabot-gitlab.gitlab.io/dependabot/config/webhooks.html)
    5. [API](https://dependabot-gitlab.gitlab.io/dependabot/using/api.html)
    6. [UI](https://dependabot-gitlab.gitlab.io/dependabot/using/ui.html)
3. 介绍
    1. 是一个开源的依赖管理工具，可以自动更新应用程序中的依赖库，保证应用程序的稳定性和安全性。
    2. 支持多种编程语言和包管理器，包括但不限于Ruby、Python、Java、JavaScript等，并且可以扩展到更多的编程语言和包管理器。
    3. 可以集成到GitLab中，能够在GitLab的Pull Request页面上显示有关依赖更新的信息，并自动生成相应的合并请求。
    4. 可以自动检测GitHub中的依赖库更新，以及最佳的版本，从而减少手动更新的工作量。
    5. 可以通过配置文件来进行自定义设置，以满足不同项目的依赖管理需求。
    6. 可以按照指定的时间间隔（如每天、每周）自动进行依赖检查和更新，减少了手动更新的工作量。
    7. 可以在更新依赖库之前自动运行测试，以确保在更新后应用程序仍然能够正常运行。
    8. 可以发现应用程序依赖中的漏洞，提供安全更新，从而增强应用程序的安全性。
    9. 会在更新依赖库之前自动创建新的分支，以确保更改不影响主分支，确保最大程度的安全。
    10. 可以为应用程序推荐最佳的依赖版本，以减少应用程序依赖库的版本冲突。
    11. 可以通过设置黑名单和白名单来控制依赖库的更新范围，以满足特定项目的需求。
    12. 可以通过GitLab API来获得项目和用户信息，并根据需要进行相关操作。
    13. 支持Docker镜像，能够在容器化环境中运行，从而进一步简化部署过程。
    14. 是一个持续更新的项目，通过不断迭代和改进来满足开发者的需求。
    15. 具有高度的灵活性和可扩展性，能够适应各种特定项目的需求。
    16. 为开发人员提供了一种简单而强大的解决方案，减少了手动更新依赖库所需要的时间和工作量。
    17. 是开源的，拥有活跃的社区支持，用户可以从其他人的经验中获取灵感和帮助。

## 安装配置

1. 克隆项目

   ```shell
   git clone https://gitlab.com/dependabot-gitlab/dependabot.git
   cd dependabot
   ```

   切换到最后一个标签（可选）

   ```shell
   git checkout -b $(git describe --tags --abbrev=0)
   ```

2. 将 gitlab 网址保存到环境变量：SETTINGS__GITLAB_URL

   ```shell
   # https://dependabot-gitlab.gitlab.io/dependabot/guide/getting-started.html#step-3-start-the-app
   export SETTINGS__GITLAB_URL=https://gitlab.com
   ```

3. 将 gitlab 访问令牌保存到环境变量（可选）：SETTINGS__GITLAB_ACCESS_TOKEN

   ```shell
   # 推荐在环境变量文件中添加，添加完成后刷新环境变量（防止敏感信息储存在历史记录中）
   # https://dependabot-gitlab.gitlab.io/dependabot/guide/getting-started.html#step-3-start-the-app
   export SETTINGS__GITLAB_ACCESS_TOKEN=gitlab_access_token
   ```

4. 将 github 访问令牌保存到环境变量（可选）：SETTINGS__GITHUB_ACCESS_TOKEN

   ```shell
   # 推荐在环境变量文件中添加，添加完成后刷新环境变量（防止敏感信息储存在历史记录中）
   # https://dependabot-gitlab.gitlab.io/dependabot/guide/getting-started.html#step-3-start-the-app
   export SETTINGS__GITHUB_ACCESS_TOKEN=github_access_token
   ```

5. 设置Webhook回调地址（可选，端口未修改时是 3000）：SETTINGS__DEPENDABOT_URL

   ```shell
   # Webhook 文档：https://dependabot-gitlab.gitlab.io/dependabot/config/webhooks.html
   export SETTINGS__DEPENDABOT_URL=http://dependabot-gitlab.example.xuxiaowei.com.cn:3000
   ```

6. 使用 [docker compose](https://docs.docker.com/compose/) 启动应用：

   ```shell
   docker compose up -d
   ```

7. 查看端口（端口未修改时是 3000）并远程访问

   ```shell
   docker ps
   ```

## 使用

1. 在项目根目录上新建文件
   .gitlab/dependabot.yml（默认，可使用环境变量 [SETTINGS__CONFIG_FILENAME](https://dependabot-gitlab.gitlab.io/dependabot/config/environment.html#configuration-file)
   进行修改），以 Maven 为例

   ```shell
   # 版本号
   version: 2
   
   # 仓库
   registries:
       # 自定义仓库名
     rdc-releases:
       # 仓库类型
       type: maven-repository
       # 仓库地址
       url: https://packages.aliyun.com/maven/repository/xxxxxxx-release-xxxxxx/
       # 用户名
           username: 用户名（官方程序可能存在bug，无法使用环境变量，可使用只读账户减小风险）
       # 密码
       password: 密码（官方程序可能存在bug，无法使用环境变量，可使用只读账户减小风险）
     rdc-snapshots:
       type: maven-repository
       url: https://packages.aliyun.com/maven/repository/xxxxxxx-snapshot-xxxxxx/
       username: 用户名（官方程序存在bug，无法使用环境变量，可使用只读账户减小风险）
       password: 密码（官方程序存在bug，无法使用环境变量，可使用只读账户减小风险）
   
   # 扫描更新
   updates:
       # 扫描依赖类型
     - package-ecosystem: maven
       # 扫描依赖目录
           directory: /
       # 默认：5
       # 创建更新依赖未合并的最大PR数量
       open-pull-requests-limit: 200
       # 定时器
       schedule:
           # 频率
         interval: daily
           # 时间，不指定时为随机时间
         time: "04:00"
           # 时区
         timezone: "Asia/Shanghai"
       registries:
           # 使用哪些仓库
         - rdc-releases
         - rdc-snapshots
       # 忽略不更新的依赖信息
       ignore:
           # 忽略的依赖名（Maven 坐标）
         - dependency-name: org.springframework.boot:spring-boot-starter-parent
           # 忽略的版本号
           versions:
               # Spring Boot 3 不支持 JDK 8
               # 大于等于版本号 3 的不升级
             - ">= 3"
         - dependency-name: org.springframework.cloud:spring-cloud-dependencies
           versions:
             - ">= 2022"
         - dependency-name: com.alibaba.cloud:spring-cloud-alibaba-dependencies
           versions:
             - "= 2021.1"
             - ">= 2022"
   ```

2. 远程访问端口（端口未修改时是 3000）
    1. 输入项目相对地址（无域名，如：项目地址为 http://gitlab.example.com/xuxiaowei-com-cn/xuxiaowei-cloud，则填写的项目地址为
       xuxiaowei-com-cn/xuxiaowei-cloud）、Token
        1. 则使用填写的 Token 作为创建 分支、PR 的凭证
    2. 输入项目相对地址（无域名，如：项目地址为 http://gitlab.example.com/xuxiaowei-com-cn/xuxiaowei-cloud，则填写的项目地址为
       xuxiaowei-com-cn/xuxiaowei-cloud）
        1. 则使用配置 dependabot-gitlab 的 Token 作为创建 分支、PR 的凭证
