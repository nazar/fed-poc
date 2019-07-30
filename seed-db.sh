#!/usr/bin/env bash

docker-compose exec campaigns yarn migrate:latest
docker-compose exec campaigns yarn seed

docker-compose exec match yarn migrate:latest
docker-compose exec match yarn seed
