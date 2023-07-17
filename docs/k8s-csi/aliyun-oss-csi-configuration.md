---
sidebar_position: 2
---

# 阿里云 Kubernetes OSS CSI 插件（未完成）

阿里云 Kubernetes OSS CSI 插件（未完成）

## 文档

1. alibaba-cloud-csi-driver 仓库
    1. [GitHub](https://github.com/kubernetes-sigs/alibaba-cloud-csi-driver)
    2. [GitCode 加速镜像](https://gitcode.net/mirrors/kubernetes-sigs/alibaba-cloud-csi-driver)
2. alibaba-cloud-csi-driver 中文介绍
    1. [GitHub](https://github.com/kubernetes-sigs/alibaba-cloud-csi-driver/blob/master/README-zh_CN.md)
    2. [GitCode 加速镜像](https://gitcode.net/mirrors/kubernetes-sigs/alibaba-cloud-csi-driver/-/blob/master/README-zh_CN.md)
    3. 阿里云CSI插件实现了在Kubernetes中对阿里云云存储卷的生命周期管理，支持动态创建、挂载、使用云数据卷。
    4. 当前的CSI实现基于K8S 1.14以上的版本
3. OSS CSI 插件支持为应用负载挂载阿里云 OSS Bucket，目前不支持动态创建 OSS Bucket。OSS
   存储是一种共享存储，可以同时被多个应用负载使用(ReadWriteMany)
4. 不支持动态创建OSS Bucket（2023-06-26）
5. OSS存储是一种共享存储，可以同时被多个应用负载使用(ReadWriteMany)
6. OSS CSI 插件更多详细说明
    1. [GitHub](https://github.com/kubernetes-sigs/alibaba-cloud-csi-driver/blob/master/docs/oss.md)
    2. [GitCode 加速镜像](https://gitcode.net/mirrors/kubernetes-sigs/alibaba-cloud-csi-driver/-/blob/master/docs/oss.md)
7. [使用OSS静态存储卷](https://www.alibabacloud.com/help/zh/container-service-for-kubernetes/latest/mount-a-statically-provisioned-oss-volume-1)

## 说明

1. k8s 版本：1.26.2
2. alibaba-cloud-csi-driver 版本 1.2.0

## 配置

1. 创建 CSI 插件

   ```shell
   ALIBABA_CLOUD_CSI_DRIVER_VERSION=1.2.0
   
   curl -LO https://gitcode.net/mirrors/kubernetes-sigs/alibaba-cloud-csi-driver/-/raw/v$ALIBABA_CLOUD_CSI_DRIVER_VERSION/deploy/nonecs/csi-driver.yaml
   curl -LO https://gitcode.net/mirrors/kubernetes-sigs/alibaba-cloud-csi-driver/-/raw/v$ALIBABA_CLOUD_CSI_DRIVER_VERSION/deploy/nonecs/csi-plugin.yaml
   curl -LO https://gitcode.net/mirrors/kubernetes-sigs/alibaba-cloud-csi-driver/-/raw/v$ALIBABA_CLOUD_CSI_DRIVER_VERSION/deploy/nonecs/csi-provisioner.yaml
   curl -LO https://gitcode.net/mirrors/kubernetes-sigs/alibaba-cloud-csi-driver/-/raw/v$ALIBABA_CLOUD_CSI_DRIVER_VERSION/deploy/nonecs/rbac.yaml
   
   kubectl apply -f csi-driver.yaml
   kubectl apply -f csi-plugin.yaml
   kubectl apply -f csi-provisioner.yaml
   kubectl apply -f rbac.yaml
   
   # 注意：插件日志样式可以通过环境变量：LOG_TYPE来配置。
   # "host"：日志将被打印到保存到host（/var/log/alicloud/ossplugin.csi.alibabacloud.com.log）;
   # "stdout"：日志将被打印到stdout，可以通过docker logs或kubectl logs打印。
   # "both"：默认选项，日志将同时打印到标准输出和主机文件。
   ```

2. 阿里云 OSS 对象储存凭证

   ```shell
   vim /etc/profile
   ```

   ```shell
   OSS_AK_ID=xxx
   OSS_AK_SECRET=xxx
   OSS_BUCKET=xxx
   OSS_URL=oss-cn-hangzhou.aliyuncs.com
   ```

   ```shell
   source /etc/profile
   echo $OSS_AK_ID
   echo $OSS_AK_SECRET
   echo $OSS_BUCKET
   echo $OSS_URL
   ```

3. 创建 Secret

   ```shell
   cat > pv-accesskey.yaml << EOF
   apiVersion: v1
   kind: Secret
   metadata:
     name: oss-secret
     namespace: default
   stringData:
     akId: "$OSS_AK_ID"
     akSecret: "$OSS_AK_SECRET"
   
   EOF
   
   cat pv-accesskey.yaml
   
   kubectl apply -f pv-accesskey.yaml
   
   kubectl get secret
   ```

4. 创建 PV

   ```shell
   # ALIBABA_CLOUD_CSI_DRIVER_VERSION=1.2.0
   # curl -LO https://gitcode.net/mirrors/kubernetes-sigs/alibaba-cloud-csi-driver/-/raw/v$ALIBABA_CLOUD_CSI_DRIVER_VERSION/examples/oss/pv.yaml
   
   cat > pv-oss.yaml << EOF
   apiVersion: v1
   kind: PersistentVolume
   metadata:
     name: pv-oss
     labels:
       alicloud-pvname: pv-oss
   spec:
     capacity:
       storage: 5Gi
     accessModes:
       - ReadWriteMany
     persistentVolumeReclaimPolicy: Retain
     csi:
       driver: ossplugin.csi.alibabacloud.com
       volumeHandle: pv-oss # 需要和PV名字一致。
       nodePublishSecretRef:
         name: oss-secret
         namespace: default
       volumeAttributes:
         bucket: "$OSS_BUCKET"
         url: "$OSS_URL"
         otherOpts: "-o max_stat_cache_size=0 -o allow_other"
         path: "/"
   
   EOF
   
   cat pv-oss.yaml
   
   kubectl apply -f pv-oss.yaml
   
   kubectl get pv
   ```

5. 创建 PVC

   ```shell
   # ALIBABA_CLOUD_CSI_DRIVER_VERSION=1.2.0
   # curl -LO https://gitcode.net/mirrors/kubernetes-sigs/alibaba-cloud-csi-driver/-/raw/v$ALIBABA_CLOUD_CSI_DRIVER_VERSION/examples/oss/pvc.yaml
   
   cat > pvc-oss.yaml << EOF
   apiVersion: v1
   kind: PersistentVolumeClaim
   metadata:
     name: pvc-oss
   spec:
     accessModes:
       - ReadWriteMany
     resources:
       requests:
         storage: 5Gi
     selector:
       matchLabels:
         alicloud-pvname: pv-oss
   
   EOF
   
   cat pvc-oss.yaml
   
   kubectl apply -f pvc-oss.yaml
   
   kubectl get pvc
   ```

6. 创建应用，测试 PV、PVC

   ```shell
   cat > oss-static.yaml << EOF
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: oss-static
     labels:
       app: nginx
   spec:
     replicas: 1
     selector:
       matchLabels:
         app: nginx
     template:
       metadata:
         labels:
           app: nginx
       spec:
         containers:
         - name: nginx
           image: nginx
           ports:
           - containerPort: 80
           volumeMounts:
             - name: pvc-oss
               mountPath: "/data"
             - name: pvc-oss
               mountPath: "/data1"
           livenessProbe:
             exec:
               command:
               - sh
               - -c
               - cd /data
             initialDelaySeconds: 30
             periodSeconds: 30
         volumes:
           - name: pvc-oss
             persistentVolumeClaim:
               claimName: pvc-oss
   
   EOF
   
   cat oss-static.yaml
   
   kubectl apply -f oss-static.yaml
   
   kubectl get pod -w
   ```

7. 使用 alibaba-cloud-csi-driver 1.2.0出现错误

   ```shell
   [root@k8s ~]# 
   [root@k8s ~]# kubectl describe pod oss-static-75fcb4c56d-dsch7 
   Name:             oss-static-75fcb4c56d-dsch7
   Namespace:        default
   Priority:         0
   Service Account:  default
   Node:             k8s/192.168.80.5
   Start Time:       Mon, 26 Jun 2023 20:53:35 +0800
   Labels:           app=nginx
                     pod-template-hash=75fcb4c56d
   Annotations:      <none>
   Status:           Pending
   IP:               
   IPs:              <none>
   Controlled By:    ReplicaSet/oss-static-75fcb4c56d
   Containers:
     nginx:
       Container ID:   
       Image:          nginx
       Image ID:       
       Port:           80/TCP
       Host Port:      0/TCP
       State:          Waiting
         Reason:       ContainerCreating
       Ready:          False
       Restart Count:  0
       Liveness:       exec [sh -c cd /data] delay=30s timeout=1s period=30s #success=1 #failure=3
       Environment:    <none>
       Mounts:
         /data from pvc-oss (rw)
         /data1 from pvc-oss (rw)
         /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-rjgpf (ro)
   Conditions:
     Type              Status
     Initialized       True 
     Ready             False 
     ContainersReady   False 
     PodScheduled      True 
   Volumes:
     pvc-oss:
       Type:       PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)
       ClaimName:  pvc-oss
       ReadOnly:   false
     kube-api-access-rjgpf:
       Type:                    Projected (a volume that contains injected data from multiple sources)
       TokenExpirationSeconds:  3607
       ConfigMapName:           kube-root-ca.crt
       ConfigMapOptional:       <nil>
       DownwardAPI:             true
   QoS Class:                   BestEffort
   Node-Selectors:              <none>
   Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                                node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
   Events:
     Type     Reason       Age   From               Message
     ----     ------       ----  ----               -------
     Normal   Scheduled    16m   default-scheduler  Successfully assigned default/oss-static-75fcb4c56d-dsch7 to k8s
     Warning  FailedMount  13m   kubelet            MountVolume.SetUp failed for volume "pv-oss" : rpc error: code = Unknown desc = Mount is failed in host, mntCmd:systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , err: Exec command error:Fail: systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , error: Failed to run cmd: systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , with out: Running scope as unit run-15559.scope.
   , with error: exit status 1, out: Fail: systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , error: Failed to run cmd: systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , with out: Running scope as unit run-15559.scope.
   , with error: exit status 1
     Warning  FailedMount  11m  kubelet  MountVolume.SetUp failed for volume "pv-oss" : rpc error: code = Unknown desc = Mount is failed in host, mntCmd:systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , err: Exec command error:Fail: systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , error: Failed to run cmd: systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , with out: Running scope as unit run-16934.scope.
   , with error: exit status 1, out: Fail: systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , error: Failed to run cmd: systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , with out: Running scope as unit run-16934.scope.
   , with error: exit status 1
     Warning  FailedMount  9m  kubelet  MountVolume.SetUp failed for volume "pv-oss" : rpc error: code = Unknown desc = Mount is failed in host, mntCmd:systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , err: Exec command error:Fail: systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , error: Failed to run cmd: systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , with out: Running scope as unit run-18397.scope.
   , with error: exit status 1, out: Fail: systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , error: Failed to run cmd: systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , with out: Running scope as unit run-18397.scope.
   , with error: exit status 1
     Warning  FailedMount  6m46s  kubelet  MountVolume.SetUp failed for volume "pv-oss" : rpc error: code = Unknown desc = Mount is failed in host, mntCmd:systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , err: Exec command error:Fail: systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , error: Failed to run cmd: systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , with out: Running scope as unit run-19847.scope.
   , with error: exit status 1, out: Fail: systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , error: Failed to run cmd: systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , with out: Running scope as unit run-19847.scope.
   , with error: exit status 1
     Warning  FailedMount  4m32s  kubelet  MountVolume.SetUp failed for volume "pv-oss" : rpc error: code = Unknown desc = Mount is failed in host, mntCmd:systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , err: Exec command error:Fail: systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , error: Failed to run cmd: systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , with out: Running scope as unit run-21332.scope.
   , with error: exit status 1, out: Fail: systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , error: Failed to run cmd: systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , with out: Running scope as unit run-21332.scope.
   , with error: exit status 1
     Warning  FailedMount  2m17s  kubelet  MountVolume.SetUp failed for volume "pv-oss" : rpc error: code = Unknown desc = Mount is failed in host, mntCmd:systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , err: Exec command error:Fail: systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , error: Failed to run cmd: systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , with out: Running scope as unit run-22753.scope.
   , with error: exit status 1, out: Fail: systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , error: Failed to run cmd: systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , with out: Running scope as unit run-22753.scope.
   , with error: exit status 1
     Warning  FailedMount  27s (x7 over 14m)  kubelet  Unable to attach or mount volumes: unmounted volumes=[pvc-oss], unattached volumes=[], failed to process volumes=[]: timed out waiting for the condition
     Warning  FailedMount  3s                 kubelet  MountVolume.SetUp failed for volume "pv-oss" : rpc error: code = Unknown desc = Mount is failed in host, mntCmd:systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , err: Exec command error:Fail: systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , error: Failed to run cmd: systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , with out: Running scope as unit run-24243.scope.
   , with error: exit status 1, out: Fail: systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , error: Failed to run cmd: systemd-run --scope -- /usr/local/bin/ossfs xuxiaowei-cloud:/ /var/lib/kubelet/pods/74ebb01e-f21c-4de1-aa92-10f127d42dd6/volumes/kubernetes.io~csi/pv-oss/mount -ourl=-internalo-internals-internals-internal--internalc-internaln-internal--internalq-internali-internaln-internalg-internald-internala-internalo-internal.-internala-internall-internali-internaly-internalu-internaln-internalc-internals-internal.-internalc-internalo-internalm-internal -o max_stat_cache_size=0 -o allow_other , with out: Running scope as unit run-24243.scope.
   , with error: exit status 1
   [root@k8s ~]# 
   ```

8. 使用 alibaba-cloud-csi-driver 1.1.7 出现错误

   ```shell
   [root@k8s ~]# kubectl describe pod oss-static-75fcb4c56d-6htjx 
   Name:             oss-static-75fcb4c56d-6htjx
   Namespace:        default
   Priority:         0
   Service Account:  default
   Node:             k8s/192.168.80.5
   Start Time:       Mon, 26 Jun 2023 21:21:28 +0800
   Labels:           app=nginx
                     pod-template-hash=75fcb4c56d
   Annotations:      <none>
   Status:           Pending
   IP:               
   IPs:              <none>
   Controlled By:    ReplicaSet/oss-static-75fcb4c56d
   Containers:
     nginx:
       Container ID:   
       Image:          nginx
       Image ID:       
       Port:           80/TCP
       Host Port:      0/TCP
       State:          Waiting
         Reason:       ContainerCreating
       Ready:          False
       Restart Count:  0
       Liveness:       exec [sh -c cd /data] delay=30s timeout=1s period=30s #success=1 #failure=3
       Environment:    <none>
       Mounts:
         /data from pvc-oss (rw)
         /data1 from pvc-oss (rw)
         /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-zb2pd (ro)
   Conditions:
     Type              Status
     Initialized       True 
     Ready             False 
     ContainersReady   False 
     PodScheduled      True 
   Volumes:
     pvc-oss:
       Type:       PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)
       ClaimName:  pvc-oss
       ReadOnly:   false
     kube-api-access-zb2pd:
       Type:                    Projected (a volume that contains injected data from multiple sources)
       TokenExpirationSeconds:  3607
       ConfigMapName:           kube-root-ca.crt
       ConfigMapOptional:       <nil>
       DownwardAPI:             true
   QoS Class:                   BestEffort
   Node-Selectors:              <none>
   Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                                node.kubernetes.io/unreachable:NoExecute op=Exists for 300s
   Events:
     Type     Reason       Age                   From               Message
     ----     ------       ----                  ----               -------
     Normal   Scheduled    3m58s                 default-scheduler  Successfully assigned default/oss-static-75fcb4c56d-6htjx to k8s
     Warning  FailedMount  116s                  kubelet            Unable to attach or mount volumes: unmounted volumes=[pvc-oss], unattached volumes=[], failed to process volumes=[]: timed out waiting for the condition
     Warning  FailedMount  111s (x9 over 3m58s)  kubelet            MountVolume.MountDevice failed for volume "pv-oss" : kubernetes.io/csi: attacher.MountDevice failed to create newCsiDriverClient: driver name ossplugin.csi.alibabacloud.com not found in the list of registered CSI drivers
   [root@k8s ~]# 
   ```

9. 

