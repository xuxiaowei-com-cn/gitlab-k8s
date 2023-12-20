# GitLab Maven 仓库

GitLab Maven 私库使用方式

## 文档

1. 软件包库中的 Maven 包
    1. [gitlab-jh 中文文档](https://docs.gitlab.cn/jh/user/packages/maven_repository/)
    2. [gitlab-ee](https://docs.gitlab.com/ee/user/packages/maven_repository/)

## 配置（以Maven为例）

- 示例项目 [my-maven-app](https://framagit.org/xuxiaowei-com-cn/my-maven-app)

1. 身份认证（以下顺序为官方文档的顺序，选择一个适合自己的即可）
    1. 在 Maven 中使用个人访问令牌进行身份验证
        - `settings.xml` 文件中的配置如下
        ```xml
        <settings>
          <servers>
            <server>
              <!-- 固定值 -->
              <id>gitlab-maven</id>
              <configuration>
                <httpHeaders>
                  <property>
                    <!-- 此方式的固定值，不可改 -->
                    <name>Private-Token</name>
                    <!-- 个人令牌，推荐在个人电脑上执行时使用（个人令牌需要 api 权限） -->
                    <value>REPLACE_WITH_YOUR_PERSONAL_ACCESS_TOKEN</value>
                  </property>
                </httpHeaders>
              </configuration>
            </server>
          </servers>
        </settings>
        ```

    2. 在 Maven 中使用部署令牌进行身份验证
        - `settings.xml` 文件中的配置如下
        ```xml
        <settings>
          <servers>
            <server>
              <!-- 固定值 -->
              <id>gitlab-maven</id>
              <configuration>
                <httpHeaders>
                  <property>
                    <!-- 此方式的固定值，不可改 -->
                    <name>Deploy-Token</name>
                    <!-- 部署令牌，推荐在不是 GitLab Runner 流水线时使用 -->
                    <!-- 在项目的仓库设置中可创建部署令牌，需要 read_package_registry、write_package_registry 权限 -->
                    <value>REPLACE_WITH_YOUR_DEPLOY_TOKEN</value>
                  </property>
                </httpHeaders>
              </configuration>
            </server>
          </servers>
        </settings>
        ```

    3. 使用 Maven 中的 CI 作业令牌进行身份验证
        - `settings.xml` 文件中的配置如下
        - 此处使用的是 GitLab Runner 流水线发布 jar 包（其他方式发布时的命令雷同）
        - 示例项目 [my-maven-app](https://framagit.org/xuxiaowei-com-cn/my-maven-app) 中使用自定义 `settings.xml`
          文件名为 `settings-jihulab.xml`，并在其中增加了国内Maven仓库代理，用于加速依赖下载，发布命令
        - 仅发布二进制：`mvn clean -U package deploy -DskipTests -s settings-jihulab.xml`
        - 发布二进制、源码：`mvn clean -U package source:jar deploy -DskipTests -s settings-jihulab.xml`
        - 发布二进制、源码、javadoc：
          `mvn clean -U package source:jar javadoc:jar deploy -DskipTests -s settings-jihulab.xml`
        ```xml
        <settings>
          <servers>
            <server>
              <!-- 固定值 -->
              <id>gitlab-maven</id>
              <configuration>
                <httpHeaders>
                  <property>
                    <!-- 此方式的固定值，不可改 -->
                    <name>Job-Token</name>
                    <!-- 如果你使用的是 GitLab Runner 流水线发布项目，推荐使用此方式 -->
                    <!-- CI_JOB_TOKEN 是 GitLab Runner 流水线的环境变量 -->
                    <value>${CI_JOB_TOKEN}</value>
                  </property>
                </httpHeaders>
              </configuration>
            </server>
          </servers>
        </settings>
        ```

2. 项目级 Maven 端点（发布，仅在 GitLab Runner 流水线发布时可以使用环境变量）
    ```xml
    <distributionManagement>
        <repository>
            <!-- 固定值，与 settings.xml 中的 server id 相同，否则私有仓库无法匹配到秘钥发布 -->
            <id>gitlab-maven</id>
            <!-- 其中数字为项目ID，访问项目地址即可看到 -->
            <!--<url>https://framagit.org/api/v4/projects/103303/packages/maven</url>-->
            <!-- 使用环境变量 CI_PROJECT_ID 替换项目ID -->
            <!-- 使用环境变量 CI_API_V4_URL 替换 GitLab API 接口地址 -->
            <url>${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/packages/maven</url>
        </repository>
        <snapshotRepository>
            <!-- 固定值，与 settings.xml 中的 server id 相同，否则私有仓库无法匹配到秘钥发布 -->
            <id>gitlab-maven</id>
            <!-- 其中数字为项目ID，访问项目地址即可看到 -->
            <!--<url>https://framagit.org/api/v4/projects/103303/packages/maven</url>-->
            <!-- 使用环境变量 CI_PROJECT_ID 替换项目ID -->
            <!-- 使用环境变量 CI_API_V4_URL 替换 GitLab API 接口地址 -->
            <url>${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/packages/maven</url>
        </snapshotRepository>
    </distributionManagement>
    ```

3. 项目级 Maven 端点（使用，不能使用环境变量）
   使用已发布的 Maven jar 包

    ```xml
    
    <repositories>
        <repository>
            <!-- 与 settings.xml 中的 server id 相同，否则私有仓库无法匹配到秘钥发布 -->
            <id>gitlab-maven</id>
            <!-- https://gitlab.example.com：GitLab 实例的域名(IP)，不能使用环境变量 -->
            <!-- PROJECT_ID：项目ID，访问需要使用的 Maven jar 包 仓库地址即可查看到项目ID -->
            <url>https://gitlab.example.com/api/v4/projects/PROJECT_ID/packages/maven</url>
        </repository>
    </repositories>
    ```

4. 发布的Jar包可以在 [软件包库](https://framagit.org/xuxiaowei-com-cn/my-maven-app/-/packages) 中看到
