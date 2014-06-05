/**
 * magix html和js的合并；js作为view的属性；
 */
module.exports = function(grunt) {
    var Fs = require('fs');
    var Helper = require('../libs/helper');
    var jsProc = require('../libs/jsproc');
    //var Converter = require('../libs/unicode');
    /**
     * 构建加了tmpl作为属性的view内容
     * @param  {[type]} key  [文件名称]
     * @param  {[type]} js   [js内容]
     * @param  {[type]} html [html内容]
     * @return {[type]}      [description]
     */

    var formatFileContent = function(tmplKey, js, html, htmlPath) {
        var newViewContent = '';
        //生成view属性
        //newViewContent = jsProc.removeConsoleX(js);
        newViewContent = jsProc.addProp(js, tmplKey, html, htmlPath);
        //newViewContent = Converter.chineseToUnicode(newViewContent);
        return newViewContent;
    };


    grunt.registerMultiTask('combine', 'combine magix html template with js', function() {
        var appHome = this.data.appSrc; //传入js文件夹路径
        var tmplKey = this.data.tmplKey;
        //找到所有views下的html js；html进行压缩；js去掉console然后将html串插入到js中
        var tarFiles = Helper.getAllFiles(appHome);
        var viewJsFiles = Helper.getTypedFiles(tarFiles, ".js");
        for (var i = 0; i < viewJsFiles.length; i++) {
            // var prefix = getAppPrefix(viewJsFiles[i]);
            //找到对应的html
            var tarTmplPath = viewJsFiles[i].split(".js")[0] + ".html";

            var htmlFileContent = '',
                jsFileContent = '';
            var minPath = viewJsFiles[i].split(".js")[0] + ".js";
            if (Fs.existsSync(tarTmplPath) && Fs.existsSync(viewJsFiles[i])) {
                htmlFileContent = Fs.readFileSync(tarTmplPath, "utf8");
                jsFileContent = Fs.readFileSync(viewJsFiles[i], "utf8");
                var minContent = formatFileContent(tmplKey, jsFileContent, htmlFileContent, tarTmplPath.replace(/\\{1,}/g, '/').replace(/\/{2,}/g, '/').replace(/\.html$/, ''));
                Fs.writeFileSync(minPath, minContent, "utf8");
                //去掉html
                grunt.file.delete(tarTmplPath, {
                    force: true
                });
            }
        }
    });
};