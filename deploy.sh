#! /bin/bash
GREEN='\033[1;32m'
NC='\033[0m' # No Color

echo " * Deploying Ryflect"

echo " * Pulling in repository..."
git pull "git@github.com:chrischristakis/ryflect.git"

echo " * Installing client dependencies..."
cd client
npm install

echo " * Copying client build for NGinx to serve..."
sudo cp -Rv build /var/www/html
cd ..

echo " * Installing server dependencies..."
cd server && npm install

echo " * Starting PM2 instance..."
pm2 stop index # might output an error if its not running, but will work.
export NODE_ENV=production&&pm2 start index.js

echo -e " * ${GREEN}Ryflect has been deployed successfully!${NC}"