# Magix应用打包脚本

## 包含Task
* Task: clear - 清空指定目录
* Task: copy - 拷贝你要打包的app文件夹
* Task: combine - 合并magix view 和js 解决跨域问题
* Task: minify - 压缩js
* Task: mincss - 压缩css
* Task: clean - 清理无用的文件

## 使用方法

### 首次使用
* 安装node环境
* 安装grunt-cli http://gruntjs.com/getting-started (如果有0.4.0以下版本的grunt 请执行npm uninstall -g grunt卸载，再安装grunt-cli)

### 根据你的应用配置Gruntfile.js

		/**
         * 只需要修改配置到这里
         */
        build: {
            main: {
                src: '/opt/local/share/nginx/html/mbp-new/app/', //magix view 所在的入口文件夹路径
                dest: '/opt/local/share/nginx/html/magix-app-build/build/app/', //处理后文件夹的路径
                compress: 'normal', //压缩级别 mini 或者normal
                c2u: false, //中文转化unicode
                tmplKey: 'template' //view对应模板字段的key
            }
        }

### 运行 grunt 命令即可完成打包






