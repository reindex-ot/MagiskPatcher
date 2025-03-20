// eslint-disable-next-line @typescript-eslint/no-unused-vars

import "./dark.css";
import "./light.css";
import "./style.css";
import "./fonts.css";

import "@material/web/all.js";

import "@xterm/xterm/css/xterm.css";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { MdFilledButton, MdFilterChip, MdListItem, MdRadio } from "@material/web/all.js";
import axios from "axios";
import JSZip from "jszip";

// @ts-ignore
const __version__ = "0.1.2";
// @ts-ignore
const __author__ = "affggh";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <header class="appbar">
        <div class="row">
            <md-icon style="--md-icon-size: 36px" tabindex="-1">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                    fill="#e3e3e3">
                    <path
                        d="M40-240q9-107 65.5-197T256-580l-74-128q-6-9-3-19t13-15q8-5 18-2t16 12l74 128q86-36 180-36t180 36l74-128q6-9 16-12t18 2q10 5 13 15t-3 19l-74 128q94 53 150.5 143T920-240H40Zm240-110q21 0 35.5-14.5T330-400q0-21-14.5-35.5T280-450q-21 0-35.5 14.5T230-400q0 21 14.5 35.5T280-350Zm400 0q21 0 35.5-14.5T730-400q0-21-14.5-35.5T680-450q-21 0-35.5 14.5T630-400q0 21 14.5 35.5T680-350Z" />
                </svg>
            </md-icon>
            <div class="appbar-title">MagiskPatcher</div>
            <div class="spacer"></div>
            <md-text-button style="padding: 10px;" href="https://github.com/CircleCashTeam" trailing-icon>
                Visit us on Github
                <svg slot="icon" viewBox="0 0 48 48">
                    <path
                        d="M9 42q-1.2 0-2.1-.9Q6 40.2 6 39V9q0-1.2.9-2.1Q7.8 6 9 6h13.95v3H9v30h30V25.05h3V39q0 1.2-.9 2.1-.9.9-2.1.9Zm10.1-10.95L17 28.9 36.9 9H25.95V6H42v16.05h-3v-10.9Z" />
                </svg>
            </md-text-button>
        </div>
    </header>

    <main>
        <div class="container">
            <div class="column card" style="flex: 2; padding: 10px;">
                <md-filled-button id="up1btn">
                    Upload Boot Image
                </md-filled-button>
                <input style="display: none;" type="file" name="up1" id="up1" accept=".img, .bin">
                <md-filled-tonal-button id="up2btn" >
                    Upload Magisk Apk
                </md-filled-tonal-button>
                <input style="display:none;" type="file" name="up2" id="up2" accept=".apk, .zip">
                <md-divider></md-divider>
                <h3>Arch</h3>
                <md-list style="background-color: transparent;">
                  <md-list-item type="button" id="list1">
                    <div slot="headline" style="user-select:none;">arm64-v8a</div>
                    <md-radio id="arm64-v8a" name="group" value="1" slot="end" checked/>
                  </md-list-item>
                  <md-list-item type="button" id="list2">
                    <div slot="headline">armeabi-v7a</div>
                    <md-radio id="armeabi-v7a" name="group" value="2" slot="end"/>
                  </md-list-item>
                  <md-list-item type="button" id="list3">
                    <div slot="headline">x86_64</div>
                    <md-radio id="x86" name="group" value="3" slot="end"/>
                  </md-list-item>
                  <md-list-item type="button" id="list4">
                    <div slot="headline">x86</div>
                    <md-radio id="x86_64" name="group" value="4" slot="end"/>
                  </md-list-item>
                </md-list>
                <md-divider></md-divider>
                <md-chip-set>
                    <md-filter-chip id="kv" label="Keep Verity" selected></md-filter-chip>
                    <md-filter-chip id="kfe" label="Keep Force Encrypt" selected></md-filter-chip>
                    <md-filter-chip id="rm" label="Recovery Mode"></md-filter-chip>
                    <md-filter-chip id="pvf" label="Patch Vbmeta Flag"></md-filter-chip>
                    <md-filter-chip id="sar" label="Legacy SAR Device"></md-filter-chip>
                </md-chip-set>
                <div class="spacer"></div>
                <md-linear-progress id="patchprogress" style="display: none;" indeterminate></md-linear-progress>
                <md-filled-button id="testbtn">
                    Patch
                </md-filled-button>
                <!--md-text-button id="downloadbtn" style="padding: 10px;" trailing-icon disabled>
                    Click me download latest magisk apk
                    <svg slot="icon" viewBox="0 0 48 48">
                        <path
                            d="M9 42q-1.2 0-2.1-.9Q6 40.2 6 39V9q0-1.2.9-2.1Q7.8 6 9 6h13.95v3H9v30h30V25.05h3V39q0 1.2-.9 2.1-.9.9-2.1.9Zm10.1-10.95L17 28.9 36.9 9H25.95V6H42v16.05h-3v-10.9Z" />
                    </svg>
                </md-text-button-->
            </div>
            <div id="terminal" style="flex: 3;"></div>
        </div>
    </main>

    <footer>
        <div>2025 © <a style="color: var(--md-sys-color-on-background)" href="https://github.com/CircleCashTeam">CircleCashTeam<a> ⭕💰 All rights reserved</div>
    </footer>
    <script src="/magiskboot.js"></script>
