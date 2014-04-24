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
        return t.callee.object && t.callee.object.type == 'Identifier' && t.callee.type == 'MemberExpression' && t.callee.object.name == 'KISSY' && t.callee.property.type == 'Identifier' && t.callee.property.name == 'add' && t.arguments.length >= 2 && t.arguments[1].type == 'FunctionExpression';
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
    var mreqeustMehtods = {
        fetchAll: 1,
        saveAll: 1,
        fetchOne: 1,
        saveOne: 1,
        fetchOrder: 1,
        saveOrder: 1
    };
    var processMRequest = function(ast, path) {
        var thisObj = {};
        var varMRequests = {};
        var maybeMissing = {};
        var managedReqeusts = {};
        var lastVar;

        acorn_walk.simple(ast, {
            CallExpression: function(node) {
                if (node.callee && node.callee.type == 'MemberExpression') {
                    if (mreqeustMehtods[node.callee.property.name] == 1) {
                        var lastArgs = node.arguments[node.arguments.length - 1];
                        var managed;
                        if (lastArgs && (lastArgs.type == 'ThisExpression' || (lastArgs.type == 'Identifier' && thisObj[lastArgs.name] == 1))) {
                            managed = true;
                        }
                        var left = node.callee.object.name;
                        if (!managed) {
                            var origin = varMRequests[left];
                            managed = ( !! managedReqeusts[origin]) || lastVar == left;
                        }
                        //console.log(lastArgs, thisObj);
                        var o = managed ? managedReqeusts : maybeMissing;
                        o[node.callee.start + '~' + node.callee.end] = node.callee.object.name + '.' + node.callee.property.name;
                    } else if (node.callee.property.name == 'manage' && (node.callee.object.type == 'ThisExpression' || thisObj[node.callee.object.name] == 1)) {
                        var last = node.arguments[node.arguments.length - 1];
                        if (last && last.type == 'Identifier') {
                            var mapped = varMRequests[last.name];
                            if (mapped) {
                                delete maybeMissing[mapped];
                                //delete varMRequests[last.name];
                            }
                        } else if (last && last.type == 'CallExpression') {
                            if (mreqeustMehtods[last.callee.property.name] == 1) {
                                delete maybeMissing[last.callee.start + '~' + last.callee.end];
                            }
                        }
                    }
                }
            },
            VariableDeclaration: function(node) {
                if (node.kind == 'var' && node.declarations && node.declarations.length) {
                    for (var i = 0; i < node.declarations.length; i++) {
                        var declaration = node.declarations[i];
                        if (declaration.init) {
                            switch (declaration.init.type) {
                                case 'CallExpression':
                                    if (declaration.init.callee.type == 'MemberExpression' && mreqeustMehtods[declaration.init.callee.property.name] == 1) {
                                        varMRequests[lastVar = declaration.id.name] = declaration.init.callee.start + '~' + declaration.init.callee.end;
                                    }
                                    break;
                                case 'ThisExpression':
                                    thisObj[declaration.id.name] = 1;
                                    break;
                                case 'Identifier':
                                    if (thisObj[declaration.init.name]) {
                                        thisObj[declaration.id.name] = 1;
                                    }
                                    if (varMRequests[declaration.init.name]) {
                                        varMRequests[declaration.id.name] = varMRequests[declaration.init.name];
                                    }
                                    break;
                            }
                        }
                    }
                }
            },
            AssignmentExpression: function(node) {
                if (node.right && node.right.type == 'CallExpression' && node.right.callee.type == 'MemberExpression' && mreqeustMehtods[node.right.callee.property.name] == 1) {
                    varMRequests[lastVar = node.left.name] = node.right.callee.start + '~' + node.right.callee.end;
                }
            }
        });

        for (var p in maybeMissing) {
            if (supportColor) {
                console.log('WARN: \033[35mMaybe missing manage: ' + maybeMissing[p] + ' @ ' + path + '\033[0m');
            } else {
                console.warn('WARN: Maybe missing manage: ' + maybeMissing[p] + ' @ ' + path);
            }
        }

    };
    module.exports = {
        /*removeConsoleX: function(s) {
            /// <param name="
                s " type="
                String "></param>
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
        },*/
        addProp: function(s, name, value, path) {
            var ast = acorn.parse(s);
            processMRequest(ast, path);

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