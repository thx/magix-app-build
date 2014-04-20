(function() {
    var acorn = require('./acorn.js');
    var acorn_walk = require('./acorn_walk.js');
    module.exports = {
        removeConsoleX: function(s) {
            /// <param name="s" type="String"></param>
            var ast = acorn.parse(s);
            var arr = [];

            function add(start, end) {
                for (var i = 0; i < arr.length; ++i) {
                    if (arr[i][0] <= start && arr[i][1] >= end) return;
                }
                for (var i = arr.length - 1; i >= 0; --i) {
                    if (arr[i][0] >= start && arr[i][1] <= end) arr.splice(i, 1);
                }
                arr.push([start, end]);
            }
            acorn_walk.simple(ast, {
                ExpressionStatement: function(node) {
                    var x = node.expression;
                    if (x.type == 'CallExpression' && x.callee.type == 'MemberExpression' && x.callee.object.type == 'Identifier' && x.callee.object.name == 'console') {
                        add(node.start, node.end);
                    }
                }
            });
            arr.sort(function(a, b) {
                return a[0] - b[0];
            });
            if (arr.length) {
                arr.push([s.length]);
                var r = '';
                if (arr[0][0] > 0) {
                    r = s.slice(0, arr[0][0]);
                }
                for (var i = 1; i < arr.length; ++i) {
                    r += ';' + s.slice(arr[i - 1][1], arr[i][0]);
                }
                return r;
            }
            return s;
        },
        addProp: function(s, name, value) {
            /// <param name="s" type="String"></param>
            /// <param name="name" type="String"></param>
            /// <param name="value" type="String"></param>
            var ast = acorn.parse(s);
            if (ast.body.length == 1) {
                var t = ast.body[0];
                var body;
                if (t.type == 'ExpressionStatement') {
                    t = t.expression;
                    if (t.type == 'CallExpression') {
                        if (t.callee.object && t.callee.object.type == 'Identifier' && t.callee.type == 'MemberExpression' && t.callee.object.name == 'KISSY' && t.callee.property.type == 'Identifier' && t.callee.property.name == 'add' && t.arguments.length >= 2 && t.arguments[1].type == 'FunctionExpression') {
                            body = t.arguments[1].body.body;
                        } else if (t.callee.name = 'define' && t.callee.type == 'Identifier' && t.arguments.length >= 1) {
                            for (var i = 0; i < t.arguments.length; i++) {
                                if (t.arguments[i].type == 'FunctionExpression') {
                                    body = t.arguments[i].body.body;
                                    break;
                                }
                            }
                        }
                    }
                    if (body) {
                        t = body; //stmts
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
                                if (t.arguments.length && t.callee && t.callee.property && t.callee.property.name == 'extend' && t.arguments[0].type == 'ObjectExpression') {
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
                }
            }
            return s;
        }
    };

})();