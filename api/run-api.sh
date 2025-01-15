#!/bin/bash -ex

pm2 start dist/main.js --name "druidia-api" --env production
