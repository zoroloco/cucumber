#!/bin/bash
cd ..
docker run  --env-file=.env -p 3378:3306 db:latest