#! /bin/bash
WORK_PATH='/usr/projects/vue-front'
cd $WORK_PATH
echo "清除老代码"
git reset --hard origin/master
git clean -f
echo "拉取最新代码"
git pull origin master
echo "开始编译"
npm run build 
echo "开始执行构建"
docker build -t vue-front:1.0 .
echo "停止久容器并删除旧容器"
docker stop vue-back-container
docker rm vue-back-container
echo "启动新容器"
docker container run -p 80:80 --name  vue-back-container -d vue-front:1.0
