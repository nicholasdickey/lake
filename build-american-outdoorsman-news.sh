cp ./public/american-outdoors-manifest.json ./public/manifest.json
yarn build
pm2 reload all