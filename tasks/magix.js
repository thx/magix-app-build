/**
 * 设置配置路径
 */
module.exports = function(grunt) {


    var path = require('path');
    var tasks = __dirname.split('tasks')[0] + 'node_modules/grunt-*/tasks';
    //处理外层引用不到内层的node_modules问题
    grunt.file.expand(tasks).forEach(grunt.loadTasks);

    var combine = require('./combine');
    var clear = require('./clear');
    var cssmin = require('./cssmin');
    var minify = require('./minify');

    grunt.registerMultiTask('magix', 'set config to build', function() {

        var src = this.data.src;
        var dest = this.data.dest;
        //this.template是一个方法
        var options = this.options({
            c2u: '',
            tmplKey: '',
            compress: ''

        });
        var c2u = options.c2u;
        var tmplKey = options.tmplKey;
        var compress = options.compress;

        console.log('options:',c2u, tmplKey, compress);
        grunt.verbose.writeflags(options, 'Options');

        grunt.initConfig({
            clean: {
                build: {
                    src: dest
                },
                options: {
                    force: true
                }
            },
            copy: {
                main: {
                    files: [{
                        expand: true,
                        cwd: src,
                        src: ['**'],
                        dest: dest
                    }]
                }
            },
            combine: {
                build: {
                    appSrc: dest,
                    tmplKey: tmplKey
                }
            },
            minify: {
                build: {
                    src: dest,
                    compress: compress
                }
            },
            mincss: {
                build: {
                    src: dest
                }
            },
            clear: {
                build: {
                    src: dest,
                    compress: compress,
                    c2u: c2u
                }
            }
        });

        
        grunt.task.run('clean');
        grunt.task.run('copy');
        grunt.task.run('combine');
        grunt.task.run('minify');
        grunt.task.run('mincss');
        grunt.task.run('clear');


    });
};