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
  async function getDownloadLink() {
    const apiurl =
      "https://api.github.com/repos/topjohnwu/Magisk/releases/latest";
    const crosProxy = "https://api.codetabs.com/v1/proxy?quest=";
    const response = await fetch(apiurl);

    if (!response.ok) {
      throw new Error("Network response not ok!");
    }

    const data = await response.json();
    const assets = data.assets;

    let downloadLink = "#";
    assets.forEach((asset) => {
      if (asset.name.startsWith("Magisk") && asset.name.endsWith(".apk")) {
        downloadLink = asset.browser_download_url;
      }
    });
    if (downloadLink == "#") {
      return "";
    }
    return crosProxy + downloadLink;
  }

  //const dlink = await getDownloadLink();
  //logi("Get download link: " + dlink);

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

  let total = 100.0;
  let value = 0.0;

  const interval = setInterval(() => {
    value += 0.1; // 每次增加 5
    //print_progress(total, value, "Download Magisk Apk...");
    this.postMessage({
      type: "progress",
      total: total,
      value: value,
      label: "Worker test...",
    });

    if (value >= total) {
      clearInterval(interval);
      self.postMessage({ type: "done" });
    }
  }, 10); // 每 200ms 更新一次
};
