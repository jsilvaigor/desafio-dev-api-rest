#!/usr/bin/env bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

echo "Removing database"
docker-compose -f ../db/docker-compose.yml down
echo "Removing database volume"
docker volume rm db_database

echo "Removing mini_bank_network"
docker network rm mini_bank_network || true