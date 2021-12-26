// Element 扩展
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

}();