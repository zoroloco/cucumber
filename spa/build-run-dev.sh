#!/bin/bash

#shell script to run the SPA on your local machine. Probably runs on port 3000.

cp ../.env .

npm run build

npm start