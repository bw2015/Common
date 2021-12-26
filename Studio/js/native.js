//Returns the type of an object.
//obj - (object) The object to inspect.
// Returns:
// 'element' - (string) If object is a DOM element node.
// 'elements' - (string) If object is an instance of Elements.
// 'textnode' - (string) If object is a DOM text node.
// 'whitespace' - (string) If object is a DOM whitespace node.
// 'arguments' - (string) If object is an arguments object.
// 'array' - (string) If object is an array.
// 'object' - (string) If object is an object.
// 'string' - (string) If object is a string.
// 'number' - (string) If object is a number.
// 'date' - (string) If object is a date.
// 'boolean' - (string) If object is a boolean.
// 'function' - (string) If object is a function.
// 'regexp' - (string) If object is a regular expression.
// 'class' - (string) If object is a Class (created with new Class or the extend of another class).
// 'collection' - (string) If object is a native HTML elements collection, such as childNodes or getElementsByTagName.
// 'window' - (string) If object is the window object.
// 'document' - (string) If object is the document object.
// 'domevent' - (string) If object is an event.
// 'null' - (string) If object is undefined, null, NaN or none of the above.
!function () {
    // 工具方法
    let studio = this.webstudio = {
        version: '1.0.0',
        author: '529422872adfff401b901b8b6c7ca5114ee95e2b'
    };

    let typeOf = this.typeOf = function (item) {
        if (item === null) return 'null';
        if (item === undefined) return "undefined";
        if (item.nodeName) {
            if (item.nodeType === 1) return "element";
            if (item.nodeType === 3) return (/\S/).test(item.nodeValue) ? 'textnode' : 'whitespace';
        }
        if (typeof item === "object") {
            if (item instanceof Array) return "array";
            if (item instanceof Date) return "date";
            if (item instanceof File) return "file";
            if (item instanceof Blob) return "blob";
            if (item instanceof RegExp) return "regex";
            if (item instanceof Boolean) return "bool";
        }

        return typeof (item);
    };

    let extend = studio.extend = function () {
        let args = arguments;
        if (!args || !args.length) return null;
        if (args.length === 1) return args[1];
        let result = new Object();
        for (let index = 0; index < args.length; index++) {
            if (!args[index]) continue;
            for (let key in args[index]) {
                result[key] = args[index][key];
            }
        }
        return result;
    };


}.apply(window);

