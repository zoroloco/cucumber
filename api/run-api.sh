#!/bin/bash -ex
export NODE_ENV=production
pm2 start dist/main.js -i max --name "druidia-api" --env production --output "/opt/cucumber/api/logs/output.log" --error "/opt/cucumber/api/logs/error.log"
