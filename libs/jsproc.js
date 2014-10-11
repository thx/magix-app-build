(function() {
    var acorn = require('./acorn.js');
    var acorn_walk = require('./acorn_walk.js');
    var supportColor = (function() {
        if (process.stdout && !process.stdout.isTTY) {
            return false;
        }
        if (process.platform === 'win32') {
            return true;
        }
        if ('COLORTERM' in process.env) {
            return true;
        }
        if (process.env.TERM === 'dumb') {
            return false;
        }
        if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
            return true;
        }
    }());
    var isKissy = function(t) {
        return t.callee.object && t.callee.object.type == 'Identifier' && t.callee.type == 'MemberExpression' && t.callee.object.name == 'KISSY' && t.callee.property.type == 'Identifier' && t.callee.property.name == 'add' && ((t.arguments.length >= 2 && t.arguments[1].type == 'FunctionExpression') || (t.arguments.length >= 1 && t.arguments[0].type == 'FunctionExpression'));
    };
    var isDefine = function(t) {
        return t.callee.name == 'define' && t.callee.type == 'Identifier' && t.arguments.length > 1;
    };
    var findBestBody = function(ast, path) {
        var best, len = -1;
        for (var j = ast.body.length - 1; j >= 0; j--) {
            var body = ast.body[j];
            var expression = body.expression;
            var tl;
            if (body.type == 'ExpressionStatement' && expression && expression.type == 'CallExpression') {
                if (isKissy(expression)) {
                    tl = expression.arguments[0].value.length;
                    if (tl > len && path.slice(-tl) == expression.arguments[0].value) {
                        best = expression.arguments[1].body.body;
                        len = tl;
                    }
                } else if (isDefine(expression)) {
                    tl = expression.arguments[0].value.length;
                    if (tl > len && path.slice(-tl) == expression.arguments[0].value) {
                        for (var i = 0; i < expression.arguments.length; i++) {
                            if (expression.arguments[i].type == 'FunctionExpression') {
                                best = expression.arguments[i].body.body;
                                break;
                            }
                        }
                    }
                }
            }
        }
        return best;
    };
    module.exports = {
        addProp: function(s, name, value, path) {
            var ast = acorn.parse(s);

            var body = findBestBody(ast, path);
            if (body) {
                var t = body; //stmts
                var content = JSON.stringify(value).replace(/[\u2028\u2029]/g, function(a) {
                    return a == '\u2028' ? '\\u2028' : '\\u2029';
                });
                var key = '___$___temp' + new Date().getTime();
                for (var i = 0; i < t.length; ++i) {
                    if (t[i].type == 'ReturnStatement') {
                        t = t[i].argument;
                        var start = t.start;
                        var end = t.end;
                        var returned = s.slice(start, end).replace(/\.extend\s*\(\s*\{/, '.extend({');

                        var tail = s.slice(end);
                        var header = s.slice(0, start);
                        header = header.slice(0, header.lastIndexOf('return'));
                        if (t.arguments && t.arguments.length && t.callee && t.callee.property && t.callee.property.name == 'extend' && t.arguments[0].type == 'ObjectExpression') {
                            var extendIdx = returned.indexOf('.extend({') + 9;
                            var extendedPre = returned.slice(0, extendIdx);
                            var extendTail = returned.slice(extendIdx + 1);
                            s = header + ' return ' + extendedPre + name + ':' + content + ',' + extendTail + tail;
                        } else {
                            s = header + ';var ' + key + '=' + returned + ';' + key + '.prototype.' + name + '=' + content + ';return ' + key + ';' + tail;
                        }
                    }
                }
            }
            return s;
        }
    };

})();