`;

const body = document.body;
const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

function setTheme(isDarkMode: boolean) {
  if (isDarkMode) {
    body.classList.remove("light");
    body.classList.add("dark");
  } else {
    body.classList.remove("dark");
    body.classList.add("light");
  }
}

if (darkModeMediaQuery.matches) {
  setTheme(true);
}

const terminal = new Terminal({
  fontFamily: "Iosevka, monospace",
  fontSize: 14,
  letterSpacing: 0,
  theme: {
    background: getComputedStyle(body)
      .getPropertyValue("--md-sys-color-surface-variant")
      .trim(),
    foreground: getComputedStyle(body)
      .getPropertyValue("--md-sys-color-on-surface-variant")
      .trim(),
  },
  scrollOnUserInput: true,
});

class LogType {
  static INFO = 0;
  static WARN = 1;
  static SUCC = 2;
  static ERRO = 3;
  static CRIT = 4;
  static DEBU = 5;
}

function printlog(msg: string, type: LogType) {
  let color = "\x1b[0m"; // normal
  let level = "Normal:";
  switch (type) {
    case LogType.INFO:
      color = "\x1b[94m"; // blue
      level = "Info:";
      break;
    case LogType.WARN:
      color = "\x1b[93m";
      level = "Warning:";
      break;
    case LogType.SUCC:
      color = "\x1b[92m";
      level = "Success:";
      break;
    case LogType.ERRO:
      color = "\x1b[91m";
      level = "Error:";
      break;
    case LogType.CRIT:
      color = "\x1b[95m";
      level = "Critical:";
      break;
    case LogType.DEBU:
      color = "\x1b[96m";
      level = "Debug:";
      break;
    default:
      break;
  }
  terminal.writeln(color + level + " " + msg + "\x1b[0m");
  terminal.scrollToBottom();
}

// @ts-ignore
function logi(msg: string) {
  printlog(msg, LogType.INFO);
}
// @ts-ignore
function logw(msg: string) {
  printlog(msg, LogType.WARN);
}
// @ts-ignore
function logs(msg: string) {
  printlog(msg, LogType.SUCC);
}
// @ts-ignore
function loge(msg: string) {
  printlog(msg, LogType.ERRO);
}
// @ts-ignore
function logc(msg: string) {
  printlog(msg, LogType.CRIT);
}
// @ts-ignore
function logd(msg: string) {
  printlog(msg, LogType.DEBU);
}

const fitAddon = new FitAddon();
terminal.loadAddon(fitAddon);
terminal.open(document.querySelector<HTMLDivElement>("#terminal")!);
fitAddon.fit();

window.addEventListener("resize", () => {
  fitAddon.fit();
});

//setupDownloadLink();

function print_progress(total: number, value: number, label: string) {
  const width = 10; // 进度条的总长度（单位：字符）
  const char_style = "\x1b[46;96m"; // 蓝色背景，亮蓝色文字
  const char_style2 = "\x1b[95m"; // 黑色背景，亮紫色文字
  const label_style = "\x1b[96m";
  const char_empty = "\x1b[0m"; // 重置颜色

  // 定义填充字符（从少到多）
  const fillChars = [" ", "▏", "▎", "▍", "▌", "▋", "▊", "▉", "█"];

  // 计算当前进度百分比
  const percentage = Math.min(value / total, 1); // 确保不超过 100%
  const filledLength = width * percentage; // 已填充的长度
  const fullBlocks = Math.floor(filledLength); // 完整填充的块数
  const partialBlockIndex = Math.floor(
    (filledLength - fullBlocks) * (fillChars.length - 1)
  ); // 部分填充的字符索引

  // 构建进度条
  let filledBar, partialBar, emptyBar;

  if (percentage === 1.0) {
    // 进度为 100% 时，完全填充
    filledBar = fillChars[fillChars.length - 1].repeat(width);
    partialBar = "";
    emptyBar = "";
  } else {
    // 进度未满时，计算部分填充和空白部分
    filledBar = fillChars[fillChars.length - 1].repeat(fullBlocks);
    partialBar = partialBlockIndex >= 0 ? fillChars[partialBlockIndex] : "";
    emptyBar = fillChars[0].repeat(Math.max(0, width - fullBlocks - 1));
  }

  // 组合进度条
  const progressBar = `${filledBar}${partialBar}${emptyBar}`;
  const percentText = `${(percentage * 100).toFixed(1)}%`.padEnd(6); // 百分比文本

  const doneText = percentage == 1.0 ? "\x1b[92mDone!\x1b[0m\n\r" : "";
  // 输出到终端
  terminal.write(
    `\r\x1b[94mProgress: \x1b[90;106m${char_style}${progressBar}\x1b[96;100m${char_empty} ${char_style2}${percentText}${char_empty} ${label_style}${label} ${doneText}${char_empty}`
  );
}

let bootArray: ArrayBuffer | null = null;
let apkArray: ArrayBuffer | null = null;

document.getElementById("up1btn")!.addEventListener("click", () => {
  logi("Upload boot image.");
  document.querySelector<HTMLInputElement>("#up1")?.click();
});

document
  .querySelector<HTMLInputElement>("#up2")
  ?.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files ? target.files[0] : null;
    if (file) {
      logi("Handle uploaded apk file...");
      const reader = new FileReader();

      reader.onload = (e) => {
        apkArray = e.target?.result as ArrayBuffer;
        logs("Success upload file");
      };

      reader.onerror = (e) => {
        loge(`Read error: ${e.target?.error}`);
      };

      reader.readAsArrayBuffer(file);
    } else {
      logi("File not uploaded!");
    }
  });

document
  .querySelector<HTMLInputElement>("#up1")
  ?.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files ? target.files[0] : null;
    if (file) {
      logi("Handle uploaded boot image...");
      const reader = new FileReader();

      reader.onload = (e) => {
        bootArray = e.target?.result as ArrayBuffer;
        logs("Success upload file");
      };

      reader.onerror = (e) => {
        loge(`Read error: ${e.target?.error}`);
      };

      reader.readAsArrayBuffer(file);
    } else {
      logi("File not uploaded!");
    }
  });

document.getElementById("up2btn")!.addEventListener("click", () => {
  logi("Upload magisk apk.");
  document.querySelector<HTMLInputElement>("#up2")?.click();
});

document.querySelector<MdListItem>("#list1")!.addEventListener("click", () => {
  document.querySelector<MdRadio>("#arm64-v8a")!.checked = true;
});

document.querySelector<MdListItem>("#list2")!.addEventListener("click", () => {
  document.querySelector<MdRadio>("#armeabi-v7a")!.checked = true;
});
document.querySelector<MdListItem>("#list4")!.addEventListener("click", () => {
  document.querySelector<MdRadio>("#x86_64")!.checked = true;
});
document.querySelector<MdListItem>("#list3")!.addEventListener("click", () => {
  document.querySelector<MdRadio>("#x86")!.checked = true;
});

document
  .querySelector<MdFilledButton>("#testbtn")!
  .addEventListener("click", async () => {
    const worker = new Worker(new URL("./boot_patcher.js", import.meta.url));

    try {
      if (!bootArray) {
        loge("Boot image not loaded!");
        return;
      }

      let arch: string | null = null;
      const architectures = ["arm64-v8a", "armeabi-v7a", "x86_64", "x86"];

      if (!apkArray) {
        apkArray = await getArrayBuffer();
      }

      for (const l of architectures) {
        const radio = document.querySelector<MdRadio>(`#${l}`);
        if (radio?.checked) {
          arch = l;
          break; // 找到选中的项后立即退出循环
        }
      }

      if (apkArray) {
        const needed = await loadApkNeeded(apkArray, arch ?? 'arm64-v8a');
        console.log('Needed:', needed);

        const env = getFilterSelect();

        console.log("Get apk data:", apkArray);
        console.log("Get boot data:", bootArray);
        const metadata = {
          type: "start",
          arch: arch,
          env: env,
        };

        const message = {
          apkBuffer: apkArray,
          bootBuffer: bootArray,
          needed: needed,
          metadata: metadata,
        };
        worker.postMessage(message);
      } else {
        loge("Could not get magisk from online!");
        return;
      }
    } catch (error) {
      loge(`Error: ${error}`);
      return;
    }

    worker.onmessage = (e) => {
      const type = e.data.type;
      const data = e.data.data;

      switch (type) {
        case "response":
          logi(data);
          break;
        case "error":
          loge(data);
          break;
        case "command":
          terminal.writeln(data);
          break;
        case "progress":
          print_progress(e.data.total, e.data.value, e.data.label);
          break;
        default:
          console.log("Recived message from worker:", e.data);
          break;
      }

      // 如果 Worker 发送了 "done" 消息，终止 Worker
      if (e.data.type === "done") {
        const buffer = e.data.data;
        //console.log(buffer);
        worker.terminate(); // 终止 Worker
        logs("Worker terminated.");
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        if (a) {
          a.href = url;
          a.download = "new-boot.img";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        URL.revokeObjectURL(url);
        logs("Download starting...");
      }
    };

    worker.onerror = function (error) {
      loge(`Worker error: ${error}`);
      worker.terminate();
    };
  });

