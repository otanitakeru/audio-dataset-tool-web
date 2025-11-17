#!/usr/bin/env bash

set -euxo pipefail

function cd_root_dir() {
    cd "$(dirname "$0")"
    cd ..
}

cd_root_dir

npm run dev