// eslint-disable-next-line @typescript-eslint/no-unused-vars

import "./dark.css";
import "./light.css";
import "./style.css";
import "./fonts.css";

import "@material/web/all.js";

import "@xterm/xterm/css/xterm.css";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { MdFilledButton, MdListItem, MdRadio } from "@material/web/all.js";

// @ts-ignore
const __version__ = "0.0.1";
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
                <input style="display: none;" type="file" name="up1" id="up1">
                <div class="row">
                    <md-filled-tonal-button style="flex-grow: 1;" id="up2btn">
                        Upload Magisk Apk
                    </md-filled-tonal-button>
                    <md-filled-button id="loadbtn" style="display: flex;flex-grow: 1;">
                        Load From Online
                    </md-filled-button>
                </div>
                <input style="display:none;" type="file" name="up2" id="up2">
                <md-divider></md-divider>
                <h3>Arch</h3>
                <md-list style="background-color: transparent;">
                  <md-list-item type="button" id="list1">
                    <div for="arm64" slot="headline" style="user-select:none;">arm64</div>
                    <md-radio id="arm64" name="group" value="1" slot="end" checked/>
                  </md-list-item>
                  <md-list-item type="button" id="list2">
                    <div slot="headline">arm32</div>
                    <md-radio id="arm32" name="group" value="2" slot="end"/>
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
                    <md-filter-chip label="Keep Verity" selected></md-filter-chip>
                    <md-filter-chip label="Keep Force Encrypt" selected></md-filter-chip>
                    <md-filter-chip label="Recovery Mode"></md-filter-chip>
                    <md-filter-chip label="Patch Vbmeta Flag"></md-filter-chip>
                    <md-filter-chip label="Legacy SAR Device"></md-filter-chip>
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
        <div>2025 © CircleCashTeam ⭕💰 All rights reserved</div>
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
  const width = 30; // 进度条的总长度（单位：字符）
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
  const percentText = `${(percentage * 100).toFixed(1)}%`; // 百分比文本

  const doneText = percentage == 1.0 ? "\x1b[92mDone!\x1b[0m\n\r" : "";
  // 输出到终端
  terminal.write(
    `\r\x1b[94mProgress: ${char_style}${progressBar}${char_empty} ${char_style2}${percentText}${char_empty}\t ${label_style}${label} ${doneText}${char_empty}`
  );
}

document.getElementById("up1btn")!.addEventListener("click", () => {
  logi("Upload boot image.");
});

document.getElementById("up2btn")!.addEventListener("click", () => {
  logi("Upload magisk apk.");
  // 示例：模拟进度更新
  let total = 100.0;
  let value = 0.0;

  const interval = setInterval(() => {
    value += 0.1; // 每次增加 5
    print_progress(total, value, "Download Magisk Apk...");

    if (value >= total) {
      clearInterval(interval);
    }
  }, 10); // 每 200ms 更新一次
});

document.getElementById("loadbtn")!.addEventListener("click", () => {});

document.querySelector<MdListItem>("#list1")!.addEventListener("click", () => {
  document.querySelector<MdRadio>("#arm64")!.checked = true;
});

document.querySelector<MdListItem>("#list2")!.addEventListener("click", () => {
  document.querySelector<MdRadio>("#arm32")!.checked = true;
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

    worker.postMessage({ type: "start", data: {} });

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
        worker.terminate(); // 终止 Worker
        logs("Worker terminated.");
      }
    };

    worker.onerror = function (error) {
      loge(`Worker error: ${error}`);
    };
  });
