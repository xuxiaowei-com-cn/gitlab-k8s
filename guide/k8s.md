# kubernetes 是什么？

kubernetes是一个全新的基于容器技术的分布式架构领先方案，是容器云的优秀平台选型方案，已经成为新一代的基于容器技术的 PaaS
平台的重要底层框架，也是云原生技术生态的核心，服务网格、无服务器架构等新一代分布式架构框架及数据纷纷基于 kubernetes 实现。

# kubernetes 的优势

不必再费心与`负载均衡器`的选型和部署问题，不必再考虑引入或开发一个复杂的`服务治理`框架，不必再头疼与`服务监控`和`故障处理`
模块的开发。
使用 kubernetes 提供的解决方案，我们不仅节省了不少于 30% 的开发成本，还可以将经历更加集中于业务本身。
kubernetes 提供了强大的自动化机制，系统后期运维难度和运维成本大幅度降低。

# kubernetes 的特点

kubernetes 是一个开放的开发平台，不局限于任何一种语言，没有限定任何编程接口，所以不论是 Java、Go、C++ 还是 Python
编写的服务，都可以被映射为 kubernetes 的服务，并通过标准的 TCP 通信协议进行交互。
kubernetes 平台对现有的编程语言、编程框架、中间件没有任何侵入性，因此在现有的系统上很容易改造升级并迁移到 kubernetes 平台上。

# kubernetes 的优点

kubernetes 是一个完备的分布式系统支撑平台。
kubernetes
具有完备的集群管理能力，包含多层次的安全防护机制和准入机制、多租户应用平台支撑能力、透明的服务注册和服务发现机制、内建的智能负载均衡器、强大的故障发现和自我修复能力、服务滚动升级和在线扩容能力、可扩展的资源自动调度机制，以及多粒度的自愿配额管理能力。
kubernetes 提供了完备的管理工具，这些工具涵盖了包括开发、部署测试、运维监控在内的各个环节。
kubernetes 是一个全新的基于容器技术的分布式架构解决方案，并且是一个一站式的完备的分布式系统开发和支撑平台。

# kubernetes Service 是分布式架构的核心

1. 拥有唯一指定的名称（比如 mysql-server）
2. 拥有一个虚拟IP（ClusterIP地址）和端口号
3. 能够提供某种远程服务能力
4. 能够将客户端对服务的请求转发一组容器应用上。

一个 Service 通常由多个相关的服务进程提供服务，每个服务进程都有一个独立的 Endpoint（IP+Port）访问点，Kubernetes 能够让我们通过
Service（ClusterIP + Service Port）连接指定的服务。
有了 Kubernetes 内嵌的`负载均衡器`和`故障恢复`机制，不管后端有多少个具体的服务进程，也不管某个服务进程是否由于发生故障而被重新部署到其他机器上，都不影响对服务的正常调用。
Service 一旦创建就不再变化，这就意味着我们不在为 Kubernetes 集群中应用服务进程IP（Pod IP）发生变化而头疼了。