async function getDownloadLink() {
  const apiurl =
    "https://api.github.com/repos/topjohnwu/Magisk/releases/latest";
  const crosProxy = "https://api.codetabs.com/v1/proxy?quest="; // cros proxy
  const response = await fetch(apiurl);

  if (!response.ok) {
    throw new Error("Network response not ok!");
  }

  const data = await response.json();
  const assets = data.assets;

  let downloadLink = "";
  let totalSize = 0;
  assets.forEach(
    (asset: { name: string; browser_download_url: string; size: number }) => {
      if (asset.name.startsWith("Magisk") && asset.name.endsWith(".apk")) {
        downloadLink = asset.browser_download_url;
        totalSize = asset.size;
      }
    }
  );
  if (downloadLink == "") {
    return { downloadLink, totalSize };
  }

  return { downloadLink: crosProxy + downloadLink, totalSize };
}

async function getArrayBuffer(): Promise<ArrayBuffer | null> {
  try {
    const { downloadLink, totalSize } = await getDownloadLink();
    if (downloadLink == "") {
      loge("Could not get download url");
      return null;
    } else {
      logd(`Get download url: ${downloadLink}`);
    }
    const resp = await axios({
      url: downloadLink,
      method: "GET",
      responseType: "arraybuffer",
      onDownloadProgress: (e) => {
        print_progress(totalSize, e.loaded, "Loading from online...");
      },
    });
    return resp.data; // 返回 ArrayBuffer
  } catch (error) {
    if (axios.isAxiosError(error)) {
      loge(`Axios error: ${error.message}`);
      if (error.response) {
        loge(`Response status: ${error.response.status}`);
        loge(`Response data: ${error.response.data}`);
      }
    } else {
      loge(`Unknown error: ${error}`);
    }
    return null;
  }
}

