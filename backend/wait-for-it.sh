#!/usr/bin/env bash
# Usage: wait-for-it.sh host:port [-s] [-t timeout] -- command args
set -e

host=$(echo "$1" | cut -d ':' -f 1)
port=$(echo "$1" | cut -d ':' -f 2)
shift

while ! nc -z "$host" "$port"; do
  sleep 1
done

exec "$@"