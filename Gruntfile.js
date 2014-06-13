/**
 * magix 项目打包脚本
 */
module.exports = function(grunt) {
    var src = grunt.option("src");
    var dest = grunt.option("dest");
    var compress = grunt.option('compress');
    var c2u = grunt.option('c2u') || false;
    var tmplKey = grunt.option('tmplKey') || 'template';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        /**
         * 只需要修改配置到这里
         */
        magixbuild: {
            main: {
                src: src, //magix view 所在的入口文件夹路径
                dest: dest //处理后文件夹的路径
            },
            options: {
                compress: compress, //压缩级别
                c2u: c2u, //中文转化unicode
                tmplKey: tmplKey //view对应模板字段的key
            }
        }
    });
    grunt.loadTasks('tasks');
    grunt.registerTask('default', ['magixbuild']);
};