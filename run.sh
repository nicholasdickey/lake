#!/bin/sh
npm run pm2 start start.json
while true; do
  sleep 1000
done