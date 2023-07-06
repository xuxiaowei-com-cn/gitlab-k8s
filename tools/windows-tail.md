# 小工具：Windows tail.exe

1. 文件：<a href="tools/static/tail.exe">tail.exe</a>，文件来源于网络，用于 **实时查看文件内容**，**与 Linux 的 tail
   有相同的用法**。

2. 下载上述文件，解压，将 tail.exe 放入 C:\Windows 或 C:\Windows\System32 或 C:\Windows\SysWOW64 文件夹

3. 直接运行

    ```shell
    Microsoft Windows [版本 10.0.19045.2728]
    (c) Microsoft Corporation。保留所有权利。
    
    C:\Users\xuxiaowei>tail -f D:\logs\gateway\gateway.log
    -2023-03-16 09:13:05.219 - INFO 7680 --- [main] trationDelegate$BeanPostProcessorChecker :  :  :  :  :  : Bean 'org.springframework.cloud.client.loadbalancer.reactive.LoadBalancerBeanPostProcessorAutoConfiguration' of type [org.springframework.cloud.client.loadbalancer.reactive.LoadBalancerBeanPostProcessorAutoConfiguration] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying)
    -2023-03-16 09:13:05.222 - INFO 7680 --- [main] trationDelegate$BeanPostProcessorChecker :  :  :  :  :  : Bean 'org.springframework.cloud.client.loadbalancer.reactive.LoadBalancerBeanPostProcessorAutoConfiguration$ReactorDeferringLoadBalancerFilterConfig' of type [org.springframework.cloud.client.loadbalancer.reactive.LoadBalancerBeanPostProcessorAutoConfiguration$ReactorDeferringLoadBalancerFilterConfig] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying)
    -2023-03-16 09:13:05.225 - INFO 7680 --- [main] trationDelegate$BeanPostProcessorChecker :  :  :  :  :  : Bean 'reactorDeferringLoadBalancerExchangeFilterFunction' of type [org.springframework.cloud.client.loadbalancer.reactive.DeferringLoadBalancerExchangeFilterFunction] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying)
    -2023-03-16 09:13:05.542 - INFO 7680 --- [main] com.zaxxer.hikari.HikariDataSource       :  :  :  :  :  : master - Starting...
    -2023-03-16 09:13:05.758 - INFO 7680 --- [main] com.zaxxer.hikari.HikariDataSource       :  :  :  :  :  : master - Start completed.
    -2023-03-16 09:13:05.761 - INFO 7680 --- [main] com.zaxxer.hikari.HikariDataSource       :  :  :  :  :  : log - Starting...
    -2023-03-16 09:13:05.767 - INFO 7680 --- [main] com.zaxxer.hikari.HikariDataSource       :  :  :  :  :  : log - Start completed.
    -2023-03-16 09:13:05.767 - INFO 7680 --- [main] c.b.d.d.DynamicRoutingDataSource         :  :  :  :  :  : dynamic-datasource - add a datasource named [log] success
    -2023-03-16 09:13:05.767 - INFO 7680 --- [main] c.b.d.d.DynamicRoutingDataSource         :  :  :  :  :  : dynamic-datasource - add a datasource named [master] success
    -2023-03-16 09:13:05.767 - INFO 7680 --- [main] c.b.d.d.DynamicRoutingDataSource         :  :  :  :  :  : dynamic-datasource initial loaded [2] datasource,primary datasource named [master]
    -2023-03-16 09:13:09.542 - INFO 7680 --- [boundedElastic-1] com.alibaba.nacos.common.remote.client   :  :  :  :  :  : [RpcClientFactory] create a new rpc client of 4daa126d-28ed-4273-bf18-dc3a7656f702
    -2023-03-16 09:13:09.542 - INFO 7680 --- [boundedElastic-1] com.alibaba.nacos.common.remote.client   :  :  :  :  :  : [4daa126d-28ed-4273-bf18-dc3a7656f702] RpcClient init label, labels = {module=naming, source=sdk}
    -2023-03-16 09:13:09.545 - INFO 7680 --- [boundedElastic-1] com.alibaba.nacos.common.remote.client   :  :  :  :  :  : [4daa126d-28ed-4273-bf18-dc3a7656f702] RpcClient init, ServerListFactory = com.alibaba.nacos.client.naming.core.ServerListManager
    -2023-03-16 09:13:09.545 - INFO 7680 --- [boundedElastic-1] com.alibaba.nacos.common.remote.client   :  :  :  :  :  : [4daa126d-28ed-4273-bf18-dc3a7656f702] Registry connection listener to current client:com.alibaba.nacos.client.naming.remote.gprc.redo.NamingGrpcRedoService
    -2023-03-16 09:13:09.546 - INFO 7680 --- [boundedElastic-1] com.alibaba.nacos.common.remote.client   :  :  :  :  :  : [4daa126d-28ed-4273-bf18-dc3a7656f702] Register server push request handler:com.alibaba.nacos.client.naming.remote.gprc.NamingPushRequestHandler
    -2023-03-16 09:13:09.547 - INFO 7680 --- [boundedElastic-1] com.alibaba.nacos.common.remote.client   :  :  :  :  :  : [4daa126d-28ed-4273-bf18-dc3a7656f702] Try to connect to server on start up, server: {serverIp = 'nacos.example.xuxiaowei.cloud', server main port = 8848}
    -2023-03-16 09:13:09.672 - INFO 7680 --- [boundedElastic-1] com.alibaba.nacos.common.remote.client   :  :  :  :  :  : [4daa126d-28ed-4273-bf18-dc3a7656f702] Success to connect to server [nacos.example.xuxiaowei.cloud:8848] on start up, connectionId = 1678929189553_127.0.0.1_49561
    -2023-03-16 09:13:09.672 - INFO 7680 --- [boundedElastic-1] com.alibaba.nacos.common.remote.client   :  :  :  :  :  : [4daa126d-28ed-4273-bf18-dc3a7656f702] Register server push request handler:com.alibaba.nacos.common.remote.client.RpcClient$ConnectResetRequestHandler
    -2023-03-16 09:13:09.672 - INFO 7680 --- [com.alibaba.nacos.client.remote.worker] com.alibaba.nacos.common.remote.client   :  :  :  :  :  : [4daa126d-28ed-4273-bf18-dc3a7656f702] Notify connected event to listeners.
    -2023-03-16 09:13:09.672 - INFO 7680 --- [boundedElastic-1] com.alibaba.nacos.common.remote.client   :  :  :  :  :  : [4daa126d-28ed-4273-bf18-dc3a7656f702] Register server push request handler:com.alibaba.nacos.common.remote.client.RpcClient$$Lambda$342/513241240
    -2023-03-16 09:13:10.241 - INFO 7680 --- [main] c.a.c.s.g.s.SentinelSCGAutoConfiguration :  :  :  :  :  : [Sentinel SpringCloudGateway] register SentinelGatewayFilter with order: -2147483648
    -2023-03-16 09:13:10.416 - INFO 7680 --- [main] o.s.c.g.r.RouteDefinitionRouteLocator    :  :  :  :  :  : Loaded RoutePredicateFactory [After]
    -2023-03-16 09:13:10.416 - INFO 7680 --- [main] o.s.c.g.r.RouteDefinitionRouteLocator    :  :  :  :  :  : Loaded RoutePredicateFactory [Before]
    -2023-03-16 09:13:10.416 - INFO 7680 --- [main] o.s.c.g.r.RouteDefinitionRouteLocator    :  :  :  :  :  : Loaded RoutePredicateFactory [Between]
    -2023-03-16 09:13:10.416 - INFO 7680 --- [main] o.s.c.g.r.RouteDefinitionRouteLocator    :  :  :  :  :  : Loaded RoutePredicateFactory [Cookie]
    -2023-03-16 09:13:10.416 - INFO 7680 --- [main] o.s.c.g.r.RouteDefinitionRouteLocator    :  :  :  :  :  : Loaded RoutePredicateFactory [Header]
    -2023-03-16 09:13:10.416 - INFO 7680 --- [main] o.s.c.g.r.RouteDefinitionRouteLocator    :  :  :  :  :  : Loaded RoutePredicateFactory [Host]
    -2023-03-16 09:13:10.416 - INFO 7680 --- [main] o.s.c.g.r.RouteDefinitionRouteLocator    :  :  :  :  :  : Loaded RoutePredicateFactory [Method]
    -2023-03-16 09:13:10.416 - INFO 7680 --- [main] o.s.c.g.r.RouteDefinitionRouteLocator    :  :  :  :  :  : Loaded RoutePredicateFactory [Path]
    -2023-03-16 09:13:10.416 - INFO 7680 --- [main] o.s.c.g.r.RouteDefinitionRouteLocator    :  :  :  :  :  : Loaded RoutePredicateFactory [Query]
    -2023-03-16 09:13:10.416 - INFO 7680 --- [main] o.s.c.g.r.RouteDefinitionRouteLocator    :  :  :  :  :  : Loaded RoutePredicateFactory [ReadBody]
    -2023-03-16 09:13:10.416 - INFO 7680 --- [main] o.s.c.g.r.RouteDefinitionRouteLocator    :  :  :  :  :  : Loaded RoutePredicateFactory [RemoteAddr]
    -2023-03-16 09:13:10.416 - INFO 7680 --- [main] o.s.c.g.r.RouteDefinitionRouteLocator    :  :  :  :  :  : Loaded RoutePredicateFactory [XForwardedRemoteAddr]
    -2023-03-16 09:13:10.416 - INFO 7680 --- [main] o.s.c.g.r.RouteDefinitionRouteLocator    :  :  :  :  :  : Loaded RoutePredicateFactory [Weight]
    -2023-03-16 09:13:10.416 - INFO 7680 --- [main] o.s.c.g.r.RouteDefinitionRouteLocator    :  :  :  :  :  : Loaded RoutePredicateFactory [CloudFoundryRouteService]
    -2023-03-16 09:13:10.576 -DEBUG 7680 --- [main] s.w.r.r.m.a.RequestMappingHandlerMapping :  :  :  :  :  : 4 mappings in 'requestMappingHandlerMapping'
    -2023-03-16 09:13:10.980 -DEBUG 7680 --- [main] o.s.w.r.handler.SimpleUrlHandlerMapping  :  :  :  :  :  : Patterns [/webjars/**, /**] in 'resourceHandlerMapping'
    -2023-03-16 09:13:11.320 - INFO 7680 --- [main] o.s.b.a.e.web.EndpointLinksResolver      :  :  :  :  :  : Exposing 21 endpoint(s) beneath base path '/actuator'
    -2023-03-16 09:13:11.380 -DEBUG 7680 --- [main] o.s.w.r.r.m.a.ControllerMethodResolver   :  :  :  :  :  : ControllerAdvice beans: 0 @ModelAttribute, 0 @InitBinder, 1 @ExceptionHandler
    -2023-03-16 09:13:11.405 - INFO 7680 --- [main] c.a.c.s.g.s.SentinelSCGAutoConfiguration :  :  :  :  :  : [Sentinel SpringCloudGateway] register SentinelGatewayBlockExceptionHandler
    -2023-03-16 09:13:11.412 -DEBUG 7680 --- [main] o.s.w.s.adapter.HttpWebHandlerAdapter    :  :  :  :  :  : enableLoggingRequestDetails='false': form data and headers will be masked to prevent unsafe logging of potentially sensitive data
    -2023-03-16 09:13:12.241 - WARN 7680 --- [main] iguration$LoadBalancerCaffeineWarnLogger :  :  :  :  :  : Spring Cloud LoadBalancer is currently working with the default cache. While this cache implementation is useful for development and tests, it's recommended to use Caffeine cache in production.You can switch to using Caffeine cache, by adding it and org.springframework.cache.caffeine.CaffeineCacheManager to the classpath.
    -2023-03-16 09:13:12.661 - INFO 7680 --- [main] o.s.b.web.embedded.netty.NettyWebServer  :  :  :  :  :  : Netty started on port 1101
    -2023-03-16 09:13:13.165 - INFO 7680 --- [main] c.a.c.n.registry.NacosServiceRegistry    :  :  :  :  :  : nacos registry, DEFAULT_GROUP gateway 192.168.1.101:1101 register finished
    -2023-03-16 09:13:13.254 - INFO 7680 --- [nacos-grpc-client-executor-23] com.alibaba.nacos.common.remote.client   :  :  :  :  :  : [4daa126d-28ed-4273-bf18-dc3a7656f702] Receive server push request, request = NotifySubscriberRequest, requestId = 1
    -2023-03-16 09:13:13.255 - INFO 7680 --- [nacos-grpc-client-executor-23] com.alibaba.nacos.common.remote.client   :  :  :  :  :  : [4daa126d-28ed-4273-bf18-dc3a7656f702] Ack server push request, request = NotifySubscriberRequest, requestId = 1
    -2023-03-16 09:13:13.270 - INFO 7680 --- [main] c.xuxiaowei.gateway.GatewayApplication   :  :  :  :  :  : Started GatewayApplication in 16.022 seconds (JVM running for 18.536)
    -2023-03-16 09:13:13.289 - INFO 7680 --- [main] c.a.c.n.refresh.NacosContextRefresher    :  :  :  :  :  : [Nacos Config] Listening config: dataId=xuxiaowei.yml, group=DEFAULT_GROUP
    -2023-03-16 09:13:13.291 - INFO 7680 --- [main] c.a.c.n.refresh.NacosContextRefresher    :  :  :  :  :  : [Nacos Config] Listening config: dataId=gateway.yml, group=DEFAULT_GROUP
    -2023-03-16 09:13:13.292 - INFO 7680 --- [main] c.a.c.n.refresh.NacosContextRefresher    :  :  :  :  :  : [Nacos Config] Listening config: dataId=gateway, group=DEFAULT_GROUP
    -2023-03-16 09:13:13.293 - INFO 7680 --- [main] c.a.c.n.refresh.NacosContextRefresher    :  :  :  :  :  : [Nacos Config] Listening config: dataId=gateway-dev.yml, group=DEFAULT_GROUP
    -2023-03-16 09:13:13.695 - INFO 7680 --- [nacos-grpc-client-executor-30] com.alibaba.nacos.common.remote.client   :  :  :  :  :  : [4daa126d-28ed-4273-bf18-dc3a7656f702] Receive server push request, request = NotifySubscriberRequest, requestId = 2
    -2023-03-16 09:13:13.696 - INFO 7680 --- [nacos-grpc-client-executor-30] com.alibaba.nacos.common.remote.client   :  :  :  :  :  : [4daa126d-28ed-4273-bf18-dc3a7656f702] Ack server push request, request = NotifySubscriberRequest, requestId = 2
    -
    ```
