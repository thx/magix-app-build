/**
 * 设置配置路径
 */
module.exports = function(grunt) {


    grunt.registerMultiTask('build', 'set config to build', function() {

        var src = this.data.src;
        var dest = this.data.dest;
        var c2u = this.data.c2u;
        var tmplKey = this.data.tmplKey;
        var compress = this.data.compress;
     
        grunt.config.set('clean', {
            build: {
                src: dest
            },
            options: {
                force: true
            }
        });

        grunt.config.set('copy', {
            main: {
                files: [{
                    expand: true,
                    cwd: src,
                    src: ['**'],
                    dest: dest
                }]
            }
        });


        grunt.config.set('combine', {
            build: {
                appSrc: dest,
                tmplKey: tmplKey
            }
        });

        grunt.config.set('minify', {
            build: {
                src: dest,
                compress: compress
            }
        });


        grunt.config.set('mincss', {
            build: {
                src: dest
            }
        });

        grunt.config.set('clear', {
            build: {
                src: dest,
                compress: compress,
                c2u: c2u
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