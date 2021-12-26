/// <reference path="native.core.js" />
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
}();