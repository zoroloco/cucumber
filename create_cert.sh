#!/bin/bash -ex

#script to create a self signed certificate for dev purposes only.
#requires openssl

openssl req -newkey rsa:2048 -nodes -keyout druidia.key -x509 -days 365 -out druidia.crt

