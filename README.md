# Magix应用打包脚本
## 使用方法
### 首次使用
* 安装node环境
* 安装grunt-cli http://gruntjs.com/getting-started (如果有0.4.0以下版本的grunt 请执行npm uninstall -g grunt卸载，再安装grunt-cli)

### 使用
* windows环境执行 release.cmd
* Linux环境执行 release.sh

###脚本参数说明
grunt pack --appDir=../../public/app/ --destDir=../../public/build/app/ --compress=full|normal|mini --c2u=false

* appDir是magix应用app目所在位置，文件夹名称可以更改
* desDir是文件打包发布app的文件夹地址
* compress 压缩级别，full包含压缩后的-min.x文件，.map文件及原始文件，normal是原始文件和压缩文件 mini只有压缩文件，默认normal. c2u 是否把中文转成unicode的形式，默认false