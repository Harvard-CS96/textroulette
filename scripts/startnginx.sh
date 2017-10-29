#!/bin/bash
service nginx start > /var/log/startnginx.out 2>&1
cd /var/www/html
cp /home/ec2-user/.env .
npm install
pm2 restart server