type FilterKeys = 'KEEPVERITY' | 'KEEPFORCEENCRYPT' | 'PATCHVBMETAFLAG' | 'RECOVERYMODE' | 'LEGACYSAR';

function getFilterSelect() {
  function convertName(l: string): FilterKeys | null {
    switch (l) {
      case 'kv':
        return "KEEPVERITY";
        break;
      case 'kfe':
        return "KEEPFORCEENCRYPT";
        break;
      case 'rm':
        return "RECOVERYMODE";
        break;
      case 'pvf':
        return "PATCHVBMETAFLAG";
        break;
      case 'sar':
        return "LEGACYSAR";
        break;
      default:
        break;
    }
    return null;
  }

  let ret = {
    KEEPVERITY: 'false',
    KEEPFORCEENCRYPT: 'false',
    PATCHVBMETAFLAG: 'false',
    RECOVERYMODE: 'false',
    LEGACYSAR: 'false',
  };

  for (const l of ["kv", "kfe", "rm", "pvf", "sar"]) {
    const state = document.querySelector<MdFilterChip>(`#${l}`)?.selected ?? false;
    if (state) {
      const key = convertName(l);
      if (key) {
        ret[key] = 'true'; // 将对应的属性值设置为 'true'
      }
    }
  }

  return ret; // 返回最终的结果对象
}

