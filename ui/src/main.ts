import { createApp } from 'vue'
import WasmTerminal from "@wasmer/wasm-terminal"
import App from './App.vue'
import 'xterm/css/xterm.css'

createApp(App).mount('#app')


// import { useState } from 'preact';
// import{ fetchCommandFromWAPM } from "@wasmer/wasm-terminal";
// import { lowerI64Imports } from "@wasmer/wasm-transformer";
import { WasmFs } from '@wasmer/wasmfs'

const commandLoadMap: { [key: string]: string} = {
  hello: '/helloworld.wasm',
  ls: '/coreutils.wasm',
  testh: '/helloworld_bg.wasm',
  h2: '/hello-rust.wasm',
};

const commandLoadCache: any = {};

// Let's write handler for the fetchCommand property of the WasmTerminal Config.
export const fetchCommandHandler = async ({ args }: any) => {
    let commandName = args[0] as string;
    // Let's return a "CallbackCommand" if our command matches a special name
    if (commandName === "callback-command") {
        const callbackCommand = async (options: any, wasmFs: any) => {
            return `Callback Command Working! Options: ${options}, fs: ${wasmFs}`;
        };
        return callbackCommand;
    }

    const cacheValue = commandLoadCache[commandName];
    if(cacheValue) {
      return cacheValue;
    }

    const loadWasmUrl = commandLoadMap[commandName];
    if(loadWasmUrl) {
      let response  = await fetch(loadWasmUrl);
      let wasmBytes = new Uint8Array(await response.arrayBuffer())
      commandLoadCache[commandName] = wasmBytes;
      return wasmBytes;
    }

    throw new Error(`command not found ${commandName}`)

    // // // Let's fetch a wasm Binary from WAPM for the command name.
    // const wasmBinary = await fetchCommandFromWAPM({ args });

    // // // lower i64 imports from Wasi Modules, so that most Wasi modules
    // // // Can run in a Javascript context.
    // return await lowerI64Imports(wasmBinary);
};

let isopen = false;
const openTer = () => {
  if(isopen) {
    return;
  }
  // Let's bind our Wasm terminal to it's container
  const containerElement = document.querySelector("#wasm-ter");

  if (containerElement) {

      const wasmFs = new WasmFs();

      // Let's create our Wasm Terminal
      const wasmTerminal = new WasmTerminal({
          // Function that is run whenever a command is fetched
          fetchCommand: fetchCommandHandler,
          wasmFs,
          // processWorkerUrl: ''
      });

      // Let's print out our initial message
      wasmTerminal.print("Hello World!");
      wasmTerminal.open(containerElement as any);
      wasmTerminal.fit();
      wasmTerminal.focus();

      isopen = true;
// Later, when we are done with the terminal, let's destroy it
// wasmTerminal.destroy();
      return wasmTerminal;
  }
}

(window as any)._wasmTerminal = openTer();