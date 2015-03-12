/*
    author:xinglie.lkf@taobao.com
 */
module.exports = function(grunt) {
    var Helper = require('../libs/helper');
    grunt.registerMultiTask('mincss', 'minify css', function() {
        var jsHome = this.data.src; //传入js文件夹路径
        var tarFiles = Helper.getAllFiles(jsHome);
        var files = Helper.getTypedFiles(tarFiles, ".css");
        var minMap = {};
        var minSuffix = this.data.minSuffix;
        minSuffix = minSuffix == 'no' ? '.css' : minSuffix + '.css';
        for (var i = 0; i < files.length; i++) {
            var tarCss = files[i];
            var destCss = tarCss.split(".css")[0] + minSuffix;
            minMap[destCss] = tarCss;
        }

        grunt.config.set('cssmin', {
            options: {
                keepSpecialComments: true
            },
            combine: {
                files: minMap
            }
        });
        grunt.task.run('cssmin');
    });
};