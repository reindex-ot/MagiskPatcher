# MagiskPatcher on web
__Patch boot image with magisk on web__

- Web only
- No need download
- Patch at local machine
- Easy to use

## How to use
1. Upload your boot image.
2. Upload Magisk apk `(optinal)`.
    - If no magisk apk upload, will fetch latest release from magisk repo.
3. Select your arch.
4. Select some patch flags.
5. Click patch button.
6. Waiting until patch done, and it will auto download.

## Build
### Build magiskboot
- You can found magiskboot source here:
    - 👉 **[magiskboot_build](https://github.com/CircleCashTeam/magiskboot_build)**
### Prepare env
- This prepared step can be found at magiskboot_build's **[README](https://github.com/CircleCashTeam/magiskboot_build/blob/main/README.md#emscripten)**

So we will not explain at here...
#### Clone repo
```sh
# clone repo
git clone https://github.com/CircleCashTeam/magiskboot_build magiskboot_build
```
#### Clone submodules
```sh
# clone submodules
sh ./scripts/clone_submodules.sh
```

#### Build magiskboot
- <a style="color: red;">Q</a>: Why we export `_setenv`?
- <a style="color: green;">A</a>: Cause we need to set some environment to make sure magiskboot could detect it correctlly.
```bash
# setup VCPKG_ROOT environment
# If your vcpkg root dir at $HOME
export VCPKG_ROOT="$HOME/vcpkg"

# use emcmake cmake to setup build
emcmake cmake -G Ninja -B build -DCMAKE_EXE_LINKER_FLAGS="-sFORCE_FILESYSTEM -sALLOW_MEMORY_GROWTH=1 -lproxyfs.js -lidbfs.js -sWASM=1 -sMODULARIZE=1 -sEXPORT_NAME=magiskboot -sEXPORTED_RUNTIME_METHODS=\"['FS','PROXYFS','out','err','ccall','cwrap','setValue','getValue','UTF8ToString','UTF8ArrayToString','stringToUTF8Array','FS_createPath','FS_createDataFile','removeRunDependency','addRunDependency','addFunction','safeSetTimeout','runtimeKeepalivePush','runtimeKeepalivePop','maybeExit','wasmMemory','callMain']\" -sEXPORTED_FUNCTIONS=\"['_main','_setenv','_getenv']\"" \
    -DRust_CARGO_TARGET="wasm32-unknown-emscripten" -DFULL_RUST_LTO=OFF \
    -DCMAKE_BUILD_TYPE=Release -DPREFER_STATIC_LINKING=ON \
    -DCMAKE_TOOLCHAIN_FILE=$VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake \
    -DVCPKG_TARGET_TRIPLET="wasm32-emscripten" \
    -DVCPKG_CHAINLOAD_TOOLCHAIN_FILE="$(dirname $(which emcc))/cmake/Modules/Platform/Emscripten.cmake"
# Acturally there is some flat is unneeded like -lproxyfs.js -lidbfs.js 

# Then build
cmake --build build
```

## Build this website
### Prepare npm
I'll skip about this...
### Build
```bash
# Tow simple command build
npm install
npm run build

# Then you can found output at dist/
```