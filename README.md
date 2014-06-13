# Magix应用打包脚本

This is the tools used for the release of Magix Application

## 使用方法

### 首次使用
* 安装node环境
* 安装grunt-cli http://gruntjs.com/getting-started (如果有0.4.0以下版本的grunt 请执行npm uninstall -g grunt卸载，再安装grunt-cli)

### 安装
    npm install magix-product-release

### 根据你的应用配置Gruntfile.js

        magixbuild: {

            main: {

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
                tmplKey: 'template'

            }
        }


### 执行grunt magixbuild即可







