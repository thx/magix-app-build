/**
 * 将所有的js处理为min.js
 */
module.exports = function(grunt) {
    var Helper = require('../libs/helper');
    grunt.registerMultiTask('minify', 'minify js', function() {
        var jsHome = this.data.src; //传入js文件夹路径
        var compress = this.data.compress;
        var c2u = this.data.c2u;

        var tarFiles = Helper.getAllFiles(jsHome);
        var jsFiles = Helper.getTypedFiles(tarFiles, ".js");
        var jsMinMap = {};
        var isMined = /-min\.js$/i;
        for (var i = 0; i < jsFiles.length; i++) {
            var tarJs = jsFiles[i];
            if (!isMined.test(tarJs)) {
                var destJs = tarJs.split(".js")[0] + "-min.js";
                jsMinMap[destJs] = new Array(tarJs);
            }
        }
        grunt.config.set('uglify', {
            options: {
                compress: {
                    drop_console: true,
                    warnings: false
                },
                sourceMap: compress == 'full',
                preserveComments: 'some',
                ASCIIOnly: !! c2u
            },
            files: {
                files: jsMinMap
            }
        });
        grunt.task.run('uglify');
    });
};