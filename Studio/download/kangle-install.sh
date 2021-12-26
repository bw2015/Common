user=kangle
if [ -d /vhs/kangle ]; then
  echo 您已经安装了kangle server
  exit
fi

# 安装依赖包
yum -y install wget make automake gcc gcc-c++ pcre-devel zlib-devel sqlite-devel openssl-devel lrzsz lftp

if [ ! -d /vhs/ ]; then
  mkdir /vhs/
fi

cd /vhs/
wget https://raw.githubusercontent.com/bw2015/WebTools/main/Studio/download/kangle-3.5.21.4.zip
unzip kangle-3.5.21.4.zip
rm -rf kangle-3.5.21.4.zip

# 创建子账户
id $user >& /dev/null
if [ $? -ne 0 ]
then
  useradd -s /sbin/nologin kangle
fi

chown kangle:kangle -R /vhs/kangle/
chown root:root /vhs/kangle/
chmod 755 /vhs/kangle
sudo -u kangle /vhs/kangle/bin/kangle

# 添加启动脚本
echo \#\!/bin/sh > /etc/rc.d/init.d/kangle-start.sh
echo \#chkconfig: 2345 80 90 >> /etc/rc.d/init.d/kangle-start.sh
echo sudo -u kangle /vhs/kangle/bin/kangle >> /etc/rc.d/init.d/kangle-start.sh
chmod +x /etc/rc.d/init.d/kangle-start.sh
chkconfig --add /etc/rc.d/init.d/kangle-start.sh
chkconfig kangle-start.sh on

echo 您已经成功安装kangle，正在监听端口 44333