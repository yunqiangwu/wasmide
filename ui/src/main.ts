import { createApp } from 'vue'
import App from './App.vue'
import * as VueRouter from 'vue-router';

import HelloWorld from './components/HelloWorld.vue'

// 1. 定义路由组件.
// 也可以从其他文件导入
// const Home = { template: '<div>Home</div>' }
const About = { template: '<div>About</div>' }

// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。
const routes = [
  { path: '/', component: HelloWorld },
  { path: '/about', component: About },
]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = VueRouter.createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: VueRouter.createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})

const app = createApp(App)

app.use(router)

app.mount('#app')


// import { useState } from 'preact';
// import{ fetchCommandFromWAPM } from "@wasmer/wasm-terminal";
// import { lowerI64Imports } from "@wasmer/wasm-transformer";
import { WasmFs } from '@wasmer/wasmfs'
import WasmTerminal from "@wasmer/wasm-terminal"
import 'xterm/css/xterm.css'

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