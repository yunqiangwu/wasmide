#!/usr/bin/env bash

# docker build . -t registry.cn-hangzhou.aliyuncs.com/gitpod/webide:1.16.1 --no-cache

# https://github.com/wasmerio/wasmer-js/tree/0.x/packages/wasm-terminal
# https://github.com/second-state/wasmedge-quickjs
# https://github.com/wasmerio/webassembly.sh.git

# mkdir -p `pwd`/webide-home/mysql_data
# docker rm -f mysql
# docker run -d -it -p 3306:3306 -v `pwd`/webide-home/mysql_data:/var/lib/mysql --name mysql -e MYSQL_ROOT_PASSWORD=root mysql --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci --default_authentication_plugin=mysql_native_password
