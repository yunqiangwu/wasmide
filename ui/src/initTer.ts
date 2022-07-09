
// import { useState } from 'preact';
// import{ fetchCommandFromWAPM } from "@wasmer/wasm-terminal";
// import { lowerI64Imports } from "@wasmer/wasm-transformer";
// import { fetchCommandFromWAPM } from "./wapm";
import { WasmFs } from '@wasmer/wasmfs'
import { WASI } from "@wasmer/wasi";
// @ts-ignore
import WAPM from './services/wapm/wapm';
// import { lowerI64Imports } from "@wasmer/wasm-transformer";
// import { extractContents } from "@wasmer/wasmfs/lib/tar";
import WasmTerminal from "@wasmer/wasm-terminal"
import BrowserWASIBindings from "@wasmer/wasi/lib/bindings/browser";
import 'xterm/css/xterm.css'

WASI.defaultBindings = BrowserWASIBindings;

// const commands = {
//     callback: (options: any, wasmFs: any) => {
//       let myArr = new Uint8Array(1024);
//       let stdin = wasmFs.fs.readSync(0, myArr, 0, 1024, 0);
//       return Promise.resolve(
//         `Callback Command Working! Options: ${options}, stdin: ${myArr}`
//       );
//     },
//     hello: '/helloworld.wasm',
//     pwd: '/pwd.wasm',
//     wyq: 'wyq-stock.wasm',
//     qqjs: '/qqjs.wasm',
//   };
  
//   const getBinaryFromUrl = async (url: string) => {
//     const fetched = await fetch(url);
//     const buffer = await fetched.arrayBuffer();
//     return new Uint8Array(buffer);
//   };

// const commandLoadCache: any = {};

// function getTerWasmFs() {
//     return (window as any)._wasmTerminal.wasmTerminalConfig.wasmFs;
// }

let wapm: any = null;

const fetchCommandHandler2 = async(options: {
    args: Array<string>,
    env?: { [key: string]: string }
  }) => {

//     const commandName = args[0];
//     const customCommand = (commands as any)[commandName];
//     let wasmBinary = undefined;

//     if (customCommand) {
//       if (typeof customCommand === "string") {
//         const fetched = await fetch(customCommand);
//         const buffer = await fetched.arrayBuffer();
//         wasmBinary = new Uint8Array(buffer);
//         return await lowerI64Imports(wasmBinary);
//       } else {
//         return customCommand;
//       }
//     } else {
//       const binaryName = `/bin/${commandName}`;
//       if (!getTerWasmFs().fs.existsSync(binaryName)) {
//         getTerWasmFs().fs.mkdirpSync("/bin");
//         let command = await fetchCommandFromWAPM({args, env});

//         const packageUrl = command.packageVersion.distribution.downloadUrl;
//         let binary = await getBinaryFromUrl(packageUrl);
      
//         const packageVersion = command.packageVersion;
//         const installedPath = `/_wasmer/wapm_packages/${packageVersion.package.name}@${packageVersion.version}`;
        
//         // We extract the contents on the desired directory
//         await extractContents(getTerWasmFs(), binary, installedPath);
        
//         const wasmFullPath = `${installedPath}/${command.module.source}`;
//         const filesystem = packageVersion.filesystem;
//         const wasmBinary = getTerWasmFs().fs.readFileSync(wasmFullPath);
//         const loweredBinary = await lowerI64Imports(wasmBinary as any);
//         const loweredFullPath = `${wasmFullPath}.__lowered__`;
//         getTerWasmFs().fs.writeFileSync(loweredFullPath, loweredBinary);
//         let preopens: any = {};
//         filesystem.forEach(({ wasm, host }) => {
//           preopens[wasm] = `${installedPath}/${host}`;
//         });
//         const mainFunction = new Function(`// wasi
// return function main(options) {
//   var preopens = ${JSON.stringify(preopens)};
//   return {
//     "args": options.args,
//     "env": options.env,
//     // We use the path for the lowered Wasm
//     "modulePath": ${JSON.stringify(loweredFullPath)},
//     "preopens": preopens,
//   };
// }
// `)();
//         getTerWasmFs().fs.writeFileSync(binaryName, mainFunction.toString());
//       }
//       let fileContents = getTerWasmFs().fs.readFileSync(binaryName, "utf8");
//       let mainProgram = new Function(`return ${fileContents as string}`)();
//       let program = mainProgram({args, env});
//       if (!(program.modulePath in commandLoadCache)) {
//         let programContents;
//         try {
//           programContents = getTerWasmFs().fs.readFileSync(program.modulePath);
//         } catch {
//           throw new Error(
//             `The lowered module ${program.modulePath} doesn't exist`
//           );
//         }
//         commandLoadCache[program.modulePath] = Promise.resolve(
//           WebAssembly.compile(programContents)
//         );
//       }
//       program.module = await commandLoadCache[program.modulePath];
//       return program;
//       // console.log(fileToExecute);
//     }

    if(wapm) {
      return await wapm.runCommand(options);
    } else {
      throw new Error('wapm init error');
    }

  }


export const openTer = (divDom: any) => {

    // Let's bind our Wasm terminal to it's container
    const containerElement = divDom;


    if (containerElement) {

        if ((window as any)._wasmTerminal) {
            (window as any)._wasmTerminal.open(containerElement);
            return (window as any)._wasmTerminal;
        }

        const processWorkerUrl = (document.getElementById("worker") as HTMLImageElement)
  .src;

        const wasmFs = new WasmFs();

        wasmFs.fs.mkdirpSync('/tmp/');

        // Let's create our Wasm Terminal
        const wasmTerminal = new WasmTerminal({
            // Function that is run whenever a command is fetched
            
            fetchCommand: fetchCommandHandler2,
            wasmFs,
            processWorkerUrl,
        });

        wapm = new WAPM(wasmTerminal, wasmFs);

        // Let's print out our initial message
        wasmTerminal.print("Hello World!");
        wasmTerminal.open(containerElement as any);
        wasmTerminal.fit();
        wasmTerminal.focus();

        // Later, when we are done with the terminal, let's destroy it
        // wasmTerminal.destroy();
        (window as any)._wasmTerminal = wasmTerminal;

        return wasmTerminal;
    } else {
      return (window as any)._wasmTerminal;
    }
}