if (!window["Fx"]) {
    window["Fx"] = new Object();
}
// 数组扩展
!function () {

    // 数组中是否存在
    Array.prototype.any = function (predicate) {
        let list = this;
        for (let index = 0; index < list.length; index++) {
            if (predicate.apply(list, [list[i]])) {
                return true;
            }
        }
        return false;
    };

    // 返回前多少行
    Array.prototype.take = function (count) {
        let array = this;
        return array.filter((item, index) => index < count);
    };

    // 跳过前多少个
    Array.prototype.take = function(count){
        let array = this;
        return array.filter((item,index)=>item>=count);
    };

}();!function () {

    // 格式化日期类型
    Date.prototype.ToString = function (t) {
        var e = { "M+": this.getMonth() + 1, "d+": this.getDate(), "h+": this.getHours(), "m+": this.getMinutes(), "s+": this.getSeconds(), "q+": Math.floor((this.getMonth() + 3) / 3), S: this.getMilliseconds() };
        /(y+)/.test(t) && (t = t.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))); for (var n in e) e.hasOwnProperty(n) && new RegExp("(" + n + ")").test(t) && (t = t.replace(RegExp.$1, 1 === RegExp.$1.length ? e[n] : ("00" + e[n]).substr(("" + e[n]).length)));
        return t;
    };
}();﻿// Element 扩展
!function () {

    // 获取父级
    Element.prototype.getParent = function (selectors, parentDom) {
        let elem = this,
            parent = elem.parentElement;
        while (parent) {
            if (parent.matches(selectors)) return parent;
            parent = parent.parentElement;
        }
        return null;
    }

    // 获取属性
    Element.prototype.get = function (attributeName) {
        let elem = this;
        return elem.getAttribute(attributeName);
    };

    // 设定属性
    Element.prototype.set = function (attributeName, value) {
        let elem = this;
        elem.setAttribute(attributeName, value);
    };

    // 获取子元素
    Element.prototype.getChild = function (selectors) {
        let elem = this;
        return elem.querySelector(selectors);
    };

    // 事件
    Element.prototype.addEvent = function (eventName, arg0, arg1) {
        let elem = this,
            selectors = null,
            listener = null;
        if (typeOf(arg0) === "string" && typeOf(arg1) === "function") {
            selectors = arg0;
            listener = arg1;
            elem.addEventListener(eventName, function (e) {
                let currentTarget = null;
                for (let index = 0; index < e.path.indexOf(elem); index++) {
                    if (e.path[index].matches(selectors)) {
                        currentTarget = e.path[index];
                        break;
                    }
                }
                if (!currentTarget) return false;
                e.current = currentTarget;
                listener.apply(this, [e]);
            });
        } else if (typeOf(arg0) === "function") {
            listener = arg0;
            elem.addEventListener(eventName, function (e) {
                e.current = elem;
                listener.apply(this, [e]);
            });
        }
    };

    // 批量添加事件
    Element.prototype.addEvents = function (events, selectors) {
        let elem = this;
        for (let eventName in events) {
            let listener = events[eventName];
            if (selectors) {
                elem.addEvent(eventName, selectors, listener);
            } else {
                elem.addEvent(eventName, listener);
            }
        }
    };

    // 获取或者设置 html内容
    Element.prototype.html = function (html) {
        let elem = this;
        if (html) {
            elem.innerHTML = html;
            return html;
        }
        return elem.innerHTML;
    };

    // 在Dom元素上设置存储内容
    Element.prototype.setData = function (name, data) {
        let elem = this;
        if (!elem.data) elem.data = new Object();
        elem.data[name] = data;
        return elem.data;
    };

    // 获取存于Dom上的内容
    Element.prototype.getData = function (name) {
        let elem = this;
        if (!elem.data) return null;
        return elem.data[name];
    }

    // 获取所有表单元素的内容（如果出现重名则加载为数组）
    Element.prototype.getField = function (attributeName) {
        if (!attributeName) attributeName = "name";
        let elem = this,
            data = {};

        elem.querySelectorAll("[" + attributeName + "]").forEach(item => {
            let name = item.getAttribute(attributeName);
            if (!name) return;
            switch (item.tagName) {
                case "SELECT":
                case "TEXTAREA":
                    data[name] = item.value;
                    break;
                case "INPUT":
                    switch (item.getAttribute("type")) {
                        case "radio":
                            if (item.checked) data[name] = item.value;
                            break;
                        case "checkbox":
                            if (item.checked) {
                                if (!data[name]) data[name] = [];
                                data[name].push(item.value);
                            }
                            break;
                        default:
                            data[name] = item.value;
                            break;
                    }
                    break;
            }
        });
        for (var key in data) {
            if (Array.isArray(data[key])) data[key] = data[key].join(",");
        }
        return data;
    }

    // 异步加载html内容
    Element.prototype.load = function (options) {
        let elem = this;

    };

}();﻿/// <reference path="native.core.js" />
// Fetch 扩展
!function () {
    class Request {

        constructor(options) {
            let headers = {
                "user-agent": navigator.userAgent,
                "X-Forwarded-Site": location.host
            };
            this.options = webstudio.extend({
                base_url: null
            }, options);

            if (!this.options.headers) {
                this.options.headers = headers;
            } else {
                for (let headerName in headers) {
                    if (typeof headers[headerName] === "function") {
                        this.options.headers[headerName] = headers[headerName]();
                    } else {
                        this.options.headers[headerName] = headers[headerName];
                    }
                }
            }
        }

        _getUrl(url) {
            let t = this;
            if (!t.options.base_url) return url;
            if (/^http|^\/\//.test(url)) return url;
            return t.options.base_url + url;
        }

        // 基类方法
        send(options) {
            let t = this,
                headers = new Object();
            for (let headerName in t.options.headers) {
                headers[headerName] = t.options.headers[headerName];
            }
            if (options.headers) {
                headers = webstudio.extend(headers, options.headers);
            }
            for (let headerName in headers) {
                if (typeof headers[headerName] === "function") {
                    headers[headerName] = headers[headerName]();
                }
            }
            options = webstudio.extend(t.options, options);

            let body = options.data,
                type = options.type || "json";

            switch (type) {
                // JSON 格式提交
                case "json":
                    options.method = "POST";
                    headers["content-type"] = "application/json";
                    if (typeOf(body) !== "string") {
                        body = JSON.stringify(body);
                    }
                    break;
                // 表单上传
                case "form":
                    options.method = "POST";
                    headers["content-type"] = "application/x-www-form-urlencoded";
                    if (typeof (body) !== "string") {
                        let postData = [];
                        for (let name in body) {
                            postData.push(name + "=" + body[name]);
                        }
                        body = postData.join("&");
                    }
                    break;
                // 上传文件
                case "file":
                    options.method = "POST";
                    let formData = new FormData();
                    for (let name in options.data) {
                        let data = options.data[name];
                        if (data instanceof Blob) {
                            data = new window.File([data], name, { type: data.type });
                        }
                        formData.append(name, data);
                    }
                    body = formData;
                    console.log(body);
                    break;
                // 加载html内容
                case "html":
                    options.method = "GET";
                    headers["content-type"] = "text/html";
                    break;
            }
            let _loadingResult = options.loading && options.loading();
            fetch(t._getUrl(options.url), {
                body: body,
                cache: options.cache || "no-cache",
                credentials: options.credentials || "same-origin",
                headers: headers,
                method: options.method,
                mode: options.mede || "cors"
            }).then(response => {
                try {
                    options.complete && options.complete(response, _loadingResult);
                } catch (ex) {
                    throw ex;
                }
                let contentType = response.headers.get("content-type");
                if (type === "json" || /.*\/json/i.test(contentType)) {
                    try {
                        return response.json();
                    } catch {
                        return response.text();
                    }
                } else {
                    return response.text();
                }
            }).then(response => {
                if (type === "html") {
                    let parser = new DOMParser(),
                        doc = parser.parseFromString(response, "text/html");
                    options.success && options.success(response, doc);
                } else {
                    options.success && options.success(response);
                }
            }).catch(ex => {
                options.catch && options.catch(ex,) || console.error(ex);
                options.complete && options.complete(ex, _loadingResult);
            });
        };

        // post 提交
        post(options) {
            let t = this;
            options = webstudio.extend({
                method: "POST",
                type: "form"
            }, options);
            t.send(options);
        };

        // 文件上传 
        file(options) {
            let t = this;
            options = webstudio.extend({
                type: "file"
            }, options);
            t.send(options);
        };

        // 获取html内容
        html(options) {
            let t = this;
            options = webstudio.extend({
                type: "html"
            }, options);
            t.send(options)
        }

        // blob内容上传
        blob(blob, fileName) {
            let t = this,
                options = t.options;

            let file = new window.File([blob], fileName, { type: blob.type });
            let formData = new FormData();
            formData.append('file', file);
            options.loading && options.loading();
            fetch(options.url, {
                method: 'POST',
                body: formData
            }).then(response => {
                options.complete && options.complete();
                return response.json();
            })
                .then(json => {
                    options.success && options.success(json);
                })
                .catch(ex => {
                    if (options.catch) {
                        options.catch(ex);
                    } else {
                        console.error(ex);
                    }
                });
        }

    }

    Fx.Request = Request;
}();﻿// 多媒体处理扩展类
Fx.media = new Object();
!function (ns) {
    // 获取视频截图，返回 blob 对象
    ns.getBlob = (video, type) => {
        if (!type) type = "image/png";
        let canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);  // 图片大小和视频分辨率一致
        let strDataURL = canvas.toDataURL(type);   // canvas中video中取一帧图片并转成dataURL
        let arr = strDataURL.split(','),
            arrMatch = arr[0].match(/:(.*?);/);
        if (!arrMatch) return null;
        let mime = arrMatch[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        let blob = new Blob([u8arr], {
            type: mime
        });
        canvas.remove();
        canvas = null;
        return blob;
    };

}(Fx.media);