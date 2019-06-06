### Run the server-setup.sh first

---

#### Execute the following command to configure root user
##### sudo mysql_secure_installation 
---
    Answer the following Questions:
    Enter current password for root (enter for none): just press enter
    Change the root password? [Y/n] Y  ( 'will ask to enter password', use team9 )
    Remove anonymous users? [Y/n] Y
    Disallow root login remotely? [Y/n] Y
    Remove test database and access to it? [Y/n] Y
    Reload privilege tables now? [Y/n] Y
---

#### Create App Database
---
    mysql -u root -p
    mysql> create database application;
---

#### Create a user which can only access this database
#### We are going to use it to provide remove access for an instructor as well
---
    mysql> create user 'team9user'@'localhost' identified by 'team9user';
    mysql> grant all on application.* to 'team9user' identified by 'team9user';
---