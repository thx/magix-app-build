/**
 * magix html和js的合并；js作为view的属性；
 */
module.exports = function(grunt) {
    var Fs = require('fs');
    var Path = require('path');
    var Helper = require('../libs/helper');
    var mtmin = require('../libs/mtmin.js');
    var jsProc = require('../libs/jsproc');
    var Converter = require('../libs/unicode');
    var VIEWS = 'views';
    /**
     * 构建加了tmpl作为属性的view内容
     * @param  {[type]} key  [文件名称]
     * @param  {[type]} js   [js内容]
     * @param  {[type]} html [html内容]
     * @return {[type]}      [description]
     */

    var formatFileContent = function(js, html) {
        var newViewContent = '';
        var minTempContent = mtmin(html);
        //生成view属性
        newViewContent = jsProc.removeConsoleX(js);
        newViewContent = jsProc.addProp(newViewContent, 'template', minTempContent);
        newViewContent = Converter.chineseToUnicode(newViewContent);
        return newViewContent;
    };


    grunt.registerMultiTask('combine', 'combine magix html template with js', function() {
        var appHome = this.data.appSrc; //传入js文件夹路径
        //找到所有views下的html js；html进行压缩；js去掉console然后将html串插入到js中
        var tarFiles = Helper.getAllFiles(appHome, VIEWS);
        var viewJsFiles = Helper.getTypedFiles(tarFiles, ".js");
        for (var i = 0; i < viewJsFiles.length; i++) {
            // var prefix = getAppPrefix(viewJsFiles[i]);
            //找到对应的html
            var tarTmplPath = viewJsFiles[i].split(".js")[0] + ".html";


            var htmlFileContent = '',
                jsFileContent = '';
            var minPath = viewJsFiles[i].split(".js")[0] + ".js";
            if (Fs.existsSync(tarTmplPath)) {
                htmlFileContent = Fs.readFileSync(tarTmplPath, "utf8");
            }
            if (Fs.existsSync(viewJsFiles[i])) {
                jsFileContent = Fs.readFileSync(viewJsFiles[i], "utf8");
            }

            var minContent = formatFileContent(jsFileContent, htmlFileContent);
            Fs.writeFileSync(minPath, minContent, "utf8");
            //去掉html
            if (Fs.existsSync(tarTmplPath)) {
                grunt.file.delete(tarTmplPath, {
                    force: true
                });
            }


        }


    });

};