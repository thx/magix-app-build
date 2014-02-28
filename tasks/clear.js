/**
 * 清楚模板和原始js文件
 */
module.exports = function(grunt) {
    var Helper = require('../libs/helper');
    var Converter = require('../libs/unicode');

    grunt.registerMultiTask('clear', 'clear empty files', function() {
        var appHome = this.data.src; //传入app文件夹路径
        var compress = this.data.compress;
        var c2u = this.data.c2u;

        if (compress == 'mini') {
            var tarFiles = Helper.getAllFiles(appHome);
            var viewJsFiles = Helper.getTypedFiles(tarFiles, ".js");

            for (var i = 0; i < viewJsFiles.length; i++) {
                if (viewJsFiles[i].indexOf('-min') == -1) {
                    grunt.file.delete(viewJsFiles[i], {
                        force: true
                    });
                }
            }
        }

        if (c2u) {
            var files = Helper.getAllFiles(appHome, "-min.js");
            var translate = function(content) {
                return Converter.chineseToUnicode(content);
            };
            for (var idx = 0; idx < files.length; idx++) {
                grunt.file.copy(files[idx], files[idx], {
                    encoding: 'utf-8',
                    process: translate
                });
            }
        }
    });
};