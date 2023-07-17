---
sidebar_position: 3
---

# 使用 Maven 私库

## 配置

1. Nexus 默认仓库有 4 个 Maven 仓库：

   ![image.png](static/use-maven-repository-01.png)

2. 查看代理仓库：

   ![image.png](static/use-maven-repository-02.png)

3. 查看分组仓库：

   ![image.png](static/use-maven-repository-03.png)

4. 查看分组仓库内的依赖：

   ![image.png](static/use-maven-repository-04.png)

   ![image.png](static/use-maven-repository-05.png)

5. 复制仓库地址：

   ![image.png](static/use-maven-repository-06.png)

6. 访问 [https://start.spring.io](https://start.spring.io) 创建一个项目：

   ![image.png](static/use-maven-repository-07.png)

   ![image.png](static/use-maven-repository-08.png)

7. 下载后修改项目仓库配置并下载依赖：

    1. 解压：

       ![image.png](static/use-maven-repository-09.png)
    2. 添加仓库：

       ![image.png](static/use-maven-repository-10.png)

       也可以在 Maven 的 Setting.xml 文件中修改：
       分组仓库中包含代理仓库的地址有 [https://repo1.maven.org/maven2/](https://repo1.maven.org/maven2/) ，而该代理仓库的名称为
       central，故在此配置 mirrorOf 为
       central，其他仓库地址及名称参见 [阿里云云效 Maven](https://developer.aliyun.com/mvn/guide)

       ![image.png](static/use-maven-repository-11.png)

    3. 运行 mvn clean package（需要电脑支持 mvn 命令），或者运行 mvnw clean package（需要电脑配置好环境变量 JAVA_HOME）

       ![image.png](static/use-maven-repository-12.png)

    4. 下载依赖的过程

       ![image.png](static/use-maven-repository-13.png)

    5. 已下载的依赖

       ![image.png](static/use-maven-repository-14.png)

8. 上述内容为Nexus默认Maven仓库，如满足不了配置或想自定义，请参考原有仓库的配置及阿里云
   [阿里云云效 Maven](https://developer.aliyun.com/mvn/guide) 中的链接：

   ![image.png](static/use-maven-repository-15.png)

   或者参考腾讯云 [使用腾讯云镜像源加速maven](https://mirrors.cloud.tencent.com/help/maven.html)

   ![image.png](static/use-maven-repository-16.png)
