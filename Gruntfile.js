/**
 * magix 项目打包脚本
 */
module.exports = function(grunt) {

    var appDir = grunt.option("appDir");
    var destDir = grunt.option("destDir");
    var compress = grunt.option('compress');
    var c2u = grunt.option('c2u');
    var tmplKey = grunt.option('tmplKey') || 'template';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),


        /**
         * 只需要修改配置到这里
         */
        magixbuild: {
            main: {
                src: '/opt/local/share/nginx/html/mbp-new/app/', //magix view 所在的入口文件夹路径
                dest: '/opt/local/share/nginx/html/magix-app-build/build/app/' //处理后文件夹的路径
                
            },
            options: {
                compress: 'normal', //压缩级别
                c2u: false, //中文转化unicode
                tmplKey: 'template' //view对应模板字段的key
            }
        }
    });
    grunt.loadTasks('tasks');

    grunt.registerTask('default', ['magixbuild']);

};