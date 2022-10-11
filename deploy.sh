# echo "Kill all the running PM2 actions"
# sudo pm2 kill

echo "Jump to app folder"
cd /home/ubuntu/whatsSpotBackend

echo "Update app from Git"
sudo git pull

# echo "Install app dependencies"
# sudo rm -rf node_modules package-lock.json
# sudo npm install



echo "Run new PM2 action"
# sudo cp /home/ubuntu/ecosystem.json ecosystem.json
sudo pm2 restart spotBackend