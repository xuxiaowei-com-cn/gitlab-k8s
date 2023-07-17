# Windows 10 WSL Ubuntu 运行 Docker

## 说明

1. [使用 WSL 在 Windows 上安装 Linux](https://learn.microsoft.com/zh-cn/windows/wsl/install)
2. [旧版 WSL 的手动安装步骤](https://learn.microsoft.com/zh-cn/windows/wsl/install-manual)
3. [Ubuntu安装docker](https://docs.docker.com/engine/install/ubuntu/)

## 配置

1. Windows 10 版本 2004 及更高版本（内部版本 19041 及更高版本）、Windows 11 安装 WSL

   ```shell
   wsl --install
   
   # 更新
   # wsl --update
   ```

2. 访问已安装的 Ubuntu，首次打开时，启动较慢，需要创建用户即密码。如果安装 WSL 时自动安装的 Ubuntu 存在问题，请自行在 Windows
   10 应用商店下载 Ubuntu 22.04.02。

3. 在 Ubuntu 中安装 docker

   ```shell
   # 卸载旧 docker
   for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do sudo apt-get remove $pkg; done
   ```

   ```shell
   # 安装新 docker
   
   # 一行一行的执行下面的命令
   # 一行一行的执行下面的命令
   # 一行一行的执行下面的命令
   
   sudo apt-get update
   sudo apt-get install -y ca-certificates curl gnupg
   
   sudo install -m 0755 -d /etc/apt/keyrings
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
   sudo chmod a+r /etc/apt/keyrings/docker.gpg
   
   echo \
     "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
     "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
     sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   
   sudo apt-get update
   sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
   ```

4. 创建 nginx 测试

   ```shell
   sudo docker run \
     --restart=always \
     -itd \
     --privileged=true \
     -p 20080:80 -p 20443:443 \
     -v /etc/localtime:/etc/localtime \
     --name nginx-1.25.0 nginx:1.25.0
   ```

5. 需要保持Ubuntu命令窗口开启，docker 才能使用（关闭命令窗口后，Ubuntu也会关闭）
6. 推荐使用 Windows 10 应用商店中的 Windows Terminal 作为命令行工具。
