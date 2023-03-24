#!/bin/bash
cd ..
docker run --env-file=.env -p 3001:3001 api:latest