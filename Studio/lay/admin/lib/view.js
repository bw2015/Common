/**

 @Name：layuiAdmin 视图模块
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：LPPL
    
 */

layui.define(['laytpl', 'layer'], function (exports) {
    var $ = layui.jquery
        , laytpl = layui.laytpl
        , layer = layui.layer
        , setter = layui.setter
        , device = layui.device()
        , hint = layui.hint()

        //对外接口
        , view = function (id) {
            return new Class(id);
        }

        , SHOW = 'layui-show', LAY_BODY = 'LAY_app_body'

        //构造器
        , Class = function (id) {
            this.id = id;
            this.container = $('#' + (id || LAY_BODY));
        };

    //加载中
    view.loading = function (elem) {
        elem.append(
            this.elemLoad = $('<i class="layui-anim layui-anim-rotate layui-anim-loop layui-icon layui-icon-loading layadmin-loading"></i>')
        );
    };

    //移除加载
    view.removeLoad = function () {
        this.elemLoad && this.elemLoad.remove();
    };

    //清除 token，并跳转到登入页
    view.exit = function () {
        let tokenName = typeof setter.request.tokenName === "function" ? setter.request.tokenName() : setter.request.tokenName;

        if (setter.request.removeToken) {
            setter.request.removeToken(tokenName);
        } else {

            //清空本地记录的 token
            layui.data(setter.tableName, {
                key: tokenName
                , remove: true
            });
        }

        //跳转到登入页
        location.hash = '/user/login';
        layer.closeAll();
    };

    //Ajax请求
    view.req = function (options) {
        var that = this
            , success = options.success
            , error = options.error
            , request = setter.request
            , response = setter.response
            , debug = function () {
                return setter.debug
                    ? '<br><cite>URL：</cite>' + options.url
                    : '';
            };

        options.data = options.data || {};
        options.headers = options.headers || {};

        if (request.tokenName) {
            //自动给参数传入默认 token
            //options.data[request.tokenName] = request.tokenName in options.data
            //    ? options.data[request.tokenName]
            //    : (layui.data(setter.tableName)[request.tokenName] || '');

            let tokenName = typeof setter.request.tokenName === "function" ? setter.request.tokenName() : setter.request.tokenName;

            //自动给 Request Headers 传入 token
            if (tokenName in options.headers) {
                options.headers[tokenName] = options.headers[tokenName];
            } else if (request.getToken && typeof request.getToken === "function") {
                options.headers[tokenName] = request.getToken(tokenName);
            } else {
                options.headers[tokenName] = layui.data(setter.tableName)[tokenName] || '';
            }
        }

        if (setter.request.headers) {
            let headers = setter.request.headers();
            for (let key in headers) {
                options.headers[key] = headers[key];
            }
        }

        delete options.success;
        delete options.error;

        if (layui.setter.getUrl) options.url = layui.setter.getUrl(options.url);

        if (layui.setter.request && layui.setter.request.type === "json") {
            options.headers["Content-Type"] = "application/json";
            if (options.data) options.data = JSON.stringify(options.data);
        }

        if (layui.setter.language) {
            options.headers["Language"] = layui.setter.language
        }

        return $.ajax($.extend({
            type: 'post'
            , dataType: 'json'
            , success: function (res) {
                //// 老司机309 如果要求的格式不是json则不走判断流程
                var t = this;
                if (t.dataType !== "json") {
                    typeof success === 'function' && success(res);
                    return;
                }
                var statusCode = response.statusCode;
                //只有 response 的 code 一切正常才执行 done
                if (res[response.statusName] === statusCode.ok) {
                    typeof options.done === 'function' && options.done(res);
                }
                //登录状态失效，清除本地 access_token，并强制跳转到登入页
                else if (statusCode.logout(res)) {
                    view.exit();
                }
                else if (res[response.statusName] === statusCode.faild) {
                    if (!success) layer.alert(res[response.msg], { icon: 2 });

                    if (res.info && res.info.ErrorType && window["GolbalSetting"] && window["GolbalSetting"]["ErrorType"] && window["GolbalSetting"]["ErrorType"][res.info.ErrorType]) {
                        window["GolbalSetting"]["ErrorType"][res.info.ErrorType](res);
                    }
                }
                //其它异常
                else {
                    //// 老司机309 公共的错误页面
                    if (res.info && res.info.ErrorType) {
                        Utils.ErrorPage(res);
                    } else {
                        var error = [
                            '<cite>Error：</cite> ' + (res[response.msgName] || '返回状态码异常')
                            , debug()
                        ].join('');
                        if (setter.debug) view.error(error);
                    }
                }

                //只要 http 状态码正常，无论 response 的 code 是否正常都执行 success
                typeof success === 'function' && success(res);
            }
            , error: function (e, code) {
                if (code === "abort") return;   // 老司机309 主动终止请求不报错
                var error = [
                    '请求异常，请重试<br><cite>错误信息：</cite>' + code
                    , debug()
                ].join('');
                //view.error(error);
                // 错误的处理
                console.error(error);
                typeof error === 'function' && error(res);
            }
        }, options));
    };

    //弹窗
    view.popup = function (options) {
        var success = options.success
            , skin = options.skin;

        delete options.success;
        delete options.skin;

        return layer.open($.extend({
            type: 1
            , title: '提示'
            , content: ''
            , id: 'LAY-system-view-popup'
            , skin: 'layui-layer-admin' + (skin ? ' ' + skin : '')
            , shadeClose: true
            , closeBtn: false
            , success: function (layero, index) {
                var elemClose = $('<i class="layui-icon" close>&#x1006;</i>');
                layero.append(elemClose);
                elemClose.on('click', function () {
                    layer.close(index);
                });
                typeof success === 'function' && success.apply(this, arguments);
            }
        }, options))
    };

    //异常提示
    view.error = function (content, options) {
        return view.popup($.extend({
            content: content
            , maxWidth: 300
            //,shade: 0.01
            , offset: 't'
            , anim: 6
            , id: 'LAY_adminError'
        }, options))
    };


    //请求模板文件渲染
    Class.prototype.render = function (views, params) {
        var that = this, router = layui.router();
        var original = views;   // 原始视图路径
        views = setter.views + views + setter.engine;

        $('#' + LAY_BODY).children('.layadmin-loading').remove();
        view.loading(that.container); //loading

        // 老司机309 增加自定义视图路由
        if (GolbalSetting && GolbalSetting.router && GolbalSetting.router[original]) {
            views = setter.views + GolbalSetting.router[original] + setter.engine;
        }

        //请求模板
        $.ajax({
            url: views
            , type: 'get'
            , dataType: 'html'
            , data: {
                v: (typeof layui.cache.version === "function" ? layui.cache.version(views) : layui.cache.version)
            }
            , success: function (html) {
                html = '<div>' + html + '</div>';

                var elemTitle = $(html).find('title')
                    , title = elemTitle.text() || (html.match(/\<title\>([\s\S]*)\<\/title>/) || [])[1];

                var res = {
                    title: title
                    , body: html
                };

                elemTitle.remove();
                that.params = params || {}; //获取参数

                if (that.then) {
                    that.then(res);
                    delete that.then;
                }

                that.parse(html);
                view.removeLoad();

                if (that.done) {
                    try {
                        that.done(res);
                    } catch (ex) {
                        console.error(ex);
                    }
                    delete that.done;
                }

            }
            , error: function (e) {
                view.removeLoad();

                if (that.render.isError) {
                    return view.error('请求视图文件异常，状态：' + e.status);
                };

                if (e.status === 404) {
                    that.render('template/tips/404');
                } else {
                    that.render('template/tips/error');
                }

                that.render.isError = true;
            }
        });
        return that;
    };

    //解析模板
    Class.prototype.parse = function (html, refresh, callback) {
        var that = this
            , isScriptTpl = typeof html === 'object' //是否模板元素
            , elem = isScriptTpl ? html : $(html)
            , elemTemp = isScriptTpl ? html : elem.find('*[template]')
            , fn = function (options) {
                var tpl = laytpl(options.dataElem.html());

                options.dataElem.after(tpl.render($.extend({
                    params: router.params
                }, options.res)));

                typeof callback === 'function' && callback();

                try {
                    var res = options.res || {};
                    res.params = router.params;
                    options.done && new Function('d', 't', options.done)(res, that);
                } catch (e) {
                    console.error(options.dataElem[0], '\n存在错误回调脚本\n\n', e);
                }
            }
            , router = layui.router();

        elem.find('title').remove();
        that.container[refresh ? 'after' : 'html'](elem.children());

        router.params = that.params || {};

        //遍历模板区块
        for (var i = elemTemp.length; i > 0; i--) {
            (function () {
                var dataElem = elemTemp.eq(i - 1)
                    , layDone = dataElem.attr('lay-done') || dataElem.attr('lay-then') //获取回调
                    , url = laytpl(dataElem.attr('lay-url') || '').render(router) //接口 url
                    , data = laytpl(dataElem.attr('lay-data') || '').render(router) //接口参数
                    , headers = laytpl(dataElem.attr('lay-headers') || '').render(router); //接口请求的头信息

                try {
                    data = new Function('return ' + data + ';')();
                } catch (e) {
                    hint.error('lay-data: ' + e.message);
                    data = {};
                }

                try {
                    headers = new Function('return ' + headers + ';')();
                } catch (e) {
                    hint.error('lay-headers: ' + e.message);
                    headers = headers || {};
                }

                if (url) {
                    // 老司机309 增加control类型，可加载指定页面
                    var type = dataElem.attr('lay-type') || 'get';
                    switch (type) {
                        case "control":
                            var elemId = dataElem.attr("id");
                            if (!elemId) { elemId = "control-" + new Date().getTime(); dataElem.attr("id", elemId); }
                            view(elemId).render(url, data).then(function () {
                                //视图文件请求完毕，视图内容渲染前的回调
                            }).done(function () {
                                new Function('d', layDone)(dataElem);
                            });
                            break;
                        default:
                            view.req({
                                type: type
                                , url: url
                                , data: data
                                , dataType: 'json'
                                , headers: headers
                                , success: function (res) {
                                    fn({
                                        dataElem: dataElem
                                        , res: res
                                        , done: layDone
                                    });
                                }
                            });
                            break;
                    }
                } else {
                    fn({
                        dataElem: dataElem
                        , done: layDone
                    });
                }
            }());
        }

        return that;
    };

    //直接渲染字符
    Class.prototype.send = function (views, data) {
        var tpl = laytpl(views || this.container.html()).render(data || {});
        this.container.html(tpl);
        return this;
    };

    //局部刷新模板
    Class.prototype.refresh = function (callback) {

        var that = this
            , next = that.container.next()
            , templateid = next.attr('lay-templateid');

        if (that.id != templateid) return that;

        that.parse(that.container, 'refresh', function () {
            that.container.siblings('[lay-templateid="' + that.id + '"]:last').remove();
            typeof callback === 'function' && callback();
        });

        return that;
    };

    //视图请求成功后的回调
    Class.prototype.then = function (callback) {
        this.then = callback;
        return this;
    };

    //视图渲染完毕后的回调
    Class.prototype.done = function (callback) {
        this.done = callback;
        return this;
    };

    //对外接口
    exports('view', view);
});