interface Needed {
  [key: string]: ArrayBuffer;
}

async function loadApkNeeded(buffer: ArrayBuffer, arch: string): Promise<Needed | null> {
  try {
    const zip = await JSZip.loadAsync(buffer);

    const ret: Needed = {};

    // Use Promise.all to handle asynchronous operations inside the loop
    const promises: Promise<void>[] = [];

    let magiskVer = 0;
    const ufuncs = await zip.file("assets/util_functions.sh")?.async('text');
    if (!ufuncs) {
      loge("Could not found magisk version!");
      return null;
    }

    const matchResult = ufuncs.match(/MAGISK_VER_CODE=(\d+)/);
    if (matchResult) {
      magiskVer = Number.parseInt(matchResult[1]);
      logi(`Get Magisk version code: ${magiskVer}`);
    } else {
      loge("Could not found magisk version from util_functions.sh!");
      return null;
    }


    zip.forEach((rpath, file) => {
      const parts = rpath.split('/');
      const fileName = parts[parts.length - 1]; // Get the file name
      const parentDir = parts[parts.length - 2]; // Get the parent directory

      if (magiskVer < 28000) {
        if (arch === "arm64-v8a") {
          if (fileName == "libmagisk32.so" && "armeabi-v7a" === parentDir) {
            promises.push(
              file.async('arraybuffer').then((arrayBuffer) => {
                ret[fileName.replace('lib', '').replace('.so', '')] = arrayBuffer;
              })
            );
          }
        } else if (arch === "x86_64") {
          if (fileName == "libmagisk32.so" && "x86" === parentDir) {
            promises.push(
              file.async('arraybuffer').then((arrayBuffer) => {
                ret[fileName.replace('lib', '').replace('.so', '')] = arrayBuffer;
              })
            );
          }
        }
      }

      if (fileName.startsWith('lib') && fileName.endsWith('.so') && parentDir === arch) {
        // Push the async operation into the promises array
        if (fileName == "libmagiskboot.so" || fileName == "libbusybox.so" || fileName == "libmagiskpolicy.so") {
          return; // skip unused bin to reduce memories
        }
        promises.push(
          file.async('arraybuffer').then((arrayBuffer) => {
            ret[fileName.replace('lib', '').replace('.so', '')] = arrayBuffer;
          })
        );
      } else {
        if (fileName == "stub.apk") {
          promises.push(
            file.async('arraybuffer').then((arrayBuffer) => {
              ret[fileName] = arrayBuffer;
            }
            ));
        }
      }
    });

    // Wait for all async operations to complete
    await Promise.all(promises);

    for (const k in ret) {
      logi(`Loaded needed: ${k}`);
    }

    return ret;
  } catch (error) {
    loge(`Error: ${error}`);
    return null;
  }
}

terminal.writeln("\x1b[96mMagisk Patcher on WEB");
terminal.writeln("\x1b[93mAuthor: \x1b[94m" + __author__);
terminal.writeln("\x1b[93mVersion:\x1b[94m " + __version__);
terminal.writeln("\x1b[0m");
