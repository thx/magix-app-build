# Magix应用打包脚本
## 使用方法
### 首次使用
* 安装node环境
* 安装grunt-cli http://gruntjs.com/getting-started (如果有0.4.0以下版本的grunt 请执行npm uninstall -g grunt卸载，再安装grunt-cli)

### 使用
* windows环境执行 release.cmd
* Linux环境执行 release.sh

###脚本参数说明
grunt pack --appDir=../../public/app/ --destDir=../../public/build/app/ --isDelSourceJs=false

* appDir是magix应用app目所在位置，文件夹名称可以更改
* desDir是文件打包发布app的文件夹地址
* isDelSourceJs配置是否保留压缩前的js地址，保留有利于在线调试，true：删除掉压缩前的js，false：不删除。