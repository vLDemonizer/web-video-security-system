#!/bin/bash

if [ -z $1 ]; then
    echo "Must pass docker-compose file to use"
    exit 1
fi

# Build containers
docker-compose build -f $1

docker-compose -f $1 down
docker-compose -f $1 up -d
docker-compose -f $1 logs -f