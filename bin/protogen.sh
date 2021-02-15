#!/usr/bin/env bash

cd "$(dirname "$0")"/../

NODE_PROTOC="./node_modules/.bin/grpc_tools_node_protoc"

for f in ./proto/*; do

  ${NODE_PROTOC} \
      --js_out=import_style=commonjs,binary:"${f}"/gen \
      --grpc_out="${f}"/gen \
      --plugin=protoc-gen-grpc=./node_modules/.bin/grpc_tools_node_protoc_plugin \
      -I "${f}" \
      "${f}"/*.proto

  ${NODE_PROTOC} \
      --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
      --ts_out="${f}"/gen \
      -I "${f}" \
      "${f}"/*.proto

done
