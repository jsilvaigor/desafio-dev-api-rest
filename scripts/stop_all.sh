#!/usr/bin/env bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

docker-compose -f ../ms-mini-bank/docker-compose.yml stop
docker-compose -f ../db/docker-compose.yml stop