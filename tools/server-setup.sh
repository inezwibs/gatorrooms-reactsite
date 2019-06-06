#!/bin/bash
sudo yum update -y
sudo install wget -y

# Install NodeJS 10
sudo curl -sL https://rpm.nodesource.com/setup_10.x | bash -
sudo yum install -y nodejs

# Update NPM
sudo npm i -g npm

# Install MySQL
# Download and install Repo
wget http://repo.mysql.com/mysql-community-release-el7-5.noarch.rpm
sudo rpm -ivh mysql-community-release-el7-5.noarch.rpm
yum update -y
# Download MySQL Server - ( Root Password - 'team9' )
sudo yum install mysql-server -y
sudo systemctl start mysqld

# For M0 install serve
sudo npm install serve -g
# To Start the app with serve | sudo serve -s build/ -p 80