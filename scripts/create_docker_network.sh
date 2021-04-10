#!/usr/bin/env bash

docker network inspect mini_bank_network >/dev/null 2>&1 || \
    docker network create --driver bridge mini_bank_network