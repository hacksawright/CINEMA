#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
API_DIR="$SCRIPT_DIR/../cinema-server"

cd "$API_DIR"
if [ -f ./mvnw ]; then
  ./mvnw spring-boot:run
else
  mvn spring-boot:run
fi


