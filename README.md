# Magix应用打包脚本

This is the tools used for the release of Magix Application

## 使用方法

### 首次使用
* 安装node环境
* 安装grunt-cli http://gruntjs.com/getting-started (如果有0.4.0以下版本的grunt 请执行npm uninstall -g grunt卸载，再安装grunt-cli)

### 安装
    npm install magix-app-build

### 根据你的应用配置Gruntfile.js

        magix: {

            build: {

                //magix view 所在的入口文件夹路径
                src: '/opt/local/share/nginx/html/mbp-new/app/',
                //处理后文件夹的路径
                dest: '/opt/local/share/nginx/html/magix-app-build/build/app/'

            },
            options: {

                //压缩级别
                compress: 'normal',
                //中文转化unicode
                c2u: false,
                //view对应模板字段的key
                tmplKey: 'template',
                minSuffix: '.min'//压缩文件的后缀名称 可以是 .min -min(默认) 如果是no则保持原来的文件名 index.css压缩后仍是 index.css

            }
        }


### 执行grunt magix即可


## 注意

`npm`升级到3版本之后改变了依赖的安装方式，这里有说明：http://dailyjs.com/2015/06/26/npm-3/

所有的依赖都会平铺到顶级目录里，这就导致`magix-app-build`依赖的任务找不到而失败。

以下提供两个解决方案：

### 方案1

执行完`npm install`后再去`node_modules/magix-app-build`目录下再执行一下`npm install`即可

### 方案2

在你的项目`gruntfile.js`文件里增加`magix-app-build`的任务加载，完整的代码如下

```js
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        magix: {
            build: {
                //magix view 所在的入口文件夹路径
                src: './src/',
                //处理后文件夹的路径
                dest: './build/'
            },
            options: {
                //压缩级别
                compress: 'normal',
                //中文转化unicode
                c2u: false,
                //view对应模板字段的key
                tmplKey: 'tmpl'
            }
        }
    });
    /*magix依赖的任务加载开始*/
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    /*magix依赖的任务加载结束*/
    grunt.loadNpmTasks('magix-app-build');
    grunt.registerTask('default', ['magix']);
};
```







