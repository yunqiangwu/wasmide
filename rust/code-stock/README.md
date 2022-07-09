# code-stock

```

rustup target add wasm32-wasi
cargo new helloworld 
cd helloworld
cargo build --release --target wasm32-wasi

wasmer inspect ./target/wasm32-wasi/release/code-stock.wasm
wasmer ./target/wasm32-wasi/release/code-stock.wasm

```
