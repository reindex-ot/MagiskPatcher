// boot_patcher.js
// Web Worker
importScripts("/magiskboot.js");

function logi(msg) {
  self.postMessage({ type: "response", data: msg });
}

function loge(msg) {
  self.postMessage({ type: "error", data: msg });
}

function cprint(msg) {
  self.postMessage({ type: "command", data: msg });
}

self.onmessage = async function (event) {
  const { data, metadata } = event.data;

  console.log("Worker: Recived apk buffer:", data);

  // 创建 magiskboot 实例
  await magiskboot({
    noInitialRun: true,
    print: (msg) => cprint(msg),
    printErr: (msg) => cprint(msg),
    locateFile: (file) => "/magiskboot.wasm",
  })
    .then((Module) => {
      function setenv(key, value) {
        Module.ccall(
          "setenv",
          "number",
          ["string", "string", "number"],
          [key, value, 1]
        );
      }

      function getenv(key) {
        return Module.ccall("getenv", "string", ["string"], [key]);
      }

      setenv("KEEPVERITY", "true");
      setenv("KEEPFORCEENCRYPT", "true");

      Module.callMain(["cpio", "ramdisk.cpio", "patch"]);
    })
    .catch((e) => {
      loge(`Error: ${e}`);
    });

  this.postMessage({ type: "done" });
};
