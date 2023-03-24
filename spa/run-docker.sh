#!/bin/bash
cd ..
docker run  --env-file=.env -p 80:80 nginx:latest