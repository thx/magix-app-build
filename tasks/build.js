/**
 * 设置配置路径
 */
module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt, {pattern: 'grunt-contrib-*'});

    var combine = require('./combine');
    var clear = require('./clear');
    var cssmin = require('./cssmin');
    var minify = require('./minify');

    grunt.registerMultiTask('build', 'set config to build', function() {

        var src = this.data.src;
        var dest = this.data.dest;
        var c2u = this.data.c2u;
        var tmplKey = this.data.tmplKey;
        var compress = this.data.compress;

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