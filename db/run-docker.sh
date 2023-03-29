#!/bin/bash
cd ..
docker run  --env-file=.env -p 3306:3306 db:latest