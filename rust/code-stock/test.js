
(async () => {
    try{

        const fs = require('fs');
        const path = require('path');

        const env = {
            PWD: '/'
        };
        let thisView = null;
        let wasmRes = null;
        let thisMemory = null;

        let consoleLogData = '';

        let bindings = {};

        const getiovs = (iovs, iovsLen) => {
            // iovs* -> [iov, iov, ...]
            // __wasi_ciovec_t {
            //   void* buf,
            //   size_t buf_len,
            // }
      
            refreshMemory();
      
            const buffers = Array.from({ length: iovsLen }, (_, i) => {
              const ptr = iovs + i * 8;
              const buf = thisView.getUint32(ptr, true);
              const bufLen = thisView.getUint32(ptr + 4, true);
              return new Uint8Array(thisMemory.buffer, buf, bufLen);
            });
      
            return buffers;
          };

        const refreshMemory = () => {
            if (!thisView || thisView.buffer.byteLength === 0) {
                thisView = new DataView(thisMemory.buffer);
            }
        }

        function Uint8ArrayToString(fileData){
            var dataString = "";
            for (var i = 0; i < fileData.length; i++) {
              dataString += String.fromCharCode(fileData[i]);
            }
           
            return dataString
          
          }

        const importObject = {
            wasi_snapshot_preview1: {
                fd_write: (fd, iovs, iovsLen, nwritten) => {
                    let written = 0;
                    const buffers = getiovs(iovs, iovsLen);

                    buffers.forEach(buffer => {
                        consoleLogData+= Uint8ArrayToString(buffer);
                        written+=buffer.length;
                    });

                    thisView.setUint32(nwritten, written, true);
                    return 0;
                },
                environ_get: (environ, environBuf) => {
                    refreshMemory();
                    let coffset = environ;
                    let offset = environBuf;
                    Object.entries(env).forEach(([key, value]) => {
                      thisView.setUint32(coffset, offset, true);
                      coffset += 4;
                      offset += Buffer.from(thisMemory.buffer).write(
                        `${key}=${value}\0`,
                        offset
                      );
                    });
                    return 0;
                },
                environ_sizes_get: (environCount, environBufSize) => {
                    refreshMemory();
                    const envProcessed = Object.entries(env).map(
                        ([key, value]) => `${key}=${value}\0`
                    );
                    const size = envProcessed.reduce(
                        (acc, e) => acc + Buffer.byteLength(e),
                        0
                    );
                    thisView.setUint32(environCount, envProcessed.length, true);
                    thisView.setUint32(environBufSize, size, true);
                    return 0;
                },
                proc_exit: (rval) => {
                    bindings.exit && bindings.exit(rval);
                    return 0;
                },
            }
        };

        const wasmFileBuffer = fs.readFileSync(path.join(__dirname, 'target/wasm32-wasi/debug/code-stock.wasm'));

        wasmRes = await WebAssembly.instantiate(wasmFileBuffer, importObject);
        thisMemory = wasmRes.instance.exports.memory;

        // wasmRes.instance.exports._start && wasmRes.instance.exports._start();
        
        wasmRes.instance.exports.main();

        console.log({
            consoleLogData,
        });
    
     } catch(e) {
        console.error(e);
    }
})();