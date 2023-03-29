#!/bin/bash -ex

#script to run in production forever.
#requires: npm install pm2@latest -g

pm2 start run-api.sh
